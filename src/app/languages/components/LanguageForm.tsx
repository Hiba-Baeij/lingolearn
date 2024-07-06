import { LanguageDto } from '@/api/languages/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Button, Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FileUploader from '@/shared/components/FileUploader'
import { GET_ID_LANGUAGE_ENDPOINT, LanguagesActions, LANGUAGES_ENDPOINT } from '@/api/languages/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Language, NoteAdd, Phone } from '@mui/icons-material'
import PasswordIcon from '@mui/icons-material/Password';
import { useLanguages } from '../useLanguages'

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
    const [imageUrl, setImageUrl] = useState("");
    const { availablelanguages } = useLanguages();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

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
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [LANGUAGES_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: LanguageDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })
        setImageUrl('')

    }
    useEffect(() => {
        if (languageDto && id) {
            setValue('name', languageDto?.name)
            setValue('description', languageDto?.description)
            setImageUrl(languageDto?.imageUrl ? languageDto?.imageUrl : '')

        }
    }, [languageDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل اللغة" : "إضافة اللغة"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="col-span-2 flex items-center gap-3">
                    <Controller name='name' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='name' label={"الاسم"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Language />
                                    </InputAdornment>
                                )
                            }}

                        />
                    }
                    />

                    <Button
                        variant='contained'
                        color="primary"
                        id="basic-button"
                        aria-controls={openMenu ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenu ? 'true' : undefined}
                        onClick={handleClickMenu}
                    >
                        اختر لغة
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
                            },
                        }}
                    >
                        {
                            availablelanguages?.map((lang, index) => (
                                <MenuItem key={index} onClick={() => { setValue('name', lang.value); handleCloseMenu() }}>{lang.value}</MenuItem>
                            ))
                        }
                    </Menu>
                </div>
                <div className="col-span-2">
                    <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='description' label={"الوصف"}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteAdd />
                                    </InputAdornment>
                                )
                            }}
                        />
                    }
                    />
                </div>

                <div className="col-span-2">
                    {JSON.stringify(imageUrl)}
                    <Controller control={control} name="imageFile" render={({ field }) =>
                        <FileUploader
                            {...field}
                            onChangeUrl={setImageUrl}
                            url={imageUrl}
                            label="صورة اللغة"
                            name="image"
                            value={field.value}
                            dtoId={languageDto?.id}
                        />
                    } />
                </div>

            </div>
        </DialogForm>
    )
}
