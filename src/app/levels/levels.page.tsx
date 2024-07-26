import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { LevelDto, Levels as LevelsType } from '@/api/levels/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { LevelsActions, LEVELS_ENDPOINT } from '@/api/levels/actions';
import LevelForm from './components/LevelForm';
import { FaUsers } from 'react-icons/fa6';
import { useLanguages } from '../languages/useLanguages';
import { useNavigate } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { MenuProps } from '@/config/theme/theme';


const breadcrumbs = [
    {
        path: '/levels',
        text: 'المستويات'
    },
    {
        path: '/levels',
        text: 'قائمة المستويات'
    }
] as BreadCrumbs[]


export default function Levels() {
    const [open, setOpen] = useState(false)
    const [levelId, setLevelId] = useState("")
    const queryClient = useQueryClient();
    const { getLanguage, languages } = useLanguages();
    const navigate = useNavigate();

    const { data: levels, isLoading } = useQuery({
        queryKey: [LEVELS_ENDPOINT],
        queryFn: LevelsActions.GetLevels,
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
            key: 'description',
            label: "الوصف"
        },
        {
            key: 'languageId',
            label: "اللغة",
            customRenderer: (item) => getLanguage(item.languageId)?.name
        },
        {
            key: 'lessonsCount',
            label: "عدد الدروس",
            customRenderer: (item) => item.lessonsCount == 0 ? 0 : item.lessonsCount
        }
    ] as HeadsType<LevelsType>[]

    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string[]) =>
            LevelsActions.DeleteLevels(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LEVELS_ENDPOINT] });
        },
    });
    const onDelete = (id: string[]) => {
        mutateDelete(id);
    };

    return (
        <Page title={"المستويات"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <MaterialTable
                heads={heads}
                rows={levels}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => navigate(`/levels/${id}`)}
                onCreate={() => setOpen(true)}
                moreActions={
                    <>
                        <FormControl size="small" sx={{ width: "500px" }}>
                            <InputLabel id="language-id">ابحث عن لغة معينة</InputLabel>

                            <Select
                                labelId="language-id"
                                fullWidth
                                label="ابحث عن لغة معينة"
                                MenuProps={MenuProps}


                            >
                                {languages?.map((lang) => (
                                    <MenuItem key={lang.id} value={lang.id}>
                                        {lang.name}
                                    </MenuItem>
                                ))}
                            </Select>

                        </FormControl>
                    </>
                }
            ></MaterialTable>
            <LevelForm setId={(value) => setLevelId(value)} id={levelId} open={open} setOpen={(value) => setOpen(value)}></LevelForm>
        </Page>
    )
}
