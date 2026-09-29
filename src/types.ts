export type RangeCategory = "Bass" | "Mid" | "Treble";

export type NamedRange = {
  x1: number;
  x2: number;
  id: string;
  category: RangeCategory;
};

export type SquigSite = {
  username: string;
  name: string;
  urlType: "subdomain" | "altDomain";
  altDomain?: string;
  dbs: { type: string; folder: string; deltaReady?: string }[];
};

export type PhoneEntry = {
  id: string;
  name: string;
  brand: string;
  file: string;
  price?: string;
  shopLink?: string;
  reviewLink?: string;
  reviewScore?: string;
  reviewerName: string;
  reviewerUsername: string;
  dataBaseUrl: string;
};

export type TargetEntry = {
  id: string;
  name: string;
  file: string;
  dataBaseUrl: string;
};

export type FrPoints = [number, number][];
