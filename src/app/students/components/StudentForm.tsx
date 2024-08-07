import { StudentDto } from '@/api/students/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { GET_ID_STUDENT_ENDPOINT, StudentsActions, STUDENTS_ENDPOINT } from '@/api/students/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Email, Phone } from '@mui/icons-material'
import PasswordIcon from '@mui/icons-material/Password';
import moment from "moment"
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
    fullName: "",
    gender: "Male",
    imageFile: null,
    password: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
}

export default function StudentForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const [block, setBlock] = useState(false);
    const { getFileType, openFileWindow } = useFile();
    const [fileUrl, setFileUrl] = useState<string | null | undefined>('');

    const { data: studentDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_STUDENT_ENDPOINT],
        queryFn: async () => await StudentsActions.GetByIdStudent(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<StudentDto>({
        defaultValues: { ...initiale }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: StudentDto) =>
            id
                ? StudentsActions.ModifyStudent({ ...v, id: id, birthDate: v.birthDate == "" ? null : v.birthDate }) : StudentsActions.AddStudent(v),
        onSuccess: () => {
            setOpen(false)
            resetForm()
            queryClient.invalidateQueries({ queryKey: [STUDENTS_ENDPOINT] });

        },
    })

    const { mutate: mutateBlock, isPending: isPendingBlock } = useMutation({
        mutationFn: () => StudentsActions.BlockStudent({
            id: id as string,
            block: block
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [STUDENTS_ENDPOINT] });
            resetForm()

        },
    })

    const handleFileUpload = (payload: { file: File; base64: string }) => {
        setFileUrl(payload.base64);
        setValue("imageFile", payload.file);
    };

    const handleIconClick = () => {
        openFileWindow(handleFileUpload);
    };


    const onSubmit = handleSubmit(async (v: StudentDto) => {
        console.log(typeof v.birthDate);

        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })
        setFileUrl('')

    }
    const onBlock = () => {
        mutateBlock()
        setBlock(prev => !prev)
        // console.log(block);

    }

    useEffect(() => {
        if (studentDto && id) {
            setValue('fullName', studentDto?.fullName)
            setValue('gender', studentDto?.gender)
            setValue('email', studentDto?.email)
            setValue('birthDate', studentDto?.birthDate ? moment(studentDto?.birthDate).format("YYYY-MM-DD") : '')
            setValue('phoneNumber', studentDto?.phoneNumber)
            // setValue('imageFile', studentDto?.imageFile)
            setFileUrl(studentDto?.imageUrl ? studentDto?.imageUrl : '')
            setBlock(studentDto?.isBlock)

        }
    }, [studentDto, id])


    return (
        <DialogForm isForm appendActions={
            id && <Button variant='contained' color={block ? "error" : "success"} onClick={onBlock}>
                {
                    !isPendingBlock ?
                        block ? "محظور" : "غير محظور" : <CircularProgress color='inherit' size={24} />
                }
            </Button>
        } onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الطالب" : "إضافة الطالب"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='fullName' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='fullName' label={"الاسم"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                )
                            }}

                        />
                    }
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='email' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='email' label={"البريد الالكتروني"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='phoneNumber' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='phoneNumber' label={"رقم الهاتف"}
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>

                <div className="md:col-span-1 col-span-2">
                    <Controller name='password' control={control} rules={{ required: studentDto?.id ? { value: false, message: "" } : { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} name='password' id='password' label={"كلمة المرور"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PasswordIcon />
                                    </InputAdornment>
                                )
                            }}
                        />

                    }
                    />

                </div>
                <div className="col-span-2">
                    <Controller name='birthDate' control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} name='birthDate' id='birthDate' label={"تاريخ الميلاد"}
                            type="date"
                            InputLabelProps={{ shrink: true }} />

                    }
                    />

                </div>
                <div className="md:col-span-1 col-span-3">
                    <Controller name='gender' control={control} render={({ field, fieldState }) =>
                        <RadioGroup row {...field}>
                            <FormControlLabel value={'Female'} control={<Radio />} label={"أنثى"} />
                            <FormControlLabel value={'Male'} control={<Radio />} label={"ذكر"} />
                        </RadioGroup>
                    }
                    />
                </div>
                {/* {JSON.stringify(fileUrl)} */}
                <div className="col-span-2">
                    {fileUrl ? (
                        <div style={{ border: "1px solid #eee" }} className='w-full rounded-lg cursor-pointer flex justify-center items-center' onClick={handleIconClick} >
                            <img src={fileUrl} className='w-[260px] h-[230px] rounded-lg object-cover' alt="Profile" />
                        </div>
                    ) : (
                        <div style={{ border: "1px solid #eee" }} className='w-full rounded-lg cursor-pointer flex justify-center items-center' onClick={handleIconClick} >
                            <img src='/non-image.svg' />
                        </div>
                    )}
                </div>

            </div>
        </DialogForm >
    )
}
