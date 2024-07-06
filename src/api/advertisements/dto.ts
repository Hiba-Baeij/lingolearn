
export interface AdvertisementDto {
  id: string
  name: string
  order: number
  description: string
  imageUrl: string[]
  fileImage: null[] | File[]
}

export interface Advertisements {
  id: string;
  name: string;
  description: string;
  imageUrl: string[]

}
