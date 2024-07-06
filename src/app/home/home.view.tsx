import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import Page from '../../shared/components/Page';
import { Box, Button, Card } from '@mui/material';
import DialogForm from '@/shared/components/DialogForm';
import TextField from '@mui/material/TextField';
import { HiOutlineHome } from 'react-icons/hi2';
import { IoHomeSharp } from 'react-icons/io5';
import UsersCard from '@/shared/components/demos/cards/UsersCard';
import Statistics from '@/shared/components/demos/charts/Statistics';
import ApexAreaDemo from '@/shared/components/demos/charts/ApexAreaDemo';

export default function HomePage() {
    return (
        <Page title='الرئيسية'>
            <Box className="mt-5 ">
                <Statistics></Statistics>
            </Box>
            <div className="grid grid-cols-5 gap-5 mt-5">
                <div className="col-span-5 md:col-span-3 h-full" >

                    <Card>
                        <ApexAreaDemo></ApexAreaDemo>
                    </Card>
                </div>
                <div className="col-span-5 md:col-span-2" >
                    <UsersCard></UsersCard>
                </div>
            </div>
        </Page>
    )
}
