import React from 'react'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HiOutlineHome } from 'react-icons/hi2'

export default function NotFound() {
    const navigation = useNavigate()
    return (
        <div className='w-full flex justify-center items-center flex-col gap-5 md:mt-40 mt-10'>
            <img src="/not-found.svg" alt="" className='w-full h-80' />
            <p className='text-xl text-center md:w-[500px] w-full leading-8 tracking-wide'>الصفحة غير موجودة الرجاء التأكد منها</p>
            <Button variant='contained' startIcon={<HiOutlineHome />} onClick={() => navigation('/')}>الصفحة الرئيسية</Button>
        </div>
    )
}
