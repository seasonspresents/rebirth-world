"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/components/auth/auth-context";
import type { CartAction, CartItemData } from "@/lib/cart/types";
import { cartItemKey, productToCartItem } from "@/lib/cart/types";
import type { Product } from "@/lib/payments/constants";

const STORAGE_KEY = "rebirth-cart";

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(state: CartItemData[], action: CartAction): CartItemData[] {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = cartItemKey(action.item);
      const idx = state.findIndex((i) => cartItemKey(i) === key);
      if (idx >= 0) {
        const updated = [...state];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + action.item.quantity,
        };
        return updated;
      }
      return [...state, action.item];
    }
    case "REMOVE_ITEM":
      return state.filter((i) => cartItemKey(i) !== action.key);
    case "UPDATE_QUANTITY": {
      if (action.quantity < 1) {
        return state.filter((i) => cartItemKey(i) !== action.key);
      }
      return state.map((i) =>
        cartItemKey(i) === action.key ? { ...i, quantity: action.quantity } : i
      );
    }
    case "CLEAR_CART":
      return [];
    case "SET_ITEMS":
      return action.items;
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface CartContextType {
  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (product: Product, quantity?: number, variant?: string | null) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function readLocalStorage(): CartItemData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItemData[]) : [];
  } catch {
    return [];
  }
}

function writeLocalStorage(items: CartItemData[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded — ignore
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, dispatch] = useReducer(cartReducer, []);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setCartOpen] = useState(false);
  const initialized = useRef(false);
  const prevUserId = useRef<string | null>(null);

  // -- Initialise from localStorage on mount --------------------------------
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const stored = readLocalStorage();
    if (stored.length > 0) {
      dispatch({ type: "SET_ITEMS", items: stored });
    }
    setIsLoading(false);
  }, []);

  // -- Persist to localStorage on every change ------------------------------
  useEffect(() => {
    if (!initialized.current) return;
    writeLocalStorage(items);
  }, [items]);

  // -- Sync with Supabase when user logs in ---------------------------------
  useEffect(() => {
    if (!user) {
      prevUserId.current = null;
      return;
    }
    // Only sync once per login
    if (prevUserId.current === user.id) return;
    prevUserId.current = user.id;

    const localItems = readLocalStorage();

    fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: localItems }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.items) {
          dispatch({ type: "SET_ITEMS", items: data.items });
        }
      })
      .catch(() => {
        // offline / error — keep localStorage items
      });
  }, [user]);

  // -- Actions --------------------------------------------------------------

  const addItem = useCallback(
    (product: Product, quantity = 1, variant: string | null = null) => {
      const item = productToCartItem(product, quantity, variant);
      dispatch({ type: "ADD_ITEM", item });

      // Fire-and-forget DB upsert for logged-in users
      if (user) {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch(() => {});
      }
    },
    [user]
  );

  const removeItem = useCallback(
    (key: string) => {
      dispatch({ type: "REMOVE_ITEM", key });

      if (user) {
        // Parse key back to price+variant for the API
        const [stripePriceId, variant] = key.split("::");
        fetch("/api/cart", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripePriceId, variant: variant || null }),
        }).catch(() => {});
      }
    },
    [user]
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(key);
        return;
      }
      dispatch({ type: "UPDATE_QUANTITY", key, quantity });

      if (user) {
        const [stripePriceId, variant] = key.split("::");
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stripePriceId, variant: variant || null, quantity }),
        }).catch(() => {});
      }
    },
    [user, removeItem]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    writeLocalStorage([]);

    if (user) {
      fetch("/api/cart", { method: "DELETE" }).catch(() => {});
    }
  }, [user]);

  // -- Derived values -------------------------------------------------------

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      itemCount,
      subtotal,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setCartOpen,
    }),
    [
      items,
      itemCount,
      subtotal,
      isLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
