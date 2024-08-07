import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Page from '../../shared/components/Page';
import { Box, Button, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import DialogForm from '@/shared/components/DialogForm';
import TextField from '@mui/material/TextField';
import { HiOutlineHome } from 'react-icons/hi2';
import { IoHomeSharp } from 'react-icons/io5';
import UsersCard from '@/shared/components/demos/cards/UsersCard';
import Statistics from '@/shared/components/demos/charts/Statistics';
import ApexAreaDemo from '@/shared/components/demos/charts/ApexAreaDemo';
import ApexAreaDemo2 from '@/shared/components/demos/charts/ApexAreaDemo2';
import { HomeActions, HOME_ENDPOINT } from '@/api/home/actions';
import { useQuery } from '@tanstack/react-query';
import LanguagesCard from '@/shared/components/demos/cards/LanguagsCard';
import { MenuProps } from '@/config/theme/theme';

export default function HomePage() {
    const [year, setYear] = useState<number>(2024);
    const { data: homeDto, isLoading } = useQuery({
        queryKey: [HOME_ENDPOINT, year],
        queryFn: () => HomeActions.GetHome(year),
    })

    return (
        <Page title='الرئيسية'>
            <Card className='p-3 flex justify-between items-center'>
                <Typography color='primary' fontWeight={'bold'} variant="h6">الإحصائيات السنوية</Typography>
                <FormControl size="small" sx={{ width: 300 }}>
                    <InputLabel id="year">السنة</InputLabel>
                    <Select
                        labelId="year"
                        fullWidth
                        label="السنة"
                        MenuProps={MenuProps}
                        value={year}
                        onChange={(e) => setYear(+e.target.value)}
                    >
                        <MenuItem key={2023} value={2023}>2023</MenuItem>
                        <MenuItem key={2024} value={2024}>2024</MenuItem>
                        <MenuItem key={2025} value={2025}>2025</MenuItem>
                        <MenuItem key={2026} value={2026}>2026</MenuItem>
                        <MenuItem key={2027} value={2027}>2027</MenuItem>
                    </Select>
                </FormControl>
            </Card>
            <Box className="mt-5">
                <Statistics homeDto={homeDto}></Statistics>
            </Box>
            <div className="grid grid-cols-5 gap-5 mt-5">
                <div className="col-span-5 md:col-span-3 h-full" >
                    <Card>
                        <ApexAreaDemo2
                            languageCountMonthly={homeDto?.languageCountMonthly}
                            lessonCountMonthly={homeDto?.lessonCountMonthly}
                        ></ApexAreaDemo2>

                    </Card>
                </div>
                <div className="col-span-5 md:col-span-2">
                    <LanguagesCard languages={homeDto?.bestLanguages}></LanguagesCard>
                </div>

            </div>
            <div className="grid grid-cols-5 gap-5 mt-5">
                <div className="col-span-5 md:col-span-3 h-full" >
                    <Card>
                        <ApexAreaDemo
                            advertisementCountMonthly={homeDto?.advertisementCountMonthly}
                            studentCountMonthly={homeDto?.studentCountMonthly}
                        ></ApexAreaDemo>
                    </Card>
                </div>
                <div className="col-span-5 md:col-span-2" >
                    <UsersCard students={homeDto?.bestStudents}></UsersCard>
                </div>

            </div>
        </Page>
    )
}
