import { LessonDto } from '@/api/lessons/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FileUploader from '@/shared/components/FileUploader'
import { GET_ID_LESSON_ENDPOINT, LessonsActions, MODIFY_LESSON_ENDPOINT, LESSONS_ENDPOINT, GET_NAMES_LESSON_ENDPOINT } from '@/api/lessons/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Note, Phone } from '@mui/icons-material'
import { FaFirstOrder } from 'react-icons/fa'
import { MenuProps } from '@/config/theme/theme'
import { GET_NAMES_LEVEL_ENDPOINT, LevelsActions } from '@/api/levels/actions'
import { v4 as uuidv4 } from 'uuid';
import { useLevels } from '@/app/levels/useLevels'

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
    imageFile: null,
    fileUrl: "",
    coverImageUrl: null,
    type: "",
    levelId: "",
    order: 0,
    description: ""
}

export default function LessonForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const [imageUrl, setImageUrl] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const { levels } = useLevels();

    const { data: lessonDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LESSON_ENDPOINT],
        queryFn: async () => await LessonsActions.GetByIdLesson(id),
    })


    const { control, handleSubmit, setValue, reset } = useForm<LessonDto>({
        defaultValues: { ...initiale }
    });

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
        setImageUrl('')

    }
    useEffect(() => {
        if (lessonDto && id) {
            reset({ ...lessonDto })
            setImageUrl(lessonDto?.fileUrl ? lessonDto?.fileUrl : '')

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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Note />
                                    </InputAdornment>
                                )
                            }}

                        />
                    }
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='text' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='text' label={"النص"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Note />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='order' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='order' label={"الترتيب"}
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FaFirstOrder />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"الوصف"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Note />
                                    </InputAdornment>
                                )
                            }}
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
                                    <MenuItem value={1}>وثائق</MenuItem>
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

                <div className="col-span-2">
                    <Controller control={control} name="imageFile" render={({ field }) =>
                        <FileUploader
                            {...field}
                            onChangeUrl={setFileUrl}
                            url={fileUrl}
                            label="فيديو الدرس"
                            text="اختر فيديو معين"
                            name="video"
                            value={field.value}
                            dtoId={uuidv4().toString()}
                        />

                    } />
                </div>
                <div className="col-span-2">
                    {/* {imageUrl} */}
                    <Controller control={control} name="coverImageUrl" render={({ field }) =>
                        <FileUploader
                            {...field}
                            onChangeUrl={setImageUrl}
                            url={imageUrl}
                            label="صورة الدرس"
                            text="اختر صورة لرفعها"
                            name="image"
                            value={field.value}
                            dtoId={uuidv4().toString()} />
                    } />
                </div>

            </div>
        </DialogForm>
    )
}
