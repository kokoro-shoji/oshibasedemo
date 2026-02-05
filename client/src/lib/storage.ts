// ローカルストレージのキー
const LIKES_KEY = "sportsclip_likes";
const SHARES_KEY = "sportsclip_shares";

interface LikesData {
  [postId: string]: number;
}

interface SharesData {
  [postId: string]: number;
}

/**
 * いいね数をローカルストレージから取得
 */
export function getLikesFromStorage(): LikesData {
  try {
    const data = localStorage.getItem(LIKES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to get likes from storage:", error);
    return {};
  }
}

/**
 * 特定の投稿のいいね数をローカルストレージから取得
 */
export function getLikeCount(postId: string): number {
  const likes = getLikesFromStorage();
  return likes[postId] || 0;
}

/**
 * いいね数をローカルストレージに保存
 */
export function saveLikesToStorage(likes: LikesData): void {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
  } catch (error) {
    console.error("Failed to save likes to storage:", error);
  }
}

/**
 * 投稿のいいね数を更新
 */
export function updateLikeCount(postId: string, increment: number): number {
  const likes = getLikesFromStorage();
  const currentCount = likes[postId] || 0;
  const newCount = Math.max(0, currentCount + increment);
  likes[postId] = newCount;
  saveLikesToStorage(likes);
  return newCount;
}

/**
 * 投稿がいいね済みかどうかを確認
 */
export function isPostLiked(postId: string): boolean {
  const likes = getLikesFromStorage();
  return (likes[postId] || 0) > 0;
}

/**
 * 投稿のいいね状態を切り替え
 */
export function toggleLike(postId: string, currentLikeCount: number): { isLiked: boolean; newCount: number } {
  const likes = getLikesFromStorage();
  const isCurrentlyLiked = (likes[postId] || 0) > 0;

  if (isCurrentlyLiked) {
    // いいねを取り消す
    likes[postId] = 0;
  } else {
    // いいねを追加
    likes[postId] = currentLikeCount + 1;
  }

  saveLikesToStorage(likes);
  return {
    isLiked: !isCurrentlyLiked,
    newCount: likes[postId],
  };
}

/**
 * シェア数をローカルストレージから取得
 */
export function getSharesFromStorage(): SharesData {
  try {
    const data = localStorage.getItem(SHARES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Failed to get shares from storage:", error);
    return {};
  }
}

/**
 * 特定の投稿のシェア数をローカルストレージから取得
 */
export function getShareCount(postId: string): number {
  const shares = getSharesFromStorage();
  return shares[postId] || 0;
}

/**
 * シェア数をローカルストレージに保存
 */
export function saveSharesToStorage(shares: SharesData): void {
  try {
    localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
  } catch (error) {
    console.error("Failed to save shares to storage:", error);
  }
}

/**
 * 投稿のシェア数を増加
 */
export function incrementShareCount(postId: string): number {
  const shares = getSharesFromStorage();
  const currentCount = shares[postId] || 0;
  const newCount = currentCount + 1;
  shares[postId] = newCount;
  saveSharesToStorage(shares);
  return newCount;
}

/**
 * 投稿削除時にストレージからデータを削除
 */
export function deletePostData(postId: string): void {
  try {
    const likes = getLikesFromStorage();
    const shares = getSharesFromStorage();
    
    delete likes[postId];
    delete shares[postId];
    
    saveLikesToStorage(likes);
    saveSharesToStorage(shares);
  } catch (error) {
    console.error("Failed to delete post data from storage:", error);
  }
}

/**
 * すべてのストレージデータをクリア（デバッグ用）
 */
export function clearAllStorage(): void {
  try {
    localStorage.removeItem(LIKES_KEY);
    localStorage.removeItem(SHARES_KEY);
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
}
