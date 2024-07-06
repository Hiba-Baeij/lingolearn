import Page from '@/shared/components/Page'
import React from 'react'

const breadcrumbs = [
    {
        path: '/languages',
        text: 'اللغات'
    },
    {
        path: '/languages',
        text: 'تفاصيل لغة'
    },
    {
        path: '/languages',
        text: 'الدرس'
    },
]
export default function ViewLesson() {
    return (
        <Page title='تفاصيل الدرس' breadcrumbs={breadcrumbs}>
            viewLesson.page
        </Page>
    )
}
