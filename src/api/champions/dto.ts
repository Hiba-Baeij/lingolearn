export interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  points: number;
  languageId: string;
  imageFile: File | null;
  coverImageFile: File | null;
  imageUrl: string;
  coverImageUrl: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}