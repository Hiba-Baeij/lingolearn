import React, { PropsWithChildren, ReactNode, ReactElement, useEffect, useMemo, useTransition } from 'react'
import { Box, Breadcrumbs, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Link from '@mui/material/Link';
import { useLocation } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import GroupIcon from '@mui/icons-material/Group';
export interface BreadCrumbs {
    path: string,
    text: string
}
interface Props {
    title: string,
    appendTitle?: ReactElement,
    actions?: ReactNode,
    icon?: ReactNode,
    breadcrumbs?: BreadCrumbs[]
}

export default function Page({ title, children, breadcrumbs, actions, icon }: PropsWithChildren<Props>) {
    const { pathname } = useLocation();
    return (
        <div className='py-4'>
            <Box display={'flex'} justifyContent={{ lg: 'space-between', md: 'center', xs: 'center' }} alignItems={'center'} flexWrap='wrap' gap={2}>

                <Box display='flex' alignItems='center' gap={2} className="navigation">
                    {icon}
                    <Typography fontSize={'20px'} fontWeight={'bold'} variant='h1'>
                        {title}
                    </Typography>
                </Box>

                <div className='breadcrumps flex md:justify-center justify-start items-center flex-wrap gap-2'>
                    {
                        breadcrumbs && breadcrumbs?.length > 0 ?
                            <Breadcrumbs
                                separator={<NavigateBeforeIcon fontSize="small" />}
                                aria-label="breadcrumb"
                            >
                                {breadcrumbs?.map((nav => (
                                    <div key={nav.path} className="text-sm">
                                        {breadcrumbs.length - 1 ? <Typography sx={{ fontSize: '14px' }}>{nav.text}</Typography> : <Link
                                            underline="hover"
                                            color="inherit"
                                            href={nav.path}
                                        >
                                            {nav.text}
                                        </Link>
                                        }
                                    </div>


                                )))
                                }


                            </Breadcrumbs>
                            : actions ?? <></>
                    }


                </div>

            </Box>
            <Box mt={2}>

                {children}
            </Box>

        </div>
    )
}
