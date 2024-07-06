import { Exam } from '@/api/exams/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { GET_ID_EXAM_ENDPOINT, ExamsActions, EXAMS_ENDPOINT } from '@/api/exams/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuProps } from '@/config/theme/theme'
import { useLevels } from '@/app/levels/useLevels'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    text: "",
    order: 0,
    levelId: "",
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

export default function ExamForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const { levels } = useLevels();

    const { data: examDto } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_EXAM_ENDPOINT],
        queryFn: async () => await ExamsActions.GetByIdExam(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<Exam>({
        defaultValues: { ...initiale }
    });

    const { fields, append } = useFieldArray({
        control: control,
        name: 'answers',
        keyName: "_id"
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: Exam) =>
            id
                ? ExamsActions.ModifyExam({
                    ...v, id: id, order: +v.order, answers: v.answers.map(answer => ({
                        ...answer,
                        order: +answer.order
                    }))
                }) : ExamsActions.AddExam({
                    ...v, order: +v.order,
                    answers: v.answers.map(answer => ({
                        ...answer,
                        order: +answer.order
                    }))
                }),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [EXAMS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: Exam) => {
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
        if (examDto && id) {
            reset({ ...examDto })
        }
    }, [examDto, id])

    return (
        <DialogForm size='md' isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الاختبار" : "إضافة الاختبار"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="md:col-span-1 col-span-2">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="level-id">المستوى</InputLabel>
                        <Controller name="levelId" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <>
                                <Select
                                    labelId="level-id"
                                    fullWidth
                                    label="المستوى"
                                    MenuProps={MenuProps}
                                    {...field}
                                    error={!!fieldState.invalid}

                                >
                                    {levels?.map((level) => (
                                        <MenuItem key={level.id} value={level.id}>
                                            {level.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText sx={{ color: '#d32f2f' }}>
                                    {fieldState.error?.message}
                                </FormHelperText>
                            </>
                        } />
                    </FormControl>
                </div>


                <div className="md:col-span-1 col-span-2">
                    <Controller name='order' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='order' label={"الترتيب"}
                            onFocus={(e) => e.target.select()}
                            type="number"

                        />
                    }
                    />
                </div>
                <div className="col-span-2">
                    <Controller name='text' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='title' label={"السؤال"}


                        />
                    }
                    />
                </div>
                {
                    fields.map((field, index) => (
                        <>
                            <div key={field._id} className="col-span-2 flex items-center gap-5">
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
