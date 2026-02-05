import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { DUMMY_POSTS, SportType } from "@/lib/data";
import { usePost } from "@/contexts/PostContext";
import { useSearch } from "@/contexts/SearchContext";
import { filterAndSearchPosts } from "@/lib/search";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/data";

export default function Home() {
  const { posts } = usePost();
  const { searchQuery, selectedSport, sortBy, setSortBy, clearFilters } = useSearch();

  // ダミーデータと新規投稿を結合
  const allPosts = [...posts, ...DUMMY_POSTS];

  // フィルタリング・検索・ソートを適用
  const filteredPosts = filterAndSearchPosts(allPosts, searchQuery, selectedSport, sortBy);

  const sports: (SportType | "All")[] = ["All", "Basketball"];

  const sportLabels: Record<string, string> = {
    "All": "すべて",
    "Basketball": "バスケ",
  };

  // アクティブなフィルターがあるかチェック
  const hasActiveFilters = searchQuery || selectedSport !== "All" || sortBy !== "latest";

  return (
    <Layout>
      {/* フィルターバー */}
      <div className="sticky top-16 z-30 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-b border-border/50 md:static md:mx-0 md:px-0 md:py-0 md:bg-transparent md:border-0 md:backdrop-blur-none mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              タイムライン
            </h1>
            
            <div className="flex items-center gap-2 bg-secondary p-1 rounded-lg border border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 text-xs font-medium px-3 rounded transition-all", sortBy === "latest" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                onClick={() => setSortBy("latest")}
              >
                新着順
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 text-xs font-medium px-3 rounded transition-all", sortBy === "popular" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                onClick={() => setSortBy("popular")}
              >
                人気順
              </Button>
            </div>
          </div>

          {/* スポーツフィルタータブ */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => {
                  // Layoutで選択されたスポーツを更新するため、useSearchを使用
                  // ここでは表示のみ
                }}
                className={cn(
                  "flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-semibold uppercase whitespace-nowrap transition-all duration-300 border",
                  selectedSport === sport
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                )}
              >
                {sportLabels[sport]}
              </button>
            ))}
          </div>

          {/* アクティブなフィルター表示 */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              {searchQuery && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                  <span>検索: {searchQuery}</span>
                </div>
              )}
              {selectedSport !== "All" && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
                  <span>{sportLabels[selectedSport]}</span>
                </div>
              )}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  <X className="h-3 w-3 mr-1" />
                  フィルター解除
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 投稿グリッド */}
      <div className="grid gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedSport !== "All"
                ? "検索条件に一致する投稿がありません"
                : "投稿がまだありません"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                フィルターをリセット
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* さらに読み込む */}
      {filteredPosts.length > 0 && (
        <div className="py-8 flex justify-center">
          <Button variant="outline" className="text-xs uppercase tracking-widest border-dashed border-border hover:border-primary hover:text-primary">
            さらに読み込む
          </Button>
        </div>
      )}
    </Layout>
  );
}
