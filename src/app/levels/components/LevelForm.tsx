import { LevelDto } from '@/api/levels/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FileUploader from '@/shared/components/FileUploader'
import { GET_ID_LEVEL_ENDPOINT, LevelsActions, LEVELS_ENDPOINT } from '@/api/levels/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Description, Phone } from '@mui/icons-material'
import PasswordIcon from '@mui/icons-material/Password';
import { GiLevelFour } from 'react-icons/gi'
import { FaFirstOrder } from 'react-icons/fa6'
import { MenuProps } from '@/config/theme/theme'
import { GET_NAMES_LANGUAGE_ENDPOINT, LanguagesActions } from '@/api/languages/actions'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    name: "",
    order: 0,
    description: "",
    languageId: "",
}

export default function LevelForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();

    const { data: levelDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LEVEL_ENDPOINT],
        queryFn: async () => await LevelsActions.GetByIdLevel(id),
    })
    const { data: languages } = useQuery({
        queryKey: [GET_NAMES_LANGUAGE_ENDPOINT],
        queryFn: LanguagesActions.GetNameLanguage,
    })

    const { control, handleSubmit, setValue, reset } = useForm<LevelDto>({
        defaultValues: { ...initiale }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: LevelDto) =>
            id
                ? LevelsActions.ModifyLevel({ ...v, id: id }) : LevelsActions.AddLevel(v),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [LEVELS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: LevelDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })

    }
    // useEffect(() => {
    //     if (levelDto && id) {
    //         setValue('description', levelDto?.description)
    //         setValue('languageId', levelDto?.languageId)
    //         setValue('name', levelDto?.name)
    //         setValue('order', levelDto?.order)

    //     }
    // }, [levelDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل المستوى" : "إضافة المستوى"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="md:col-span-1 col-span-2">
                    <Controller name='name' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='name' label={"الاسم"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <GiLevelFour />
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
                <div className="col-span-2">
                    <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"الوصف"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Description />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>
                <div className="col-span-2">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="language-id">اللغة</InputLabel>
                        <Controller name="languageId" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <>
                                <Select
                                    labelId="language-id"
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

            </div>
        </DialogForm>
    )
}
