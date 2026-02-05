import { Post } from "@/lib/data";
import { Heart, MessageSquare, Share2, MoreHorizontal, Play, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { cn } from "@/lib/data";
import { toggleLike, incrementShareCount, getLikeCount, getShareCount, deletePostData } from "@/lib/storage";
import { toast } from "sonner";
import { usePost } from "@/contexts/PostContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { deletePost } = usePost();
  const [likesCount, setLikesCount] = useState(post.likes);
  const [sharesCount, setSharesCount] = useState(post.comments);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // マウント時にローカルストレージからデータを読み込む
  useEffect(() => {
    const storedLikeCount = getLikeCount(post.id);
    const storedShareCount = getShareCount(post.id);
    const liked = storedLikeCount > 0;

    setLikesCount(storedLikeCount > 0 ? storedLikeCount : post.likes);
    setSharesCount(storedShareCount > 0 ? storedShareCount : post.comments);
    setIsLiked(liked);
    setIsLoading(false);
  }, [post.id, post.likes, post.comments]);

  
const [open, setOpen] = useState(false);

const VideoModal = () => (
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={()=>setOpen(false)}>
      <div className="relative w-[90%] max-w-4xl" onClick={e=>e.stopPropagation()}>
        <button className="absolute -top-10 right-0 text-white" onClick={()=>setOpen(false)}>×</button>
        <video src={post.mediaUrl} controls autoPlay playsInline className="w-full max-h-[80vh] bg-black rounded" />
      </div>
    </div>
  ) : null
);

  const handleLike = () => {
    const { isLiked: newIsLiked, newCount } = toggleLike(post.id, likesCount);
    setIsLiked(newIsLiked);
    setLikesCount(newCount);
  };

  const handleShare = () => {
    const newShareCount = incrementShareCount(post.id);
    setSharesCount(newShareCount);
    
    // URLをコピー
    const url = `${window.location.origin}?post=${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("投稿のリンクをコピーしました");
    }).catch(() => {
      toast.error("コピーに失敗しました");
    });
  };

  const handleDelete = () => {
    deletePostData(post.id);
    deletePost(post.id);
    toast.success("投稿を削除しました");
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 animate-pulse">
        <div className="h-6 bg-secondary rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-secondary rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md hover:border-primary/30">
      {/* カードヘッダー */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-secondary overflow-hidden border border-border/50">
            <img src={post.author.avatar} alt={post.author.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold">{post.author.name}</p>
              <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
            </div>
            <Badge variant="outline" className="mt-0.5 text-[10px] font-medium uppercase">
              {post.sport}
            </Badge>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* メディアコンテンツ */}
      <div className="relative aspect-video w-full overflow-hidden bg-secondary">
        {post.mediaType === "video" ? (
          <div className="relative h-full w-full flex items-center justify-center group/media cursor-pointer">
             <img src={post.mediaUrl} alt={post.title} className="h-full w-full object-cover opacity-70" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center shadow-md group-hover/media:scale-110 transition-transform duration-300">
                  <Play className="h-5 w-5 text-primary-foreground fill-current ml-0.5" />
                </div>
             </div>
          </div>
        ) : (
          <img 
            src={post.mediaUrl} 
            alt={post.title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        )}
        
        {/* タイトルオーバーレイ */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h2 className="font-display font-semibold text-lg text-white line-clamp-2">{post.title}</h2>
        </div>
      </div>

      {/* コンテンツボディ */}
      <div className="p-4 pt-3">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-[#c20000]/10 text-[#c20000] hover:bg-[#c20000]/20 cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>

        {/* アクションバー */}
        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("gap-1.5 px-2 h-8 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors", isLiked && "text-primary")}
              onClick={handleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs font-medium">{likesCount}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-1.5 px-2 h-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-medium">{post.comments}</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1.5 px-2 h-8 text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{sharesCount > 0 ? sharesCount : "共有"}</span>
          </Button>
        </div>
      </div>
    <VideoModal />
    </div>
  );
}
