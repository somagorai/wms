import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BookmarkedTile {
  id: string;
  title: string;
  type: "operations" | "executive" | "mhe" | "health";
  subType?: string; // For subsections like "services", "servers", "databases", "scanners", etc.
  icon: string; // Icon name
  data: any; // The actual tile data
}

interface BookmarkContextType {
  bookmarkedTiles: BookmarkedTile[];
  addBookmark: (tile: BookmarkedTile) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (tile: BookmarkedTile) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedTiles, setBookmarkedTiles] = useState<BookmarkedTile[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bookmarkedTiles");
    if (stored) {
      try {
        setBookmarkedTiles(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
      }
    }
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("bookmarkedTiles", JSON.stringify(bookmarkedTiles));
  }, [bookmarkedTiles]);

  const addBookmark = (tile: BookmarkedTile) => {
    setBookmarkedTiles((prev) => {
      // Check if already bookmarked
      if (prev.some((t) => t.id === tile.id)) {
        return prev;
      }
      return [...prev, tile];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarkedTiles((prev) => prev.filter((t) => t.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarkedTiles.some((t) => t.id === id);
  };

  const toggleBookmark = (tile: BookmarkedTile) => {
    if (isBookmarked(tile.id)) {
      removeBookmark(tile.id);
    } else {
      addBookmark(tile);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarkedTiles,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
