import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { Contacts as ContactsType } from '@/api/contacts/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ContactsActions, CONTACTS_ENDPOINT } from '@/api/contacts/actions';
import { FaUsers } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';


const breadcrumbs = [
    {
        path: '/contacts',
        text: 'تواصل معنا'
    },
    {
        path: '/contacts',
        text: 'قائمة التواصل'
    }
] as BreadCrumbs[]


export default function Contacts() {
    const [open, setOpen] = useState(false)
    const [contactId, setContactId] = useState("")
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: levels, isLoading } = useQuery({
        queryKey: [CONTACTS_ENDPOINT],
        queryFn: ContactsActions.GetContacts,
    })

    const heads = [
        {
            key: 'name',
            label: "الاسم"
        },
        {
            key: 'text',
            label: "النص"
        },
        {
            key: 'email',
            label: "البريد الالكتروني"
        },
        {
            key: 'phoneNumber',
            label: "الهاتف"
        },

    ] as HeadsType<ContactsType>[]

    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string[]) =>
            ContactsActions.DeleteContacts(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CONTACTS_ENDPOINT] });
        },
    });
    const onDelete = (id: string[]) => {
        mutateDelete(id);
    };

    return (
        <Page title={"تواصل معنا"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <MaterialTable
                heads={heads}
                rows={levels}
                selectable
                isLoading={isLoading}
                actions={['delete']}
                onDelete={(ids) => onDelete(ids)}

            ></MaterialTable>
            {/* <ContactForm setId={(value) => setContactId(value)} id={contactId} open={open} setOpen={(value) => setOpen(value)}></ContactForm> */}
        </Page>
    )
}
