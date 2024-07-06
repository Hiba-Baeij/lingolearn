import { Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export default function NoData() {

    return (
        <div className='w-full flex items-center flex-col mt-5'>
            <img src="/no-data.svg" alt="" className='w-full h-80 mb-10' />
            <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                لا يوجد بيانات
            </Typography>
            <p>
                الرجاء ادخل بياناتك الخاصة
            </p>
        </div>
    )
}
