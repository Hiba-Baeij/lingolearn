import { IconType } from 'react-icons'
export interface NavigationRecord {
    text: string,
    icon: IconType,
    path?: string,
    childrens?: NavigationRecord[]
    isNode?: boolean,
    isActive?: boolean,
}



export interface BreadCrumbItem {
    text: string,
    path?: string,
    isActive?: boolean,
    isDisabled?: boolean
}