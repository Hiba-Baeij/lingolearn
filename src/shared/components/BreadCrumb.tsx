import { Breadcrumbs, Link as MuiLink } from '@mui/material'
import React, { useMemo } from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { BreadCrumbItem as BreadCrumbItemType } from '../types/navigation';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type BreadCrumbProps = {
    breadCrumbs?: BreadCrumbItemType[],
    renderBreadCrumbItem?: (item: BreadCrumbItemType) => React.ReactNode
}

const BreadCrumbItem = (item: BreadCrumbItemType) => {
    return <MuiLink underline={'hover'} color='GrayText' fontSize={12} key={item.path} component={Link} to={item.path as string} >{item.text}</MuiLink>
}

export default function BreadCrumb({ breadCrumbs, renderBreadCrumbItem = BreadCrumbItem }: BreadCrumbProps) {
    const location = useLocation();
    const breadCrumbItems: BreadCrumbItemType[] = useMemo(() => {
        if (breadCrumbs) {
            return breadCrumbs
        }
        const pathNames = location.pathname.split('/').filter(p => p !== "");
        let fullPath = '';
        return pathNames.map((b) => {
            fullPath += `/${b}`
            return {
                text: b,
                path: fullPath,

            } as BreadCrumbItemType
        })

    }, [location.pathname, breadCrumbs])


    return (
        <Breadcrumbs
            sx={{ display: breadCrumbItems.length === 1 ? 'none' : 'block' }}
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
        >
            {breadCrumbItems.map(item => renderBreadCrumbItem(item))}
        </Breadcrumbs>

    )
}
