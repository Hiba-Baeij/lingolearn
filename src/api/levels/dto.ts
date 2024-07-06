
export interface LevelDto {
  id: string
  name: string
  order: number
  description: string
  languageId: string
}

export interface Levels {
  id: string;
  name: string;
  order: number;
  description: string;
  languageId: string;
  lessonsCount: number;
}
export interface LevelDetails {
  id: string;
  name: string;
  order: number;
  description: string;
  languageId?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  name: string;
  order: number;
  description: string;
  fileUrl: string;
  type: string;
}