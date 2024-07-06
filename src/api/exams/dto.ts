export interface Exam {
  id: string;
  text: string;
  order: number;
  levelId: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}
