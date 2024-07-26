
export interface AdvertisementDto {
  id: string
  title: string;
  description: string;
  imageUrl: string[]
  imageFile: null[] | File[]
  showInWebsite: boolean
}

export interface Advertisements {
  id: string;
  title: string;
  description: string;
  imageUrl: string[]

}
