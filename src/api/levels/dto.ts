
export interface LevelDto {
  id: string
  name: string
  order: number
  description: string
  pointOpenBy: number
  languageId: string
}

export interface Levels {
  id: string;
  name: string;
  order: number;
  description: string;
  languageId: string;
  pointOpenBy: number;
  lessonsCount: number;
}
export interface LevelDetails {
  id: string;
  name: string;
  order: number;
  description: string;
  pointOpenBy: number;
  languageId?: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  name: string;
  order: number;
  description: string;
  fileUrl: string;
  coverImageUrl: string;
  type: string;
}