export interface ILink {
  id: string;
  link: string;
  shortLink: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateLinkInput {
  id: string;
  link: string;
  shortLink: string;
}

export interface IUpdateLinkInput {
  link?: string;
  shortLink?: string;
}
