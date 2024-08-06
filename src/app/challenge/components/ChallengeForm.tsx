import { Exam } from '@/api/exams/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuProps } from '@/config/theme/theme'
import { useLevels } from '@/app/levels/useLevels'
import { useLanguages } from '@/app/languages/useLanguages'
import { Challenge } from '@/api/champions/dto'
import { ChallengesActions, CHALLENGES_ENDPOINT, GET_ID_CHALLENGE_ENDPOINT } from '@/api/champions/actions'
import FileInput from '@/shared/components/FileInput'
import { FileType, useFile } from '@/shared/hooks/useFile'
import { v4 as uuid } from 'uuid';

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    points: 0,
    languageId: "",
    imageFile: null,
    coverImageFile: null,
    imageUrl: "",
    coverImageUrl: "",
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

export default function ChallengeForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const { languages } = useLanguages();
    const { getFileType, getFileUrl } = useFile();
    const [url, setUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");

    const { data: challengeDto } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_CHALLENGE_ENDPOINT],
        queryFn: async () => await ChallengesActions.GetByIdChallenge(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<Challenge>({
        defaultValues: { ...initiale }
    });

    const { fields, append } = useFieldArray({
        control: control,
        name: 'answers',
        keyName: "_id"
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: Challenge) =>
            id
                ? ChallengesActions.ModifyChallenge({
                    ...v, id: id, answers: v.answers.map(answer => ({
                        ...answer,
                        order: +answer.order
                    }))
                }) : ChallengesActions.AddChallenge({
                    ...v,
                    answers: v.answers.map(answer => ({
                        ...answer,
                        order: +answer.order
                    }))
                }),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [CHALLENGES_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: Challenge) => {
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
            setUrl(challengeDto.imageUrl)
            setCoverUrl(challengeDto.coverImageUrl)
        }
    }, [challengeDto, id])

    return (
        <DialogForm size='md' isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل تحدي" : "إضافة تحدي"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-6 gap-4'>
                <div className="md:col-span-2 col-span-6">
                    <Controller name='name' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='name' label={"الاسم"}


                        />
                    }
                    />
                </div>
                <div className="md:col-span-2 col-span-6">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="lang-id">اللغة</InputLabel>
                        <Controller name="languageId" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <>
                                <Select
                                    labelId="lang-id"
                                    fullWidth
                                    label="اللغة"
                                    MenuProps={MenuProps}
                                    {...field}
                                    error={!!fieldState.invalid}

                                >
                                    {languages?.map((lang) => (
                                        <MenuItem key={lang.id} value={lang.id}>
                                            {lang.name}
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
                <div className="md:col-span-2 col-span-6">
                    <Controller name='points' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='points' label={"النقاط"}
                            onFocus={(e) => e.target.select()}
                            type="number"

                        />
                    }
                    />
                </div>

                <div className="md:col-span-2 col-span-6">
                    <Controller name='startDate' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='startDate' label={"تاريخ البداية"}
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true
                            }}

                        />
                    }
                    />
                </div>
                <div className="md:col-span-2 col-span-6">
                    <Controller name='endDate' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='endDate' label={"تاريخ النهاية"}
                            onFocus={(e) => e.target.select()}
                            type="datetime-local"
                            InputLabelProps={{
                                shrink: true
                            }}

                        />
                    }
                    />
                </div>

                <div className="md:col-span-2 col-span-6">
                    <Controller name='description' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"الوصف"}


                        />
                    }
                    />
                </div>


                <div className="md:col-span-3 col-span-6">
                    <FileInput attachedFiles={url as string ? [{
                        id: uuid(),
                        name: "ملف التحدي",
                        url: url as string,
                        type: getFileType(url as string) as FileType
                    }] : []} control={control} name='imageFile' label={"اختر ملف للتحدي"}></FileInput>
                </div>
                <div className="md:col-span-3 col-span-6">
                    <FileInput control={control} attachedFiles={coverUrl as string ? [{
                        id: challengeDto?.id ?? "",
                        name: "صورة التحدي",
                        url: coverUrl as string,
                        type: getFileType(coverUrl as string) as FileType
                    }] : []} name='coverImageUrl' label={'اختر غلاف للتحدي'}></FileInput>
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
