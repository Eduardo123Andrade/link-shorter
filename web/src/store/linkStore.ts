import { create } from 'zustand';
import { IShortLink } from '../interfaces';

interface LinkStore {
  links: IShortLink[];
  addLink: (link: IShortLink) => void;
  setLinks: (links: IShortLink[]) => void;
  removeLink: (id: string) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  setLinks: (links) => set({ links }),
  removeLink: (id) =>
    set((state) => ({ links: state.links.filter((link) => link.id !== id) })),
}));
