import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useEffect, useState } from 'react'
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
    const { getLanguage } = useLanguages();
    const navigate = useNavigate();

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
            customRenderer: (item => item.imageUrl ? <img className='w-[40px] rounded-full' src={getFileUrl(item.imageUrl)} alt={'user'} /> : <img className='w-[40px] rounded-full' src={'/user.jpg'} alt={'user'} />)

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

    return (
        <Page title={"التحديات"} breadcrumbs={breadcrumbs} icon={<IoDocumentText fontSize={20} />}>

            <MaterialTable
                heads={heads}
                rows={challenges}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => { setChallengeId(id); setOpen(true) }}
                onCreate={() => setOpen(true)}
                onMoreActions={(id) => navigate(`/champions/${id}/questions-bank`)}
                moreActions={
                    <>
                        <TextField sx={{ width: "500px" }} id='name' label={"ابحث عن اسم التحدي"} />
                    </>
                }
            ></MaterialTable>
            <ChallengeForm setId={(value) => setChallengeId(value)} id={challengeId} open={open} setOpen={(value) => setOpen(value)}></ChallengeForm>
        </Page>
    )
}
