import { createContext, useContext, useState } from "react";
import { Post, SportType } from "@/lib/data";

interface PostContextType {
  posts: Post[];
  isCreateModalOpen: boolean;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const addPost = (post: Post) => {
    setPosts([post, ...posts]);
    closeCreateModal();
  };

  const deletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  return (
    <PostContext.Provider value={{ posts, isCreateModalOpen, openCreateModal, closeCreateModal, addPost, deletePost }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within PostProvider");
  }
  return context;
}
