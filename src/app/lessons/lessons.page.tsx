import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useMemo, useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { Lessons as LessonsType } from '@/api/lessons/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LESSONS_ENDPOINT, LessonsActions } from '@/api/lessons/actions';
import LessonForm from './components/LessonForm';
import { FaUsers } from 'react-icons/fa6';
import { useLevels } from '../levels/useLevels';
import { useNavigate } from 'react-router-dom';
import { FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { MenuProps } from '@/config/theme/theme';
import { IoMdClose } from 'react-icons/io';


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
    const { levels } = useLevels();
    const [levelId, setLevelId] = useState("")

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

    const filterLessons = useMemo(() => {
        return lessons?.filter((item) =>
            levelId ? item.levelId?.toLowerCase().includes(levelId.toLowerCase()) : true
        );
    }, [lessons, levelId]);



    return (
        <Page title={"الدروس"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <MaterialTable
                heads={heads}
                rows={filterLessons}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => { setOpen(true); setLessonId(id) }}
                onCreate={() => setOpen(true)}
                moreActions={
                    <>
                        <FormControl size="small" sx={{ width: "500px" }}>
                            <InputLabel id="level-id">ابحث عن مستوى معين</InputLabel>
                            <Select
                                labelId="level-id"
                                fullWidth
                                label="ابحث عن مستوى معين"
                                MenuProps={MenuProps}
                                value={levelId}
                                onChange={(e) => setLevelId(e.target.value)}
                                endAdornment={
                                    levelId ? <IconButton onClick={() => setLevelId('')}> <IoMdClose /> </IconButton> : null
                                }
                            >
                                {levels?.map((level) => (
                                    <MenuItem key={level.id} value={level.id}>
                                        {level.name}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>                    </>
                }
            ></MaterialTable>
            <LessonForm setId={(value) => setLessonId(value)} id={lessonId} open={open} setOpen={(value) => setOpen(value)}></LessonForm>
        </Page>
    )
}
