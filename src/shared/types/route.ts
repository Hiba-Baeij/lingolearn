import { PageProps } from './pageProps';
import { RouteProps } from 'react-router-dom';
export type RouteRecord = {
    path: string,
    component?: React.FC<PageProps>,
    layout: React.FC<any>,
    props?: PageProps,
    childs?: RouteRecord[]
}
