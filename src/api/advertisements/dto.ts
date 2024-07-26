
export interface AdvertisementDto {
  id: string
  title: string;
  description: string;
  imagesUrl: string[]
  imagesFile: null[] | File[]
  showInWebsite: boolean
  companyName: string,
  price: number
}

export interface Advertisements {
  id: string;
  title: string;
  description: string;
  imagesUrl: string[];
  companyName: string;
  price: number

}
