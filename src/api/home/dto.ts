export interface HomeDto {
  studentCount: number;
  languageCount: number;
  lessonCount: number;
  levelCount: number;
  advertisementCount: number;
  challengeCount: number;
  questionCount: number;
  answerCount: number;
  bestLanguages: Best[];
  bestStudents: Best[];
  studentCountMonthly: number[] | undefined;
  languageCountMonthly: number[] | undefined;
  lessonCountMonthly: number[] | undefined;
  advertisementCountMonthly: number[] | undefined;
}

export interface Best {
  id: string;
  name: string;
  imageUrl: string;
}