import { LessonDto } from '@/api/lessons/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { GET_ID_LESSON_ENDPOINT, LessonsActions, LESSONS_ENDPOINT } from '@/api/lessons/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { MenuProps } from '@/config/theme/theme'
import { useLevels } from '@/app/levels/useLevels'
import FileInput from '@/shared/components/FileInput'
import { FileType, useFile } from '@/shared/hooks/useFile'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    name: "",
    text: "",
    coverImageUrl: undefined,
    fileUrl: undefined,
    type: "0",
    levelId: "",
    order: 0,
    description: ""
}

export default function LessonForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    // const [imageUrl, setImageUrl] = useState("");
    // const [fileUrl, setFileUrl] = useState("");
    const { levels } = useLevels();

    const { data: lessonDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LESSON_ENDPOINT],
        queryFn: async () => await LessonsActions.GetByIdLesson(id),
    })


    const { control, handleSubmit, setValue, reset, watch } = useForm<LessonDto>({
        defaultValues: { ...initiale }
    });
    // const watchType = useWatch({ control, name: 'type' })
    const watchType = watch('type')
    const { getFileType } = useFile();

    const { mutate, isPending } = useMutation({
        mutationFn: (v: LessonDto) =>
            id
                ? LessonsActions.ModifyLesson({ ...v, id: id }) : LessonsActions.AddLesson(v),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [LESSONS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: LessonDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })
        // setImageUrl('')

    }
    const getTextType = () => {
        if (+watchType == 0) return "فيديو"
        else if (+watchType == 1) return "وثيقة"
        else if (+watchType == 2) return "ملف"
        else return "رابط"

    }
    useEffect(() => {
        if (lessonDto && id) {
            reset({ ...lessonDto })
            setValue("coverImageShow", lessonDto?.coverImageUrl ? lessonDto?.coverImageUrl as string : "")
            setValue("fileUrlShow", lessonDto?.fileUrl ? lessonDto?.fileUrl as string : "")

        }
    }, [lessonDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الدرس" : "إضافة الدرس"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="md:col-span-1 col-span-2">
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

                {+watchType != 3 && <div className="col-span-2">
                    <FileInput attachedFiles={lessonDto?.fileUrlShow ? [{
                        id: lessonDto?.id ?? "",
                        name: "صورة اللغة",
                        url: lessonDto?.fileUrlShow,
                        type: getFileType(lessonDto?.fileUrlShow) as FileType
                    }] : []} control={control} name='fileUrl' label={getTextType() + " " + "الدرس"}></FileInput>
                    {/* <Controller control={control} name="fileUrl" render={({ field }) =>
                        <FileUploader
                            {...field}
                            onChangeUrl={setFileUrl}
                            url={fileUrl}
                            label={getTextType() + " " + "الدرس"}
                            text={'اختر' + " " + getTextType() + " " + "معين"}
                            name="file"
                            value={field.value}
                            dtoId={uuidv4().toString()}
                        />

                    } /> */}
                </div>
                }
                {+watchType == 3 && <div className="col-span-2">
                    <Controller control={control} name="text" render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"ادخل الرابط"}
                        />

                    } />
                </div>
                }
                <div className="col-span-2">
                    <FileInput control={control} attachedFiles={lessonDto?.coverImageShow ? [{
                        id: lessonDto?.id ?? "",
                        name: "صورة اللغة",
                        url: lessonDto?.coverImageShow,
                        type: getFileType(lessonDto?.coverImageShow) as FileType
                    }] : []} name='coverImageUrl' label={'اختر غلاف للدرس'}></FileInput>
                </div>
                <div className="col-span-2">
                    <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
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
