import { Post, SportType } from "./data";

/**
 * 投稿がキーワード検索にマッチするかチェック
 */
export function matchesSearchQuery(post: Post, query: string): boolean {
  if (!query.trim()) return true;

  const lowerQuery = query.toLowerCase();

  // タイトルで検索
  if (post.title.toLowerCase().includes(lowerQuery)) return true;

  // 説明で検索
  if (post.description.toLowerCase().includes(lowerQuery)) return true;

  // タグで検索（#記号の有無を問わず）
  const cleanQuery = lowerQuery.replace(/^#/, "");
  if (post.tags.some(tag => tag.toLowerCase().includes(cleanQuery))) return true;

  // ユーザー名で検索
  if (post.author.name.toLowerCase().includes(lowerQuery)) return true;

  return false;
}

/**
 * 投稿をスポーツ種目でフィルタリング
 */
export function filterBySport(posts: Post[], sport: SportType | "All"): Post[] {
  if (sport === "All") return posts;
  return posts.filter(post => post.sport === sport);
}

/**
 * 投稿をソート
 */
export function sortPosts(posts: Post[], sortBy: "latest" | "popular"): Post[] {
  const sorted = [...posts];
  if (sortBy === "popular") {
    sorted.sort((a, b) => b.likes - a.likes);
  }
  return sorted;
}

/**
 * 複合フィルタリング・検索・ソート
 */
export function filterAndSearchPosts(
  posts: Post[],
  searchQuery: string,
  sport: SportType | "All",
  sortBy: "latest" | "popular"
): Post[] {
  let filtered = posts;

  // キーワード検索を適用
  filtered = filtered.filter(post => matchesSearchQuery(post, searchQuery));

  // スポーツ種目でフィルタリング
  filtered = filterBySport(filtered, sport);

  // ソート
  filtered = sortPosts(filtered, sortBy);

  return filtered;
}
