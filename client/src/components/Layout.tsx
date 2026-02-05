import { cn } from "@/lib/data";
import { Home, Trophy, Flame, User, PlusCircle, Search, Menu, X, Activity } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { usePost } from "@/contexts/PostContext";
import { useSearch } from "@/contexts/SearchContext";
import { DUMMY_POSTS } from "@/lib/data";

interface LayoutProps {
  children: React.ReactNode;
}

function CreatePostButton() {
  const { openCreateModal } = usePost();
  return (
    <Button 
      onClick={openCreateModal}
      className="hidden md:flex gap-2 font-display font-semibold bg-primary hover:bg-primary/90"
    >
      <PlusCircle className="h-4 w-4" />
      投稿
    </Button>
  );
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { posts } = usePost();
  const { searchQuery, setSearchQuery, selectedSport, setSelectedSport } = useSearch();

  // トレンドタグを計算
  const allPosts = [...posts, ...DUMMY_POSTS];
  const tagCounts: Record<string, number> = {};
  allPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const trendingTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const navItems = [
    { icon: Home, label: "ホーム", href: "/" },
    { icon: Flame, label: "トレンド", href: "/trending" },
    { icon: Trophy, label: "ランキング", href: "/rankings" },
    { icon: User, label: "プロフィール", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#c20000] text-white font-display text-lg font-bold">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-bold tracking-tight hidden sm:inline">
                  OshiBase
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="キーワード、タグで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 bg-secondary/50 border-border text-sm focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreatePostButton />
            <div className="h-8 w-8 rounded-lg bg-secondary overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors">
              <img
                src={import.meta.env.BASE_URL + "/images/avatar-user.jpg" }
                alt="ユーザー" 
                className="h-full w-full object-cover" 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container flex-1 items-start md:grid md:grid-cols-[200px_minmax(0,1fr)_280px] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:gap-8 pt-4 pb-8">
        {/* 左サイドバー（ナビゲーション） */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:bg-transparent md:border-r-0 md:w-full md:top-16",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <nav className="flex flex-col gap-1 p-4 md:p-0">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            
            <div className="mt-8 md:hidden">
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase">スポーツ</h3>
              <div className="space-y-1">
                {[
                  { label: "バスケ", value: "Basketball" },
                ].map((sport) => (
                  <Button 
                    key={sport.value}
                    variant="ghost" 
                    className="w-full justify-start font-normal text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    onClick={() => setSelectedSport(sport.value as any)}
                  >
                    # {sport.label}
                  </Button>
                ))}
              </div>
            </div>
          </nav>
        </aside>

        {/* モバイルオーバーレイ */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* メインコンテンツ */}
        <main className="relative flex flex-col gap-6 min-w-0">
          {children}
        </main>

        {/* 右サイドバー（トレンド） */}
        <aside className="hidden md:flex flex-col gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          {/* トレンドタグ */}
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h3 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4" style={{ color: "#c20000" }} /> トレンド
            </h3>
            <div className="space-y-3">
              {trendingTags.length > 0 ? (
                trendingTags.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between group/item cursor-pointer hover:bg-secondary/50 p-2 rounded transition-colors"
                    onClick={() => setSearchQuery(item.tag)}
                  >
                    <span className="text-sm font-medium group-hover/item:text-[#c20000] transition-colors">{item.tag}</span>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">トレンドはまだありません</p>
              )}
            </div>
          </div>
          
          {/* フッターリンク */}
          <div className="text-xs text-muted-foreground flex flex-wrap gap-2 px-2">
            <a href="#" className="hover:underline">について</a>
            <span>•</span>
            <a href="#" className="hover:underline">プライバシー</a>
            <span>•</span>
            <a href="#" className="hover:underline">利用規約</a>
            <span>•</span>
            <span>© 2026 SportsClip</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
