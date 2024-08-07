import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, Checkbox, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { IoDocumentText } from 'react-icons/io5';
import { MdOutlineDeleteForever, MdEdit } from "react-icons/md";
import NoData from '@/shared/components/NoData';
import { CHALLENGEQUESTIONS_ENDPOINT, ChallengesActions } from '@/api/champions/actions';
import BankQuestionForm from './components/BankQuestion';


const breadcrumbs = [
  {
    path: '/exams',
    text: 'التحديات'
  },
  {
    path: '/exams',
    text: "بنك الأسئلة"
  },

] as BreadCrumbs[]

export default function BankQuestionsPage() {
  const [open, setOpen] = useState(false)
  const [questionId, setQuestionId] = useState("")
  const queryClient = useQueryClient();
  const { id } = useParams();

  const { data: questions, isLoading } = useQuery({
    queryKey: [CHALLENGEQUESTIONS_ENDPOINT],
    queryFn: () => ChallengesActions.GetChallengesQuestions(id as string),
  })


  const { mutate: mutateDelete, isSuccess } = useMutation({
    mutationFn: (id: string) =>
      ChallengesActions.DeleteChallengesQuestions([id]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CHALLENGEQUESTIONS_ENDPOINT] });
    },
  });

  const onDelete = (id: string) => {
    console.log(id);
    mutateDelete(id);
  };

  return (
    <Page title={"بنك الأسئلة"} breadcrumbs={breadcrumbs} icon={<IoDocumentText fontSize={20} />}>
      <div className="flex justify-end items-end">
        <Button onClick={() => setOpen(true)} endIcon={<FaPlus size={16} />} variant='contained'>
          إضافة
        </Button>

      </div>

      {
        questions && questions.length > 0 ? questions?.map(question => (
          <Accordion key={question.id} sx={{ mt: 1, py: 1 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <div className='flex justify-between items-center w-full'>
                {question.order} - {question.text}
                <div className='flex justify-between items-center gap-2 mx-4'>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); setOpen(true); setQuestionId(question.id) }} color="primary"><MdEdit /></IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); onDelete(question.id) }} color="error"><MdOutlineDeleteForever /></IconButton>
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails className='flex items-start flex-col gap-3'>
              {question.answers.map((answer, index) => (
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
      <BankQuestionForm challengeId={id as string} setId={(value) => setQuestionId(value)} id={questionId} open={open} setOpen={(value) => setOpen(value)}></BankQuestionForm>
    </Page>
  )
}
