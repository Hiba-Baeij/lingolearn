import { LanguageDto } from '@/api/languages/dto'
import { Box, Button, Card, CardMedia, Checkbox, CircularProgress, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent, Skeleton, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import FileUploader from '@/shared/components/FileUploader'
import { GET_ID_LANGUAGE_ENDPOINT, LanguagesActions, LANGUAGES_ENDPOINT } from '@/api/languages/actions'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit, Language, NoteAdd } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import Page from '@/shared/components/Page'
import { useFile } from '@/shared/hooks/useFile'
import { IoMdArrowBack } from 'react-icons/io'
import { BsEye } from 'react-icons/bs'
import { FaEye } from 'react-icons/fa6'

const breadcrumbs = [
    {
        path: '/languages',
        text: 'اللغات'
    },
    {
        path: '/languages',
        text: 'تفاصيل لغة'
    },
]
const initiale = {
    id: "",
    description: "",
    name: "",
    imageFile: null,
}

export default function LanguageDetails() {
    const queryClient = useQueryClient();
    const [imageUrl, setImageUrl] = useState("");
    const { id } = useParams();
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const { getFileUrl } = useFile()
    const navigate = useNavigate()

    const { data: languageDto, isLoading } = useQuery({
        enabled: id != "new",
        queryKey: [GET_ID_LANGUAGE_ENDPOINT],
        queryFn: async () => await LanguagesActions.GetByIdLanguage(id as string),
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
            queryClient.invalidateQueries({ queryKey: [LANGUAGES_ENDPOINT] });
            navigate('/languages')

        },
    })

    const onSubmit = handleSubmit(async (v: LanguageDto) => {
        mutate(v);
    });
    const resetForm = () => {
        reset({ ...initiale })
        setImageUrl('')

    }
    useEffect(() => {
        if (languageDto && id) {
            setValue('name', languageDto?.name)
            setValue('description', languageDto?.description)
            // setValue('imageFile', languageDto?.imageFile)
            setImageUrl(languageDto?.imageUrl)
            console.log(languageDto?.imageUrl);

        }
    }, [languageDto, id])



    return (
        <Page title={'تفاصيل اللغة'} breadcrumbs={breadcrumbs}>
            <Card className='p-6'>
                <h5>اللغة</h5>
                <form onSubmit={onSubmit} className='grid grid-cols-3 gap-4 mt-4'>
                    <div className="col-span-3 md:col-span-1">
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
                    </div>
                    <div className="col-span-3 md:col-span-1">
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

                    <div className="col-span-3 md:col-span-1">
                        {/* {imageUrl} */}
                        <Controller control={control} name="imageFile" render={({ field }) =>
                            <FileUploader
                                {...field}
                                onChangeUrl={setImageUrl}
                                url={imageUrl}
                                // label="صورة اللغة"
                                name="image"
                                value={field.value}
                                dtoId={languageDto?.id}
                            />
                        } />
                    </div>
                    <Box display={'flex'} flexWrap="wrap" justifyContent={{ lg: 'flex-start', md: "flex-start", xs: "center" }} width={'100%'} alignContent='center' gap={2}>
                        <Button variant='contained' startIcon={<Edit />} type="submit">
                            {
                                isPending ? <CircularProgress color='inherit' size={24} /> : "تعديل"
                            }
                        </Button>
                        <Button variant='outlined' color="secondary" startIcon={<IoMdArrowBack />} onClick={() => navigate('/languages')}>رجوع</Button>
                    </Box>

                </form>


            </Card>
            <Card className='p-6 mt-5'>
                <h5>مستويات اللغة</h5>
                <div className='grid grid-cols-12 gap-4 mt-4'>
                    {languageDto?.levels.map(level => (
                        <Card key={level.id} className="col-span-12 md:col-span-6 p-4">
                            <h6>{level.name}</h6>
                            <p className='mt-2 text-sm'>{level.description}</p>
                            <div className='grid grid-cols-3 gap-4 mt-4'>
                                <h6 className="col-span-3">الدروس</h6>
                                {
                                    level.lessons && level.lessons?.length > 0 ? level.lessons.map((lesson, index) => (
                                        <div className="col-span-3 md:col-span-1">
                                            <CardMedia
                                                sx={{ height: 100, width: "100%", borderRadius: '5px' }}
                                                image={'/non-image.svg'}
                                                title="image"
                                            />
                                            <div className='flex justify-between items-center w-full mt-3'>
                                                <h6 className='text-sm'>{lesson.name}</h6>
                                                <Tooltip title='رؤية الدرس' >
                                                    <IconButton size='small' onClick={() => navigate(`/languages/view-lesson/${lesson.id}`)}> <FaEye /></IconButton>
                                                </Tooltip>
                                            </div>
                                            <p className='mt-2 text-xs'>{lesson.description.length > 10 ? lesson.description.slice(0, 50) + "......" : lesson.description}</p>

                                        </div>
                                    )) :

                                        <h6 className="col-span-3 text-gray-600 text-center"> لا يوجد دروس</h6>

                                }
                            </div>
                        </Card>

                    ))
                    }

                </div>
                {
                    !isLoading && languageDto?.levels.length == 0 &&
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
