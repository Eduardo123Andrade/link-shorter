import { create } from 'zustand';
import { IShortLink } from '../interfaces';

interface LinkStore {
  links: IShortLink[];
  addLink: (link: IShortLink) => void;
  setLinks: (links: IShortLink[]) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  setLinks: (links) => set({ links }),
}));
