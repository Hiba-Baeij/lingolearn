import { LevelDto } from '@/api/levels/dto'
import DialogForm from '@/shared/components/DialogForm'
import { InputAdornment, InputLabel, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Description } from '@mui/icons-material'
import { GiLevelFour } from 'react-icons/gi'
import { FaFirstOrder } from 'react-icons/fa6'
import { NotificationsActions, GET_ID_NOTIFICATION_ENDPOINT, NOTIFICATIONS_ENDPOINT } from '@/api/notifications/actions'

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
}

export default function NotificationForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();

    const { data: notificationDto, isLoading } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_NOTIFICATION_ENDPOINT],
        queryFn: async () => await NotificationsActions.GetByIdNotification(id),
    })

    const { control, handleSubmit, setValue, reset } = useForm<LevelDto>({
        defaultValues: { ...initiale }
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (v: LevelDto) =>
            id
                ? NotificationsActions.ModifyNotification({ ...v, id: id }) : NotificationsActions.AddNotification(v),
        onSuccess: () => {
            reset({ ...initiale })
            setId("")
            setOpen(false)
            queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: LevelDto) => {
        mutate(v);
    });
    const resetForm = () => {
        setId("")
        reset({ ...initiale })

    }
    useEffect(() => {
        if (notificationDto && id) {
            reset({ ...notificationDto })
        }
    }, [notificationDto, id])


    return (
        <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل الإشعار" : "إضافة الإشعار"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
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

            </div>
        </DialogForm>
    )
}
