import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AdvertisementsActions, GET_ID_ADVERTISEMENT_ENDPOINT, ADVERTISEMENTS_ENDPOINT } from '@/api/advertisements/actions'
import { AdvertisementDto } from '@/api/advertisements/dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Description } from '@mui/icons-material'
import { GiLevelFour } from 'react-icons/gi'
import FileInput from '@/shared/components/FileInput'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    title: "",
    fileImage: [],
    imageUrl: [],
    description: "",
}

export default function AdvertisementForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();

    const { data: advertisementDto, isSuccess: isSuccessDetails } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_ADVERTISEMENT_ENDPOINT],
        queryFn: async () => await AdvertisementsActions.GetByIdAdvertisement(id),
    })


    const { control, handleSubmit, setValue, reset } = useForm<AdvertisementDto>({
        defaultValues: { ...initiale }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: AdvertisementDto) =>
            id
                ? AdvertisementsActions.ModifyAdvertisement({ ...v, id: id }) : AdvertisementsActions.AddAdvertisement(v),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [ADVERTISEMENTS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: AdvertisementDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })

    }
    useEffect(() => {
        if (advertisementDto && id) {
            reset({ ...advertisementDto })
        }
    }, [advertisementDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الإعلان" : "إضافة الإعلان"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
            <div className='grid grid-cols-2 gap-4'>
                <div className="col-span-2">
                    <Controller name='title' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                        <TextField error={!!fieldState.error} fullWidth
                            helperText={fieldState.error?.message}
                            {...field} id='title' label={"العنوان"}
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
                    <Controller control={control} name='showInWebsite' render={({ field }) => <FormControlLabel label="إظهار الإعلان في الموقع" control={<Checkbox checked={!!field.value} onChange={e => field.onChange(e.target.checked)} />}></FormControlLabel>} />
                </div>

                <div className="col-span-2">
                    <FileInput control={control} name='imageFile'></FileInput>
                </div>

            </div>
        </DialogForm>
    )
}
