import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Loading() {

    return (
        <div className='w-full flex justify-center items-center h-screen'>
            <h4>loading</h4>
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    )
}
