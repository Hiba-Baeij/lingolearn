import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { Lessons as LessonsType } from '@/api/lessons/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LESSONS_ENDPOINT, LessonsActions } from '@/api/lessons/actions';
import LessonForm from './components/LessonForm';
import { FaUsers } from 'react-icons/fa6';
import { useLevels } from '../levels/useLevels';
import { useNavigate } from 'react-router-dom';


const breadcrumbs = [
    {
        path: '/lessons',
        text: 'الدروس'
    },
    {
        path: '/lessons',
        text: 'قائمة الدروس'
    }
] as BreadCrumbs[]


export default function Lessons() {
    const [open, setOpen] = useState(false)
    const [lessonId, setLessonId] = useState("")
    const queryClient = useQueryClient();
    const { getLevel } = useLevels();
    const navigate = useNavigate();

    const { data: lessons, isLoading } = useQuery({
        queryKey: [LESSONS_ENDPOINT],
        queryFn: LessonsActions.GetLessons,
    })

    const heads = [
        {
            key: 'name',
            label: "الاسم"
        },
        {
            key: 'order',
            label: "الترتيب"
        },
        {
            key: 'levelId',
            label: "المستوى",
            customRenderer: (item) => getLevel(item.levelId)?.name

        },
        {
            key: 'description',
            label: "الوصف"
        },
    ] as HeadsType<LessonsType>[]

    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string[]) =>
            LessonsActions.DeleteLessons(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LESSONS_ENDPOINT] });
        },
    });
    const onDelete = (id: string[]) => {
        mutateDelete(id);
    };

    return (
        <Page title={"الدروس"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <MaterialTable
                heads={heads}
                rows={lessons}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => { setOpen(true); setLessonId(id) }}
                onCreate={() => setOpen(true)}
            ></MaterialTable>
            <LessonForm setId={(value) => setLessonId(value)} id={lessonId} open={open} setOpen={(value) => setOpen(value)}></LessonForm>
        </Page>
    )
}
