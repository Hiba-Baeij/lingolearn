import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { NOTIFICATIONS_ENDPOINT, NotificationsActions } from '@/api/notifications/actions';
import NotificationForm from './components/NotificationForm';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications } from 'react-icons/io';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Delete, Edit } from '@mui/icons-material';
import { FaPlus } from 'react-icons/fa6';


const breadcrumbs = [
    {
        path: '/notifications',
        text: 'الإشعارات'
    },
    {
        path: '/notifications',
        text: 'قائمة الإشعارات'
    }
] as BreadCrumbs[]


export default function Notifications() {
    const [open, setOpen] = useState(false)
    const [notificationId, setNotificationId] = useState("")
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // const { data: notifications, isLoading } = useQuery({
    //     queryKey: [NOTIFICATIONS_ENDPOINT],
    //     queryFn: NotificationsActions.GetNotifications,
    // })


    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string) =>
            NotificationsActions.DeleteNotifications([id]),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_ENDPOINT] });
        },
    });
    const onDelete = (id: string) => {
        mutateDelete(id);
    };

    const notifications = [
        {
            id: "1",
            order: 1,
            name: "Notifcation 1",
            description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
        {
            id: "2",
            order: 2,
            name: "Notifcation 2",
            description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
        {
            id: "3",
            order: 3,
            name: "Notifcation 3",
            description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
        {
            id: "4",
            order: 4,
            name: "Notifcation 4",
            description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
        },
    ]
    return (
        <Page title={"الإشعارات"} breadcrumbs={breadcrumbs} icon={<IoMdNotifications fontSize={20} />}>
            <div className="flex justify-end items-center mb-4">
                <Button onClick={() => setOpen(true)} endIcon={<FaPlus size={16} />} variant='contained'>
                    إضافة
                </Button>
            </div>
            {
                notifications.map(notify => (
                    <Accordion key={notify.id} sx={{ mt: 1, py: 1 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            {notify.name}
                        </AccordionSummary>
                        <AccordionDetails>
                            {notify.description}
                        </AccordionDetails>
                        <AccordionActions>
                            <Button onClick={() => { setOpen(true); setNotificationId(notify.id) }} startIcon={<Edit />} color="success" variant="contained">تعديل</Button>
                            <Button onClick={() => onDelete(notify.id)} startIcon={<Delete />} color="error">حذف</Button>
                        </AccordionActions>
                    </Accordion>


                ))
            }
            <NotificationForm setId={(value) => setNotificationId(value)} id={notificationId} open={open} setOpen={(value) => setOpen(value)}></NotificationForm>
        </Page>
    )
}
