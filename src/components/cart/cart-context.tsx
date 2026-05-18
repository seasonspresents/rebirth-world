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
import type {
  CartAction,
  CartItemData,
  CartShippingAddress,
  CartShippingRate,
} from "@/lib/cart/types";
import { cartItemKey, productToCartItem } from "@/lib/cart/types";
import type { Product } from "@/lib/payments/constants";

const STORAGE_KEY = "rebirth-cart";
const SHIPPING_STORAGE_KEY = "rebirth-cart-shipping";

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function cartReducer(
  state: CartItemData[],
  action: CartAction
): CartItemData[] {
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

interface CartShippingSelection {
  selectedShippingRate: CartShippingRate | null;
  shippingAddress: CartShippingAddress | null;
}

type CartShippingAction =
  | { type: "SET_RATE"; rate: CartShippingRate | null }
  | { type: "SET_ADDRESS"; address: CartShippingAddress | null }
  | { type: "SET_SELECTION"; selection: CartShippingSelection }
  | { type: "CLEAR" };

const EMPTY_SHIPPING_SELECTION: CartShippingSelection = {
  selectedShippingRate: null,
  shippingAddress: null,
};

function shippingReducer(
  state: CartShippingSelection,
  action: CartShippingAction
): CartShippingSelection {
  switch (action.type) {
    case "SET_RATE":
      return { ...state, selectedShippingRate: action.rate };
    case "SET_ADDRESS":
      return { ...state, shippingAddress: action.address };
    case "SET_SELECTION":
      return action.selection;
    case "CLEAR":
      return EMPTY_SHIPPING_SELECTION;
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
  selectedShippingRate: CartShippingRate | null;
  shippingAddress: CartShippingAddress | null;
  addItem: (
    product: Product,
    quantity?: number,
    variant?: string | null
  ) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  setShippingRate: (rate: CartShippingRate | null) => void;
  setShippingAddress: (address: CartShippingAddress | null) => void;
  clearShippingSelection: () => void;
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

function readShippingStorage(): CartShippingSelection {
  if (typeof window === "undefined") {
    return EMPTY_SHIPPING_SELECTION;
  }
  try {
    const raw = localStorage.getItem(SHIPPING_STORAGE_KEY);
    return raw
      ? (JSON.parse(raw) as CartShippingSelection)
      : EMPTY_SHIPPING_SELECTION;
  } catch {
    return EMPTY_SHIPPING_SELECTION;
  }
}

function writeShippingStorage(
  selectedShippingRate: CartShippingRate | null,
  shippingAddress: CartShippingAddress | null
) {
  if (typeof window === "undefined") return;
  try {
    if (!selectedShippingRate && !shippingAddress) {
      localStorage.removeItem(SHIPPING_STORAGE_KEY);
      return;
    }
    localStorage.setItem(
      SHIPPING_STORAGE_KEY,
      JSON.stringify({ selectedShippingRate, shippingAddress })
    );
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
  const [shippingSelection, dispatchShipping] = useReducer(
    shippingReducer,
    EMPTY_SHIPPING_SELECTION
  );
  const [hasHydratedStorage, markStorageHydrated] = useReducer(
    () => true,
    false
  );
  const [isCartOpen, setCartOpen] = useState(false);
  const prevUserId = useRef<string | null>(null);
  const { selectedShippingRate, shippingAddress } = shippingSelection;
  const isLoading = !hasHydratedStorage;

  // -- Initialise from localStorage on mount --------------------------------
  useEffect(() => {
    if (hasHydratedStorage) return;
    const stored = readLocalStorage();
    if (stored.length > 0) {
      dispatch({ type: "SET_ITEMS", items: stored });
    }
    dispatchShipping({
      type: "SET_SELECTION",
      selection: readShippingStorage(),
    });
    markStorageHydrated();
  }, [hasHydratedStorage]);

  // -- Shipping selection ----------------------------------------------------
  const clearShippingSelection = useCallback(() => {
    dispatchShipping({ type: "CLEAR" });
    writeShippingStorage(null, null);
  }, []);

  const setShippingRate = useCallback((rate: CartShippingRate | null) => {
    dispatchShipping({ type: "SET_RATE", rate });
  }, []);

  const setShippingAddress = useCallback(
    (address: CartShippingAddress | null) => {
      dispatchShipping({ type: "SET_ADDRESS", address });
    },
    []
  );

  // -- Persist to localStorage on every change ------------------------------
  useEffect(() => {
    if (!hasHydratedStorage) return;
    writeLocalStorage(items);
  }, [items, hasHydratedStorage]);

  useEffect(() => {
    if (!hasHydratedStorage) return;
    writeShippingStorage(selectedShippingRate, shippingAddress);
  }, [selectedShippingRate, shippingAddress, hasHydratedStorage]);

  // -- Sync with Supabase when user logs in ---------------------------------
  useEffect(() => {
    if (!hasHydratedStorage) return;
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
          clearShippingSelection();
        }
      })
      .catch(() => {
        // offline / error — keep localStorage items
      });
  }, [user, clearShippingSelection, hasHydratedStorage]);

  // -- Actions --------------------------------------------------------------

  const addItem = useCallback(
    (product: Product, quantity = 1, variant: string | null = null) => {
      const item = productToCartItem(product, quantity, variant);
      dispatch({ type: "ADD_ITEM", item });
      clearShippingSelection();

      // Fire-and-forget DB upsert for logged-in users
      if (user) {
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        }).catch(() => {});
      }
    },
    [user, clearShippingSelection]
  );

  const removeItem = useCallback(
    (key: string) => {
      dispatch({ type: "REMOVE_ITEM", key });
      clearShippingSelection();

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
    [user, clearShippingSelection]
  );

  const updateQuantity = useCallback(
    (key: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(key);
        return;
      }
      dispatch({ type: "UPDATE_QUANTITY", key, quantity });
      clearShippingSelection();

      if (user) {
        const [stripePriceId, variant] = key.split("::");
        fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stripePriceId,
            variant: variant || null,
            quantity,
          }),
        }).catch(() => {});
      }
    },
    [user, removeItem, clearShippingSelection]
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    writeLocalStorage([]);
    clearShippingSelection();

    if (user) {
      fetch("/api/cart", { method: "DELETE" }).catch(() => {});
    }
  }, [user, clearShippingSelection]);

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
      selectedShippingRate,
      shippingAddress,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setShippingRate,
      setShippingAddress,
      clearShippingSelection,
      isCartOpen,
      setCartOpen,
    }),
    [
      items,
      itemCount,
      subtotal,
      isLoading,
      selectedShippingRate,
      shippingAddress,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      setShippingRate,
      setShippingAddress,
      clearShippingSelection,
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
