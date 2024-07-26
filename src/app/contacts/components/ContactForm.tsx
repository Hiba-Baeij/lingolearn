import { ContactDto } from '@/api/contacts/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ContactsActions, CONTACTS_ENDPOINT } from '@/api/contacts/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Description, Phone } from '@mui/icons-material'
import { GiLevelFour } from 'react-icons/gi'
import { MenuProps } from '@/config/theme/theme'
import { useLevels } from '@/app/levels/useLevels'

type Props = {
    open: boolean;
    id: string;
    setOpen: (value: boolean) => void
    setId: (value: string) => void
}
const initiale = {
    id: "",
    title: "",
    description: "",
}

export default function ContactForm({ open, setOpen, id, setId }: Props) {
    const queryClient = useQueryClient();
    // const { levels } = useLevels();

    // const { data: contactDto } = useQuery({
    //     enabled: !!id,
    //     queryKey: [GET_ID_CONTACT_ENDPOINT],
    //     queryFn: async () => await ContactsActions.GetByIdContact(id),
    // })


    // const { control, handleSubmit, setValue, reset } = useForm<ContactDto>({
    //     defaultValues: { ...initiale }
    // });

    // const { mutate, isPending } = useMutation({
    //     mutationFn: (v: ContactDto) =>
    //         id
    //             ? ContactsActions.ModifyContact({ ...v, id: id }) : ContactsActions.AddContact(v),
    //     onSuccess: () => {
    //         reset({ ...initiale })
    //         setId("")
    //         setOpen(false)
    //         queryClient.invalidateQueries({ queryKey: [CONTACTS_ENDPOINT] });

    //     },
    // })

    // const onSubmit = handleSubmit(async (v: ContactDto) => {
    //     mutate(v);
    // });
    // const resetForm = () => {
    //     setId("")
    //     reset({ ...initiale })

    // }
    // useEffect(() => {
    //     if (contactDto && id) {
    //         reset({ ...contactDto })
    //     }
    // }, [contactDto, id])


    return (
        <></>
        // <DialogForm isForm onOpenChange={() => setOpen(false)} open={open} isLoading={isPending} title={id ? "تعديل شهادة" : "إضافة شهادة"} formProps={{ onSubmit: (e) => onSubmit(e) }} onClose={() => resetForm()} onReset={() => resetForm()}>
        //     <div className='grid grid-cols-2 gap-4'>
        //         <div className="col-span-2">
        //             <Controller name='title' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
        //                 <TextField error={!!fieldState.error} fullWidth
        //                     helperText={fieldState.error?.message}
        //                     {...field} id='title' label={"العنوان"}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <GiLevelFour />
        //                             </InputAdornment>
        //                         )
        //                     }}

        //                 />
        //             }
        //             />
        //         </div>

        //         <div className="col-span-2">
        //             <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
        //                 <TextField error={!!fieldState.error} fullWidth
        //                     helperText={fieldState.error?.message}
        //                     {...field} id='description' label={"الوصف"}
        //                     InputProps={{
        //                         startAdornment: (
        //                             <InputAdornment position="start">
        //                                 <Description />
        //                             </InputAdornment>
        //                         )
        //                     }}
        //                 />
        //             }
        //             />
        //         </div>
        //         <div className="col-span-2">
        //             <FormControl size="small" fullWidth>
        //                 <InputLabel id="level-id">المستوى</InputLabel>
        //                 <Controller name="levelId" rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
        //                     <>
        //                         <Select
        //                             labelId="level-id"
        //                             fullWidth
        //                             label="المستوى"
        //                             MenuProps={MenuProps}
        //                             {...field}
        //                             error={!!fieldState.invalid}

        //                         >
        //                             {levels?.map((level) => (
        //                                 <MenuItem key={level.id} value={level.id}>
        //                                     {level.name}
        //                                 </MenuItem>
        //                             ))}
        //                         </Select>
        //                         <FormHelperText sx={{ color: '#d32f2f' }}>
        //                             {fieldState.error?.message}
        //                         </FormHelperText>
        //                     </>
        //                 } />
        //             </FormControl>
        //         </div>

        //     </div>
        // </DialogForm>
    )
}
