import { create } from 'zustand';
import { IShortLink } from '../interfaces';

interface LinkStore {
  links: IShortLink[];
  addLink: (link: IShortLink) => void;
  setLinks: (links: IShortLink[]) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [
    {
      id: "1",
      shortUrl: "Portfolio-Dev",
      originalUrl: "https://devsite.portfolio.com.br/devname-123456",
      accessCount: 30,
    },
    {
      id: "2",
      shortUrl: "Rocketseat",
      originalUrl: "https://rocketseat.com.br",
      accessCount: 10,
    },
  ],
  addLink: (link) => set((state) => ({ links: [link, ...state.links] })),
  setLinks: (links) => set({ links }),
}));
