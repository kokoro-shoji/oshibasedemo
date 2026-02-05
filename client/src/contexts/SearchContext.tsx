import { createContext, useContext, useState } from "react";
import { SportType } from "@/lib/data";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedSport: SportType | "All";
  setSelectedSport: (sport: SportType | "All") => void;
  sortBy: "latest" | "popular";
  setSortBy: (sort: "latest" | "popular") => void;
  clearFilters: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState<SportType | "All">("All");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedSport("All");
    setSortBy("latest");
  };

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedSport,
        setSelectedSport,
        sortBy,
        setSortBy,
        clearFilters,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
