import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SportType = "Basketball";

export interface Post {
  id: string;
  title: string;
  description: string;
  sport: SportType;
  tags: string[];
  mediaUrl: string;
  mediaType: "image" | "video";
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  timestamp: string;
}

export const DUMMY_POSTS: Post[] = [
  {
    id: "dummy-1",
    title: "おとり？",
    description: "このおとり？になってる人、かっけかった、どんな人？",
    sport: "Basketball",
    tags: ["#カッコいい", "#バスケ", "#スーパープレー", "#MVP"],
    mediaUrl: import.meta.env.BASE_URL + "videos/otori.mp4",
    mediaType: "video",
    author: {
      name: "バスキング",
      avatar: import.meta.env.BASE_URL + "/images/bomb.png",
    },

    likes: 892,
    comments: 32,
    timestamp: "4時間前",
  },
  {
    id: "dummy-2",
    title: "決勝戦での3ポイント決定!",
    description: "残り5秒で決勝戦を制する3ポイントシュート。会場全体が沸き立ちました。",
    sport: "Basketball",
    tags: ["#3ポイント", "#決勝戦", "#ハイライト", "#チャンピオン"],
    mediaUrl: import.meta.env.BASE_URL + "/images/hero-basketball.jpg",
    mediaType: "image",
    author: {
      name: "シューター太郎",
      avatar: import.meta.env.BASE_URL + "/images/bibus.png",
    },
    likes: 1560,
    comments: 78,
    timestamp: "2時間前",
  },
  {
    id: "dummy-3",
    title: "○○選手、一直線！",
    description: "転んでたけど、ルーズボールしっかりとってた！かっこいい～～",
    sport: "Basketball",
    tags: ["#推し", "#バスケ", "#戦術", "#隠れたプレー"],
    mediaUrl: import.meta.env.BASE_URL + "videos/loseball.mp4",
    mediaType: "video",

    author: {
      name: "ディフェンダー花子",
      avatar: import.meta.env.BASE_URL + "/images/ribon.png",
    },
    likes: 720,
    comments: 42,
    timestamp: "6時間前",
  },
  {
    id: "dummy-4",
    title: "大きな壁",
    description: "○○選手、スクリーンすごかったなぁ。相手をブロックできていた。",
    sport: "Basketball",
    tags: ["#バスケ", "#スクリーン", "#基礎", "#上達"],
    mediaUrl: import.meta.env.BASE_URL + "/videos/screen.mp4",
    mediaType: "video",
    author: {
      name: "コーチマイク",
      avatar: import.meta.env.BASE_URL + "/images/nuko.png",
    },
    likes: 450,
    comments: 24,
    timestamp: "1日前",
  },
  {
    id: "dummy-5",
    title: "ファストブレイクからのダンク!",
    description: "素早いファストブレイクから相手ディフェンスを置き去りにしてのダンク決定。",
    sport: "Basketball",
    tags: ["#ファストブレイク", "#ダンク", "#スピード", "#テクニック"],
    mediaUrl: import.meta.env.BASE_URL + "/images/hero-basketball.jpg",
    mediaType: "image",
    author: {
      name: "スピードスター",
      avatar: import.meta.env.BASE_URL + "/images/24506_color.png",
    },
    likes: 1100,
    comments: 56,
    timestamp: "1日前",
  },
];

export const TRENDING_TAGS = [
  { name: "#ダンク", count: 450 },
  { name: "#3ポイント", count: 380 },
  { name: "#ハイライト", count: 320 },
  { name: "#バスケ", count: 280 },
  { name: "#トレーニング", count: 220 },
];

export const TOP_RANKING = [
  { name: "バスキング", score: 15400 },
  { name: "シューター太郎", score: 12300 },
  { name: "ディフェンダー花子", score: 11200 },
  { name: "スピードスター", score: 9800 },
  { name: "コーチマイク", score: 8500 },
];
