"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useAuth } from "@/components/auth/auth-context";
import type { Product } from "@/lib/payments/constants";
import {
  productToWishlistItem,
  wishlistItemKey,
  type WishlistItemData,
} from "@/lib/wishlist/types";

const STORAGE_KEY = "rebirth-wishlist";

type WishlistAction =
  | { type: "ADD_ITEM"; item: WishlistItemData }
  | { type: "REMOVE_ITEM"; stripePriceId: string }
  | { type: "SET_ITEMS"; items: WishlistItemData[] }
  | { type: "CLEAR" };

function wishlistReducer(
  state: WishlistItemData[],
  action: WishlistAction
): WishlistItemData[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = wishlistItemKey(action.item);
      if (state.some((item) => wishlistItemKey(item) === key)) return state;
      return [action.item, ...state];
    }
    case "REMOVE_ITEM":
      return state.filter(
        (item) => item.stripePriceId !== action.stripePriceId
      );
    case "SET_ITEMS":
      return action.items;
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

interface WishlistContextType {
  items: WishlistItemData[];
  count: number;
  isLoading: boolean;
  isSaved: (stripePriceId: string) => boolean;
  addItem: (product: Product) => void;
  removeItem: (stripePriceId: string) => void;
  toggleItem: (product: Product) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

function normaliseItems(items: WishlistItemData[]): WishlistItemData[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item?.stripePriceId || seen.has(item.stripePriceId)) return false;
    seen.add(item.stripePriceId);
    return Boolean(item.name && item.slug);
  });
}

function readLocalStorage(): WishlistItemData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normaliseItems(JSON.parse(raw) as WishlistItemData[]) : [];
  } catch {
    return [];
  }
}

function writeLocalStorage(items: WishlistItemData[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota or privacy-mode failures should not block browsing.
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, dispatch] = useReducer(wishlistReducer, []);
  const [hasHydratedStorage, markStorageHydrated] = useReducer(
    () => true,
    false
  );
  const prevUserId = useRef<string | null>(null);
  const isLoading = !hasHydratedStorage;

  useEffect(() => {
    if (hasHydratedStorage) return;
    const stored = readLocalStorage();
    if (stored.length > 0) {
      dispatch({ type: "SET_ITEMS", items: stored });
    }
    markStorageHydrated();
  }, [hasHydratedStorage]);

  useEffect(() => {
    if (!hasHydratedStorage) return;
    writeLocalStorage(items);
  }, [items, hasHydratedStorage]);

  useEffect(() => {
    if (!hasHydratedStorage) return;
    if (!user) {
      prevUserId.current = null;
      return;
    }
    if (prevUserId.current === user.id) return;
    prevUserId.current = user.id;

    fetch("/api/wishlist/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: readLocalStorage() }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) {
          dispatch({ type: "SET_ITEMS", items: data.items });
        }
      })
      .catch(() => {
        // Keep local wishlist state if the network or auth session is stale.
      });
  }, [user, hasHydratedStorage]);

  const isSaved = useCallback(
    (stripePriceId: string) =>
      items.some((item) => item.stripePriceId === stripePriceId),
    [items]
  );

  const addItem = useCallback(
    (product: Product) => {
      const item = productToWishlistItem(product);
      dispatch({ type: "ADD_ITEM", item });

      if (user) {
        fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch(() => {});
      }
    },
    [user]
  );

  const removeItem = useCallback(
    (stripePriceId: string) => {
      dispatch({ type: "REMOVE_ITEM", stripePriceId });

      if (user) {
        fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripePriceId }),
        }).catch(() => {});
      }
    },
    [user]
  );

  const toggleItem = useCallback(
    (product: Product) => {
      if (isSaved(product.priceId)) {
        removeItem(product.priceId);
        return false;
      }
      addItem(product);
      return true;
    },
    [addItem, isSaved, removeItem]
  );

  const value = useMemo<WishlistContextType>(
    () => ({
      items,
      count: items.length,
      isLoading,
      isSaved,
      addItem,
      removeItem,
      toggleItem,
    }),
    [items, isLoading, isSaved, addItem, removeItem, toggleItem]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
