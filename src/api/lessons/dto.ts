
export interface LessonDto {
  id: string
  name: string;
  text: string;
  coverImageUrl: File | string;
  fileUrl: File | string;
  coverImageShow: string;
  fileUrlShow: string;
  type: string
  levelId: string
  order: number;
  description: string;
}

export interface Lessons {
  id: string;
  name: string;
  text: string;
  order: number;
  description: string;
  fileUrl: string;
  imageUrl?: string;
  type: string;
  levelId: string;
}