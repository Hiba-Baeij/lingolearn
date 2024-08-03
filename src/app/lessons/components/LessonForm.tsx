import { LessonDto } from '@/api/lessons/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { GET_ID_LESSON_ENDPOINT, LessonsActions, LESSONS_ENDPOINT } from '@/api/lessons/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuProps } from '@/config/theme/theme'
import { useLevels } from '@/app/levels/useLevels'
import FileInput from '@/shared/components/FileInput'
import { FileType, useFile } from '@/shared/hooks/useFile'
import { Add, Close } from '@mui/icons-material'
import { v4 as uuid } from 'uuid';

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}

const initial: LessonDto & {
    coverImageUrl: File | null;
    fileUrl: File | null;
} = {
    id: "",
    name: "",
    text: "",
    coverImageUrl: null,
    fileUrl: null,
    expectedTimeOfCompletionInMinute: 0,
    linksList: [{ link: '' }],
    type: "0",
    levelId: "",
    order: 0,
    description: ""
};



export default function LessonForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const [url, setUrl] = useState("");
    const [coverUrl, setCoverUrl] = useState("");
    const { levels } = useLevels();

    const { data: lessonDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LESSON_ENDPOINT],
        queryFn: async () => await LessonsActions.GetByIdLesson(id),
    })

    const { control, handleSubmit, setValue, reset, watch, getValues } = useForm<LessonDto & {
        coverImageUrl: File | null;
        fileUrl: File | null
    }>({
        defaultValues: { ...initial }
    });

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control: control,
        name: 'linksList',
    });

    const watchType = watch('type');
    const { getFileType, getFileUrl } = useFile();

    const { mutate, isPending } = useMutation({
        mutationFn: (v: LessonDto & {
            coverImageUrl: File | null;
            fileUrl: File | null
        }) =>
            id
                ? LessonsActions.ModifyLesson({
                    ...v, id: id,
                    coverImageUrl: v.coverImageUrl,
                    fileUrl: v.fileUrl,
                    links: v.linksList.map(el => el.link) as string[]
                }) : LessonsActions.AddLesson({
                    ...v,
                    coverImageUrl: v.coverImageUrl,
                    fileUrl: v.fileUrl,
                    links: v.linksList.map(el => el.link) as string[]
                }),
        onSuccess: () => {
            resetForm()
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [LESSONS_ENDPOINT] });
        },
    })

    const onSubmit = handleSubmit(async (v: LessonDto & {
        coverImageUrl: File | null;
        fileUrl: File | null
    }) => {
        mutate(v);
    });

    const resetForm = () => {
        setId("")
        reset({ ...initial })
        setUrl('')
        setCoverUrl('')
    }

    const getTextType = () => {
        if (+watchType == 0) return "فيديو"
        else if (+watchType == 1) return "وثيقة"
        else if (+watchType == 2) return "ملف"
        else return "رابط"
    }

    useEffect(() => {
        if (lessonDto && id) {
            const mappedLinks = lessonDto?.links?.map((link: string) => ({ link }));
            console.log(typeof lessonDto.coverImageUrl);

            reset({
                linksList: mappedLinks,
                description: '',
                levelId: lessonDto.levelId,
                id: lessonDto.id,
                name: lessonDto.name,
                expectedTimeOfCompletionInMinute: lessonDto.expectedTimeOfCompletionInMinute,
                order: lessonDto.order,
                text: lessonDto.text,
                type: lessonDto.type,
                coverImageUrl: null,
                fileUrl: null
            })
            setUrl(getFileUrl(typeof lessonDto.fileUrl == 'string' ? lessonDto.fileUrl : ''))
            setCoverUrl(getFileUrl(typeof lessonDto.coverImageUrl == 'string' ? lessonDto.coverImageUrl : ''))

        }
    }, [lessonDto, id])

    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الدرس" : "إضافة الدرس"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="col-span-2">
                    <Controller name='name' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='name' label={"الاسم"}
                        />
                    }
                    />
                </div>
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
                            type="number"
                        />
                    }
                    />
                </div>
                {+watchType == 1 && <div className="md:col-span-1 col-span-2">
                    <Controller name='expectedTimeOfCompletionInMinute' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='time' label={"وقت انتهاء الدرس"}
                            type="number"
                        />
                    }
                    />
                </div>}

                <div className="md:col-span-1 col-span-2">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="type">النوع</InputLabel>
                        <Controller name="type" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <>
                                <Select
                                    labelId="type"
                                    fullWidth
                                    label="النوع"
                                    MenuProps={MenuProps}
                                    {...field}
                                    error={!!fieldState.invalid}
                                    disabled={lessonDto?.id ? true : false}
                                >
                                    <MenuItem value={0}>فيديو</MenuItem>
                                    <MenuItem value={1}>وثيقة</MenuItem>
                                    <MenuItem value={2}>ملف</MenuItem>
                                    <MenuItem value={3}>رابط</MenuItem>
                                </Select>
                                <FormHelperText sx={{ color: '#d32f2f' }}>
                                    {fieldState.error?.message}
                                </FormHelperText>
                            </>
                        } />
                    </FormControl>
                </div>


                {+watchType == 0 && <div className="col-span-2">
                    <FileInput attachedFiles={url as string ? [{
                        id: uuid(),
                        name: "فيديو الدرس",
                        url: url as string,
                        type: getFileType(url as string) as FileType
                    }] : []} control={control} name='fileUrl' label={"فيديو الدرس"}></FileInput>
                </div>}

                {+watchType == 2 && <div className="col-span-2">
                    <FileInput attachedFiles={url as string ? [{
                        id: uuid(),
                        name: "ملف الدرس",
                        url: url as string,
                        type: getFileType(url as string) as FileType
                    }] : []} control={control} name='fileUrl' label={"ملف الدرس"}></FileInput>
                </div>}

                {+watchType == 3 && (
                    <div className="col-span-2 flex justify-between items-center">
                        <Typography>الروابط : </Typography>
                        <IconButton color="primary" onClick={() => appendLink({
                            link: ''
                        })}><Add /></IconButton>
                    </div>
                )}

                {+watchType == 3 && linkFields.map((field, index) => (
                    <div className="col-span-2 flex justify-center items-center w-full" key={field.id}>

                        <Controller
                            control={control}
                            name={`linksList.${index}.link`}
                            rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }}
                            render={({ field, fieldState }) =>
                                <TextField

                                    error={!!fieldState.error}
                                    fullWidth
                                    helperText={fieldState.error?.message}
                                    {...field}
                                    label={`رابط ${index + 1}`}
                                />
                            }
                        />
                        <IconButton color="error" onClick={() => removeLink(index)}><Close /></IconButton>

                    </div>
                ))}

                {/* {JSON.stringify(lessonDto?.coverImageUrl)} */}
                <div className="col-span-2">
                    <FileInput control={control} attachedFiles={coverUrl as string ? [{
                        id: lessonDto?.id ?? "",
                        name: "صورة اللغة",
                        url: coverUrl as string,
                        type: getFileType(coverUrl as string) as FileType
                    }] : []} name='coverImageUrl' label={'اختر غلاف للدرس'}></FileInput>
                </div>
                {+watchType == 1 && <div className="col-span-2">
                    <Controller name='text' control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='text' label={"النص"}
                        />
                    }
                    />
                </div>}
                <div className="col-span-2">
                    <Controller name='description' control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"الوصف"}
                        />
                    }
                    />
                </div>
            </div>
        </DialogForm>
    )
}
