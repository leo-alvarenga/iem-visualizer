export type RangeCategory = "Bass" | "Mid" | "Treble";

export type NamedRange = {
  x1: number;
  x2: number;
  id: string;
  category: RangeCategory;
};

export interface IemMeta {
  id: string;
  name: string;
  brand: string;
  source: string;
  rig: string;
  form: string;
  file: string;
}

export interface TargetMeta {
  id: string;
  name: string;
  file: string;
}

export interface Capabilities {
  iems: IemMeta[];
  targets: TargetMeta[];
}

export type FrData = {
  id: string;
  name?: string;
  brand?: string;
  source?: string;
  rig?: string;
  form?: string;
  file?: string;
  raw: [number, number][];
};
