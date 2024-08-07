import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Questions } from '@/api/champions/dto'
import { ChallengesActions, CHALLENGEQUESTIONS_ENDPOINT, GET_ID_CHALLENGEQUESTIONS_ENDPOINT } from '@/api/champions/actions'

type Props = {
    open: boolean;
    id: string;
    challengeId: string
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    text: "",
    order: 0,
    challengeId: "",
    answers: [
        {
            id: "",
            text: "",
            isCorrect: false,
            order: 0
        },
        {
            id: "",
            text: "",
            isCorrect: false,
            order: 0
        },
        {
            id: "",
            text: "",
            isCorrect: false,
            order: 0
        },
        {
            id: "",
            text: "",
            isCorrect: false,
            order: 0
        }
    ]
}

export default function BankQuestionForm({ open, challengeId, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();

    const { data: challengeDto } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_CHALLENGEQUESTIONS_ENDPOINT],
        queryFn: async () => await ChallengesActions.GetByIdChallengesQuestion(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<Questions>({
        defaultValues: { ...initiale }
    });
    const { fields, append } = useFieldArray({
        name: 'answers',
        control: control,
        keyName: '_id'
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (v: Questions) =>
            id
                ? ChallengesActions.ModifyChallengesQuestions({
                    ...v, id: id, challengeId: challengeId,
                }) : ChallengesActions.AddChallengesQuestion({
                    ...v, challengeId: challengeId
                }),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [CHALLENGEQUESTIONS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: Questions) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })

    }
    const indexText = (index: number) => {
        if (index == 0) return "الإجابة الأولى"
        else if (index == 1) return "الإجابة الثانية"
        else if (index == 2) return "الإجابة الثالثة"
        else return "الإجابة الرابعة"

    }

    useEffect(() => {
        if (challengeDto && id) {
            reset({
                ...challengeDto
            })
        }
    }, [challengeDto, id])

    return (
        <DialogForm size='md' isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={"بنك الأسئلة"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-6 gap-5'>
                <div className="md:col-span-3 col-span-6">
                    <Controller name={`text`} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='title' label={"السؤال"}


                        />
                    }
                    />
                </div>
                <div className="md:col-span-3 col-span-6">
                    <Controller name={`order`} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='title' label={"الترتيب"}
                            type="number"

                        />
                    }
                    />
                </div>
                {
                    fields.map((field, index) => (
                        <>
                            <div key={field._id} className="col-span-6 flex items-center gap-5">

                                <Controller control={control} name={`answers.${index}.isCorrect`} render={({ field }) => <Checkbox checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />} />
                                <Controller name={`answers.${index}.order`} control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                                    <TextField error={!!fieldState.error} className="w-[300px]"
                                        helperText={fieldState.error?.message}
                                        {...field} id='order' label={"ترتيب" + " " + indexText(index)}
                                        type="number"
                                        onFocus={(e) => e.target.select()}
                                    />
                                }
                                />
                                <Controller name={`answers.${index}.text`} control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                                    <TextField error={!!fieldState.error} fullWidth
                                        helperText={fieldState.error?.message}
                                        {...field} id='order' label={indexText(index)}
                                        type="text"

                                    />
                                }
                                />
                            </div>

                        </>
                    ))
                }


            </div>
        </DialogForm>
    )
}
