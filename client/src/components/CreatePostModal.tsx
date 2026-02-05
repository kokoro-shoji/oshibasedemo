import { useState } from "react";
import { usePost } from "@/contexts/PostContext";
import { Post, SportType } from "@/lib/data";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Upload, Image as ImageIcon, Video, Plus } from "lucide-react";
import { cn } from "@/lib/data";

interface MediaItem {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

export function CreatePostModal() {
  const { isCreateModalOpen, closeCreateModal, addPost, posts } = usePost();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState<SportType>("Basketball");
  const [tags, setTags] = useState("");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sports: SportType[] = ["Basketball"];

  const sportLabels: Record<SportType, string> = {
    Basketball: "バスケ",
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMediaItems: MediaItem[] = [];

    Array.from(files).forEach((file) => {
      // ファイルサイズチェック（10MB以下）
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, media: `${file.name}はファイルサイズが大きすぎます（10MB以下）` }));
        return;
      }

      // ファイルタイプチェック
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        setErrors(prev => ({ ...prev, media: `${file.name}は画像または動画ファイルではありません` }));
        return;
      }

      // プレビュー生成
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        newMediaItems.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview,
          type: isImage ? "image" : "video",
        });

        if (newMediaItems.length === Array.from(files).length) {
          setMediaItems(prev => [...prev, ...newMediaItems]);
          setErrors(prev => ({ ...prev, media: "" }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "タイトルを入力してください";
    }
    if (!description.trim()) {
      newErrors.description = "説明を入力してください";
    }
    if (mediaItems.length === 0) {
      newErrors.media = "画像または動画を選択してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // タグを配列に変換
      const tagArray = tags
        .split(/[\s,]+/)
        .filter(tag => tag.trim())
        .map(tag => (tag.startsWith("#") ? tag : `#${tag}`));

      // 各メディアに対して投稿を作成
      mediaItems.forEach((media, index) => {
        const newPost: Post = {
          id: (posts.length + index + 1).toString(),
          title: mediaItems.length > 1 ? `${title} (${index + 1}/${mediaItems.length})` : title,
          description,
          sport,
          tags: tagArray.length > 0 ? tagArray : ["#新規投稿"],
          mediaUrl: media.preview,
          mediaType: media.type,
          author: {
            name: "demo_user",
            avatar: import.meta.env.BASE_URL +"/images/avatar-user.jpg",
          },
          likes: 0,
          comments: 0,
          timestamp: "今",
        };

        addPost(newPost);
      });

      // フォームをリセット
      setTitle("");
      setDescription("");
      setSport("Basketball");
      setTags("");
      setMediaItems([]);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={closeCreateModal}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">新しい投稿を作成</DialogTitle>
          <DialogDescription>
            スポーツのハイライトや練習風景を共有しましょう
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* メディアアップロード */}
          <div>
            <label className="text-sm font-semibold mb-2 block">メディア（複数選択可）</label>
            
            {/* メディアプレビュー */}
            {mediaItems.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {mediaItems.map((media) => (
                  <div key={media.id} className="relative rounded-lg overflow-hidden bg-secondary border-2 border-border">
                    {media.type === "video" ? (
                      <video
                        src={media.preview}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <img
                        src={media.preview}
                        alt="プレビュー"
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(media.id)}
                      className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* アップロードエリア */}
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  クリックして画像または動画をアップロード
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  複数ファイル選択可 (最大10MB/ファイル)
                </p>
              </div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                multiple
                className="hidden"
              />
            </label>
            {errors.media && <p className="text-xs text-destructive mt-2">{errors.media}</p>}
          </div>

          {/* タイトル */}
          <div>
            <label className="text-sm font-semibold mb-2 block">タイトル</label>
            <Input
              type="text"
              placeholder="例: 劇的なゴール決定!"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, title: "" }));
                }
              }}
              className={cn(errors.title && "border-destructive")}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
          </div>

          {/* 説明 */}
          <div>
            <label className="text-sm font-semibold mb-2 block">説明</label>
            <textarea
              placeholder="この投稿について説明してください..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, description: "" }));
                }
              }}
              className={cn(
                "w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none",
                errors.description && "border-destructive"
              )}
              rows={4}
            />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>

          {/* スポーツ種目 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">スポーツ種目</label>
              <Select value={sport} onValueChange={(value) => setSport(value as SportType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s} value={s}>
                      {sportLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* タグ */}
            <div>
              <label className="text-sm font-semibold mb-2 block">タグ（カンマ区切り）</label>
              <Input
                type="text"
                placeholder="例: ハイライト, ゴール, 劇的"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                スペースまたはカンマで区切ってください
              </p>
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={closeCreateModal}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "投稿中..." : "投稿"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
