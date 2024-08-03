import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { EXAMS_ENDPOINT, ExamsActions } from '@/api/exams/actions';
import ExamForm from './components/ExamForm';
import { useNavigate } from 'react-router-dom';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Card, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { IoDocumentText } from 'react-icons/io5';
import { useLevels } from '../levels/useLevels';
import { MenuProps } from '@/config/theme/theme';
import { MdOutlineDeleteForever, MdEdit } from "react-icons/md";
import NoData from '@/shared/components/NoData';


const breadcrumbs = [
    {
        path: '/exams',
        text: 'الاختبارات'
    },
    {
        path: '/exams',
        text: 'قائمة الاختبارات'
    }
] as BreadCrumbs[]


export default function Exams() {
    const [open, setOpen] = useState(false)
    const [examId, setExamId] = useState("")
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { levelsNames, levels } = useLevels();

    const [levelId, setLevelId] = useState<string>('')

    const { data: exams, isLoading } = useQuery({
        queryKey: [EXAMS_ENDPOINT, levelId],
        queryFn: () => ExamsActions.GetExams(levelId),
    })


    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string) =>
            ExamsActions.DeleteExams([id]),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [EXAMS_ENDPOINT] });
        },
    });
    const onDelete = (id: string) => {
        console.log(id);
        mutateDelete(id);
    };
    useEffect(() => {
        if (levelsNames) setLevelId(levelsNames[0]?.id)
    }, [levelsNames])


    return (
        <Page title={"الاختبارات"} breadcrumbs={breadcrumbs} icon={<IoDocumentText fontSize={20} />}>
            <Card className="flex justify-between items-center mb-4 p-3">
                <div className="w-[300px]">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="level-id">المستوى</InputLabel>
                        <Select
                            labelId="level-id"
                            fullWidth
                            label="المستوى"
                            MenuProps={MenuProps}
                            value={levelId}
                            onChange={(e) => setLevelId(e.target.value)}
                        >
                            {levels?.map((level) => (
                                <MenuItem key={level.id} value={level.id}>
                                    {level.name}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                </div>
                <Button onClick={() => setOpen(true)} endIcon={<FaPlus size={16} />} variant='contained'>
                    إضافة
                </Button>

            </Card>
            {
                exams && exams.length > 0 ? exams?.map(exam => (
                    <Accordion key={exam.id} sx={{ mt: 1, py: 1 }}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3-content"
                            id="panel3-header"
                        >
                            <div className='flex justify-between items-center w-full'>
                                {exam.order} - {exam.text}
                                <div className='flex justify-between items-center gap-2 mx-4'>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(true); setExamId(exam.id) }} color="primary"><MdEdit /></IconButton>
                                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(exam.id) }} color="error"><MdOutlineDeleteForever /></IconButton>
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className='flex items-start flex-col gap-3'>
                            {exam.answers.map((answer, index) => (
                                <React.Fragment key={index}>
                                    <h6>
                                        {index + 1 + "- " + answer.text}

                                    </h6>
                                    <Checkbox checked={!!answer.isCorrect} />

                                </React.Fragment>

                            ))}
                        </AccordionDetails>

                    </Accordion>


                )) : <NoData></NoData>
            }
            <ExamForm setId={(value) => setExamId(value)} id={examId} open={open} setOpen={(value) => setOpen(value)}></ExamForm>
        </Page>
    )
}
