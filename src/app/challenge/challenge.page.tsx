import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Card, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { IoDocumentText } from 'react-icons/io5';

import { MdOutlineDeleteForever, MdEdit } from "react-icons/md";
import NoData from '@/shared/components/NoData';
import { ChallengesActions, CHALLENGES_ENDPOINT } from '@/api/champions/actions';
import ChallengeForm from './components/ChallengeForm';
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { Challenge } from '@/api/champions/dto';
import { useFile } from '@/shared/hooks/useFile';
import moment from 'moment';
import { useLanguages } from '../languages/useLanguages';
import BankQuestionForm from './components/BankQuestion';
import { MenuProps } from '@/config/theme/theme';
import { IoMdClose } from 'react-icons/io';


const breadcrumbs = [
    {
        path: '/challenge',
        text: 'التحديات'
    },
    {
        path: '/challenge',
        text: 'قائمة التحديات'
    }
] as BreadCrumbs[]


export default function Challenges() {
    const [open, setOpen] = useState(false)
    const [challengeId, setChallengeId] = useState("")
    const queryClient = useQueryClient();
    const { getFileUrl } = useFile()
    const { getLanguage, languages } = useLanguages();
    const navigate = useNavigate();
    const [langId, setLangId] = useState("")

    const { data: challenges, isLoading } = useQuery({
        queryKey: [CHALLENGES_ENDPOINT],
        queryFn: ChallengesActions.GetChallenges,
    })


    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string[]) =>
            ChallengesActions.DeleteChallenges(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CHALLENGES_ENDPOINT] });
        },
    });

    const onDelete = (id: string[]) => {
        mutateDelete(id);
    };

    const heads = [
        {
            key: 'imageUrl',
            label: "صورة",
            customRenderer: (item => item.imageUrl ? <img className='w-[40px] h-[40px] rounded-full' src={getFileUrl(item.imageUrl)} alt={'challenge'} /> : <img className='w-[40px] rounded-full' src={'/user.jpg'} alt={'user'} />)

        },
        {
            key: 'name',
            label: "الاسم"
        },
        {
            key: 'startDate',
            label: "تاريخ البداية",
            customRenderer: (item => item.startDate ? moment(item.startDate).format("YYYY-MM-DD") : '-----')

        },
        {
            key: 'endDate',
            label: "تاريخ النهاية",
            customRenderer: (item => item.endDate ? moment(item.endDate).format("YYYY-MM-DD") : '-----')
        },
        {
            key: 'points',
            label: "النقاط"
        },
        {
            key: 'languageId',
            label: "اللغة",
            customRenderer: (item) => getLanguage(item.languageId)?.name

        },

    ] as HeadsType<Challenge>[]

    const filterChallenges = useMemo(() => {
        return challenges?.filter((item) =>
            langId ? item.languageId?.toLowerCase().includes(langId.toLowerCase()) : true
        );
    }, [challenges, langId]);


    return (
        <Page title={"التحديات"} breadcrumbs={breadcrumbs} icon={<IoDocumentText fontSize={20} />}>

            <MaterialTable
                heads={heads}
                rows={filterChallenges}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => { setChallengeId(id); setOpen(true) }}
                onCreate={() => setOpen(true)}
                onMoreActions={(id) => navigate(`/champions/${id}/questions-bank`)}
                moreActions={
                    <>
                        <FormControl size="small" sx={{ width: "500px" }}>
                            <InputLabel id="language-id">ابحث عن لغة معينة</InputLabel>
                            <Select

                                labelId="language-id"
                                fullWidth
                                label="ابحث عن لغة معينة"
                                MenuProps={MenuProps}
                                value={langId}
                                onChange={(e) => setLangId(e.target.value)}
                                endAdornment={
                                    langId ? <IconButton onClick={() => setLangId('')}> <IoMdClose /> </IconButton> : null
                                }
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
            <ChallengeForm setId={(value) => setChallengeId(value)} id={challengeId} open={open} setOpen={(value) => setOpen(value)}></ChallengeForm>
        </Page>
    )
}
