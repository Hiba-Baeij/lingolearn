import { StudentDto } from '@/api/students/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FileUploader from '@/shared/components/FileUploader'
import { GET_ID_STUDENT_ENDPOINT, StudentsActions, STUDENTS_ENDPOINT } from '@/api/students/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Email, Phone } from '@mui/icons-material'
import PasswordIcon from '@mui/icons-material/Password';
import moment from "moment"
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
    const [imageUrl, setImageUrl] = useState("");
    const [block, setBlock] = useState(false);

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
                ? StudentsActions.ModifyStudent({ ...v, id: id }) : StudentsActions.AddStudent(v),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
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

        },
    })

    const onSubmit = handleSubmit(async (v: StudentDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })
        setImageUrl('')

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
            setValue('birthDate', moment(studentDto?.birthDate).format("YYYY-MM-DD"))
            setValue('phoneNumber', studentDto?.phoneNumber)
            // setValue('imageFile', studentDto?.imageFile)
            setImageUrl(studentDto?.imageUrl ? studentDto?.imageUrl : '')
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
                    <Controller name='birthDate' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
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
                <div className="col-span-2">
                    {/* {imageUrl} */}
                    <Controller control={control} name="imageFile" render={({ field }) =>
                        <FileUploader
                            {...field}
                            onChangeUrl={setImageUrl}
                            url={imageUrl}
                            label="صورة الطالب"
                            name="image"
                            value={field.value}
                            dtoId={studentDto?.id}
                        />
                    } />
                </div>

            </div>
        </DialogForm >
    )
}
