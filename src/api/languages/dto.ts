import { LevelDetails } from "../levels/dto";

export interface LanguageDto {
  id: string
  imageFile: File | null;
  imageUrl?: string;
  name: string
  description: string
}

export interface Languages {
  id: string,
  name: string,
  description: string,
  imageUrl: string,
  levelsCount: number
}

export interface LanguageDetails {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  levels: LevelDetails[];
}
export interface Dto {
  id: string;
  name: string
}
export interface KeyDto {
  key: 0;
  value: string
}
