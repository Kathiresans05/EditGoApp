import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  role: 'CUSTOMER' | 'EDITOR' | 'ADMIN';
}

interface Order {
  id: string;
  status: string;
  price: number;
}

interface AppState {
  user: User | null;
  activeOrder: Order | null;
  setUser: (user: User | null) => void;
  setActiveOrder: (order: Order | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeOrder: null,
  setUser: (user) => set({ user }),
  setActiveOrder: (order) => set({ activeOrder: order }),
}));
