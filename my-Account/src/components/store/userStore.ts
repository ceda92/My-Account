import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';


type User = {
  userName: string;
  token: string;
  userId: string;
  pmsId: string;
  dashboardDefaultDate: string;
};

interface UserStore {
  user: User | null;

  logout: () => void;
  setUser: (user: User) => void;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
    },
  },
});

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      set => ({
        user: null,

        setUser: user => set({ user }),
        setDashboardDefaultDate: (date: any) =>
          set(state => ({
            user: state.user
              ? { ...state.user, dashboardDefaultDate: date }
              : null,
          })),
        logout: () => {
          set({ user: null });
          window.localStorage.clear();
          queryClient.invalidateQueries();
        },
      }),
      { name: 'user-storage' },
    ),
  ),
);
