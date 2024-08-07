import React from 'react'
import { Card, Typography, Box, Icon } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { HomeDto } from '@/api/home/dto'
import { IoDocumentText } from 'react-icons/io5'
import { GiChampions } from 'react-icons/gi'
import { MdOutlineHeadsetMic } from 'react-icons/md'
import { FaRoad, FaUsers } from 'react-icons/fa6'
import { SiBookstack } from 'react-icons/si'
import { GrLanguage } from 'react-icons/gr'

type Props = {
    homeDto: HomeDto | undefined
}
export default function Statistics({ homeDto }: Props) {
    interface StatItem {
        label: string,
        icon: React.ElementType,
        value: number | undefined,
        prefix: string,
        color: string
    }
    const stats: Array<StatItem> = [
        {
            label: 'عدد الطلاب',
            icon: FaUsers,
            value: homeDto?.studentCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد اللغات',
            icon: GrLanguage,
            value: homeDto?.languageCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد الدروس',
            icon: SiBookstack,
            value: homeDto?.lessonCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد المستويات',
            icon: FaRoad,
            value: homeDto?.levelCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد الإعلانات',
            icon: MdOutlineHeadsetMic,
            value: homeDto?.advertisementCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد التحديات',
            icon: GiChampions,
            value: homeDto?.challengeCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد أسئلة الاختبارات',
            icon: IoDocumentText,
            value: homeDto?.questionCount,
            prefix: '+',
            color: 'primary'
        },
        {
            label: 'عدد الإجابات',
            icon: IoDocumentText,
            value: homeDto?.answerCount,
            prefix: '+',
            color: 'primary'
        },
    ]

    return (
        <Card sx={{ p: 2 }}>

            <Grid container spacing={{
                xs: 5,
                md: 0
            }} paddingY={3}>
                {
                    stats.map((s) =>
                        <Grid xs={12} key={s.label} md={3} display={'flex'} justifyContent={'center'}>
                            <Box display={'flex'} flexDirection={'column'} >
                                <div className="flex gap-4 justify-between items-center">
                                    <Typography variant='h6'>
                                        {s.label}
                                    </Typography>
                                    <Box borderRadius={'100%'} sx={() => ({
                                        // backgroundColor: palette.background.default,
                                        width: 40,
                                        height: 40,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // border: `2px solid ${palette.divider}`
                                    })} >
                                        <Icon color={s.color as any} sx={{ fontSize: 24 }}>
                                            <s.icon />
                                        </Icon>
                                    </Box>
                                </div>

                                <Typography fontSize={
                                    {
                                        xs: 32,
                                        md: 34
                                    }
                                } fontWeight={'bold'} >
                                    <span className='dark:text-gray-400 mx-1' >{s.prefix}</span>{s.value}
                                </Typography>

                            </Box>
                        </Grid>

                    )
                }

            </Grid >

        </Card >
    )
}
