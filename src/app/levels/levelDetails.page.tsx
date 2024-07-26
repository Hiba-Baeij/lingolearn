import { LevelDto } from '@/api/levels/dto'
import DialogForm from '@/shared/components/DialogForm'
import { Card, Checkbox, FormControl, FormHelperText, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, TextField, CardMedia, Skeleton, IconButton, Tooltip, Box, Button, CircularProgress } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { GET_ID_LEVEL_ENDPOINT, LevelsActions, LEVELS_ENDPOINT } from '@/api/levels/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AccountCircle, Description, Edit, Phone } from '@mui/icons-material'
import PasswordIcon from '@mui/icons-material/Password';
import { GiLevelFour } from 'react-icons/gi'
import { FaEye, FaFirstOrder } from 'react-icons/fa6'
import { MenuProps } from '@/config/theme/theme'
import { GET_NAMES_LANGUAGE_ENDPOINT, LanguagesActions } from '@/api/languages/actions'
import Page from '@/shared/components/Page'
import { useNavigate, useParams } from 'react-router-dom'
import { IoMdArrowBack } from 'react-icons/io';

const breadcrumbs = [
    {
        path: '/levels',
        text: 'المستويات'
    },
    {
        path: '/levels',
        text: 'تفاصيل المستوى'
    },
]

const initiale = {
    id: "",
    name: "",
    order: 0,
    description: "",
    languageId: "",
}

export default function LevelDetails() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: levelDto, isLoading } = useQuery({
        enabled: !!id,
        queryKey: [GET_ID_LEVEL_ENDPOINT],
        queryFn: async () => await LevelsActions.GetByIdLevel(id as string),
    })
    // const levelDto = {
    //     id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     name: "string",
    //     description: "string",
    //     order: 1,
    //     languageId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     lessons: [
    //         {
    //             id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //             name: "string",
    //             order: 0,
    //             description: "string",
    //             fileUrl: "string",
    //             type: "Video"
    //         }
    //     ]

    // }

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
            queryClient.invalidateQueries({ queryKey: [LEVELS_ENDPOINT] });

        },
    })

    const onSubmit = handleSubmit(async (v: LevelDto) => {
        mutate(v);
    });
    const resetForm = () => {
        reset({ ...initiale })
    }

    useEffect(() => {
        if (levelDto && id) {
            setValue('description', levelDto?.description)
            setValue('languageId', levelDto?.languageId as string)
            setValue('name', levelDto?.name)
            setValue('order', +levelDto?.order)

        }
    }, [levelDto, id])

    return (
        <Page title={'تفاصيل المستوى'} breadcrumbs={breadcrumbs}>
            <Card className='p-6'>
                <h5>المستوى</h5>
                <form onSubmit={onSubmit} className='grid grid-cols-3 gap-4 mt-5'>
                    <div className="md:col-span-1 col-span-3">
                        <Controller name='name' rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} control={control} render={({ field, fieldState }) =>
                            <TextField error={!!fieldState.error} fullWidth
                                helperText={fieldState.error?.message}
                                {...field} id='name' label={"الاسم"}

                            />
                        }
                        />
                    </div>
                    <div className="md:col-span-1 col-span-3">
                        <Controller name='order' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                            <TextField error={!!fieldState.error} fullWidth
                                helperText={fieldState.error?.message}
                                {...field} id='order' label={"الترتيب"}
                                type="number"
                            />
                        }
                        />
                    </div>
                    <div className="md:col-span-1 col-span-3">
                        <Controller name='description' control={control} rules={{ required: { value: true, message: "هذا الحقل مطلوب" } }} render={({ field, fieldState }) =>
                            <TextField error={!!fieldState.error} fullWidth
                                helperText={fieldState.error?.message}
                                {...field} id='description' label={"الوصف"}
                            />
                        }
                        />
                    </div>
                    <div className="md:col-span-1 col-span-3">
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
                    <Box display={'flex'} flexWrap="wrap" justifyContent={{ lg: 'flex-start', md: "flex-start", xs: "center" }} width={'100%'} alignContent='center' gap={2}>
                        <Button variant='contained' startIcon={<Edit />} type="submit">
                            {
                                isPending ? <CircularProgress color='inherit' size={24} /> : "تعديل"
                            }
                        </Button>
                        <Button variant='outlined' color="secondary" startIcon={<IoMdArrowBack />} onClick={() => navigate('/levels')}>رجوع</Button>
                    </Box>

                </form>


            </Card>
            <Card className='p-6 mt-5'>
                <h5>دروس {levelDto?.name}</h5>
                <div className='grid grid-cols-12 gap-4 mt-4'>

                    {
                        levelDto?.lessons.map((lesson, index) => (
                            <Card key={lesson.id} className="col-span-1 md:col-span-2 relative cursor-pointer">
                                <CardMedia
                                    sx={{ height: 150, width: "100%", borderRadius: '5px' }}
                                    image={'/non-image.svg'}
                                    title="image"
                                />
                                <div className='flex justify-between items-center w-full mt-3 px-2'>
                                    <h6 className='text-sm'>{lesson.name}</h6>
                                    <Tooltip title='رؤية الدرس' >
                                        <IconButton size='small' onClick={() => navigate(`/languages/view-lesson/${lesson.id}`)}> <FaEye /></IconButton>
                                    </Tooltip>
                                </div>
                                <p className='mt-2 px-2 pb-4 text-sm'>{lesson.description.length > 10 ? lesson.description.slice(0, 50) + "......" : lesson.description}</p>

                            </Card>
                        ))
                    }

                </div>
                {
                    !isLoading && levelDto?.lessons.length == 0 &&
                    <h4 className='text-gray-600 text-center'>
                        لا يوجد بيانات
                    </h4>
                }

                {
                    isLoading && [1, 2, 3, 4, 5, 6].map((el) => (
                        <>

                            <Card key={el} className="flex flex-col justify-center items-center lg:hidden">
                                <Skeleton sx={{ width: 150, height: 200 }} />
                            </Card>
                        </>

                    ))

                }
            </Card>

        </Page>
    )
}
