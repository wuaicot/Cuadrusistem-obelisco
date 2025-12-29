import { create } from "zustand";

export type Role = "COCINA" | "CAJA" | "ADMIN" | null;

interface RoleState {
  role: Role;
  setRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));
