
export interface StudentDto {
  id: string
  fullName: string;
  gender: string;
  imageFile: File | null;
  imageUrl?: string;
  password: string
  phoneNumber: string
  email: string;
  birthDate: string;
  isBlock: boolean;
}

export interface Students {
  id: string;
  fullName: string;
  phoneNumber: string;
  imageUrl: string;
  birthDate: string;
  isBlock: boolean;
}