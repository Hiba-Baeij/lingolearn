import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { StudentDto, Students as StudentsType } from '@/api/students/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StudentsActions, STUDENTS_ENDPOINT } from '@/api/students/actions';
import StudentForm from './components/StudentForm';
import { FaUsers } from 'react-icons/fa6';
import { Chip } from '@mui/material';
import moment from 'moment';
import { useFile } from '@/shared/hooks/useFile';


const breadcrumbs = [
    {
        path: '/students',
        text: 'الطلاب'
    },
    {
        path: '/students',
        text: 'قائمة الطلاب'
    }
] as BreadCrumbs[]


export default function Students() {
    const [open, setOpen] = useState(false)
    const [studentId, setStudentId] = useState("")
    const queryClient = useQueryClient();
    const { getFileUrl } = useFile()

    const { data: students, isLoading } = useQuery({
        queryKey: [STUDENTS_ENDPOINT],
        queryFn: StudentsActions.GetStudents,
    })

    const heads = [
        {
            key: 'imageUrl',
            label: "صورة الشخصية",
            customRenderer: (item => item.imageUrl ? <img className='w-[40px] rounded-full' src={getFileUrl(item.imageUrl)} alt={'user'} /> : <img className='w-[40px] rounded-full' src={'/user.jpg'} alt={'user'} />)

        },
        {
            key: 'fullName',
            label: "الاسم"
        },
        {
            key: 'email',
            label: "البريد الالكتروني"
        },
        {
            key: 'phoneNumber',
            label: "الهاتف"
        },
        {
            key: 'birthDate',
            label: "يوم الميلاد",
            customRenderer: (item => item.birthDate ? moment(item.birthDate).format("YYYY-MM-DD") : '-----')

        },
        {
            key: 'isBlock',
            label: "حالة النشاط",
            customRenderer: (item => item.isBlock ? <Chip color="error" size="small" label={'محظور'}></Chip> : <Chip size="small" color="success" label={'غير محظور'}></Chip>)
        }
    ] as HeadsType<StudentsType>[]

    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string[]) =>
            StudentsActions.DeleteStudents(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STUDENTS_ENDPOINT] });
        },
    });
    const onDelete = (id: string[]) => {
        mutateDelete(id);
    };

    return (
        <Page title={"الطلاب"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <MaterialTable
                heads={heads}
                rows={students}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => { setStudentId(id); setOpen(true) }}
                onCreate={() => setOpen(true)}
            ></MaterialTable>
            <StudentForm setId={(value) => setStudentId(value)} id={studentId} open={open} setOpen={(value) => setOpen(value)}></StudentForm>
        </Page>
    )
}
