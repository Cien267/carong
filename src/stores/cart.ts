import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { emptyQuantities, type Kind, type Quantities } from '../lib/pricing';
import type { Customer } from '../lib/order';

interface CartState {
  durationId: string;
  depositId: string;
  qty: Quantities;
  customer: Customer;
  drawerOpen: boolean;
  setDuration: (id: string) => void;
  setDeposit: (id: string) => void;
  setQty: (kind: Kind, id: string, qty: number) => void;
  setCustomer: (patch: Partial<Customer>) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const emptyCustomer: Customer = { name: '', phone: '', pickupDate: '', note: '' };

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      durationId: '',
      depositId: '',
      qty: emptyQuantities(),
      customer: emptyCustomer,
      drawerOpen: false,
      setDuration: (durationId) => set({ durationId }),
      setDeposit: (depositId) => set({ depositId }),
      setQty: (kind, id, q) =>
        set((s) => {
          const next = { ...s.qty[kind] };
          if (q <= 0) delete next[id];
          else next[id] = Math.floor(q);
          return { qty: { ...s.qty, [kind]: next } };
        }),
      setCustomer: (patch) => set((s) => ({ customer: { ...s.customer, ...patch } })),
      clear: () => set({ qty: emptyQuantities() }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: 'carong-cart-v1',
      version: 1,
      // Không hydrate ở server/lần render đầu để HTML SSR và client khớp nhau.
      skipHydration: true,
      partialize: (s) => ({ durationId: s.durationId, depositId: s.depositId, qty: s.qty, customer: s.customer }),
    },
  ),
);

/** Gọi trong mỗi island dùng giỏ. Rehydrate lặp lại vô hại. */
export function useCartHydration() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
}
