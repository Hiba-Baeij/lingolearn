import { LanguageDto } from '@/api/languages/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Button, Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { GET_ID_LANGUAGE_ENDPOINT, LanguagesActions, LANGUAGES_ENDPOINT } from '@/api/languages/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Language, NoteAdd, Phone } from '@mui/icons-material'
import { useLanguages } from '../useLanguages'
import FileInput from '@/shared/components/FileInput'
import { FileType, useFile } from '@/shared/hooks/useFile'
import { MenuProps } from '@/config/theme/theme'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    description: "",
    name: "",
    imageFile: null,
}
const ITEM_HEIGHT = 48;

export default function LanguageForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    const { availablelanguages } = useLanguages();
    const { getFileType, openFileWindow } = useFile();
    const [fileUrl, setFileUrl] = useState<string | null | undefined>('');


    const { data: languageDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LANGUAGE_ENDPOINT],
        queryFn: async () => await LanguagesActions.GetByIdLanguage(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<LanguageDto>({
        defaultValues: { ...initiale }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: LanguageDto) =>
            id
                ? LanguagesActions.ModifyLanguage({ ...v, id: id }) : LanguagesActions.AddLanguage(v),
        onSuccess: () => {
            resetForm()
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [LANGUAGES_ENDPOINT] });

        },
    })
    const handleFileUpload = (payload: { file: File; base64: string }) => {
        setFileUrl(payload.base64);
        setValue("imageFile", payload.file);
    };

    const handleIconClick = () => {
        openFileWindow(handleFileUpload);
    };

    const onSubmit = handleSubmit(async (v: LanguageDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })
        setFileUrl('')

    }
    useEffect(() => {
        if (languageDto && id) {
            setValue('name', languageDto?.name)
            setValue('description', languageDto?.description)
            setFileUrl(languageDto?.imageUrl ? languageDto?.imageUrl : '')

        }
    }, [languageDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل اللغة" : "إضافة اللغة"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>

                <div className="col-span-2">
                    <FormControl size="small" fullWidth>
                        <InputLabel id="language-id">الاسم</InputLabel>
                        <Controller name="name" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <>
                                <Select
                                    labelId="language-id"
                                    fullWidth
                                    label="الاسم"
                                    MenuProps={MenuProps}
                                    {...field}
                                    error={!!fieldState.invalid}

                                >
                                    {
                                        availablelanguages?.map((lang, index) => (
                                            <MenuItem key={lang.value} value={lang.value}>{lang.value}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText sx={{ color: '#d32f2f' }}>
                                    {fieldState.error?.message}
                                </FormHelperText>
                            </>
                        } />
                    </FormControl>
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
                {/* <div className="col-span-2">
                    <FileInput attachedFiles={languageDto?.imageUrl ? [{
                        id: languageDto?.id ?? "",
                        name: "صورة اللغة",
                        url: languageDto?.imageUrl,
                        type: getFileType(languageDto?.imageUrl) as FileType
                    }] : []} control={control} name='imageFile'></FileInput>

                </div> */}

            </div>
        </DialogForm>
    )
}
