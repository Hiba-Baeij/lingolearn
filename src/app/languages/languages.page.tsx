import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_AVAILABLE_LANGUAGE_ENDPOINT, LanguagesActions, LANGUAGES_ENDPOINT } from '@/api/languages/actions';
import LanguageForm from './components/LanguageForm';
import { FaPlus, FaUsers } from 'react-icons/fa6';
import { Button, Card, CardContent, CardMedia, IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Typography } from '@mui/material';
import { MdEdit } from 'react-icons/md';
import NoData from '@/shared/components/NoData';
import { useFile } from '@/shared/hooks/useFile';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useLanguages } from './useLanguages';


const breadcrumbs = [
    {
        path: '/laguages',
        text: 'اللغات'
    },
    {
        path: '/laguages',
        text: 'قائمة اللغات'
    }
] as BreadCrumbs[]

const ITEM_HEIGHT = 48;
export default function Laguages() {
    const [open, setOpen] = useState(false)
    const [languageId, setLanguageId] = useState("")
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: languages, isLoading } = useQuery({
        queryKey: [LANGUAGES_ENDPOINT],
        queryFn: LanguagesActions.GetLanguages,
    })

    const { getFileUrl } = useFile()
    const [anchorElArray, setAnchorElArray] = useState(languages ? languages.map(() => null) : []);

    const handleClick = (event: any, index: number) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = event.currentTarget;
        setAnchorElArray(newAnchorElArray);
    };

    const handleClose = (index: number) => {
        const newAnchorElArray = [...anchorElArray];
        newAnchorElArray[index] = null;
        setAnchorElArray(newAnchorElArray);

    };



    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string) =>
            LanguagesActions.DeleteLanguages([id]),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LANGUAGES_ENDPOINT] });
        },
    });
    const onDelete = (id: string) => {
        mutateDelete(id);
    };


    return (
        <Page title={"اللغات"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <div className="flex justify-end items-center mb-4">
                <Button onClick={() => setOpen(true)} endIcon={<FaPlus size={16} />} variant='contained'>
                    إضافة
                </Button>
            </div>

            <div className='grid grid-cols-3 gap-5'>
                {
                    !isLoading && languages && languages?.map((language, index) => (
                        <Card key={language.id} sx={{ position: 'relative' }} className="col-span-3 lg:col-span-1 relative flex flex-col justify-start lg:flex-row items-center">
                            <CardMedia
                                sx={{ height: 140, width: { lg: 200, md: 200, xs: 250 }, borderRadius: '5px', objectFit: 'cover', marginX: { lg: 1.5, md: 2, xs: 2 }, marginY: { lg: 1.5, md: 2, xs: 2 } }}
                                image={language.imageUrl ? getFileUrl(language.imageUrl) : '/non-image.svg'}
                                title="image"
                            />
                            <IconButton
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                                aria-label="more"
                                id={`long-button-${language.id}`}
                                aria-controls={anchorElArray[index] ? 'long-menu' : undefined}
                                aria-expanded={anchorElArray[index] ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(event: any) => handleClick(event, index)}
                            >
                                <MoreVertIcon fontSize="inherit" color='primary' />
                            </IconButton>


                            <Menu
                                id={`menu-${language.id}`}
                                MenuListProps={{
                                    'aria-labelledby': `long-button-${language.id}`,
                                }}
                                anchorEl={anchorElArray[index]}
                                open={Boolean(anchorElArray[index])}
                                onClose={() => handleClose(index)}
                            >
                                <MenuItem onClick={() => { onDelete(language.id); handleClose(index) }}>
                                    <ListItemIcon>
                                        <RiDeleteBin6Line fontSize={20} color='#d12f2f' />
                                    </ListItemIcon>
                                    <Typography variant="inherit">حذف</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { navigate(`/languages/${language.id}`); handleClose(index) }}>
                                    <ListItemIcon>
                                        <MdEdit fontSize={20} />
                                    </ListItemIcon>
                                    <Typography variant="inherit">تعديل</Typography>
                                </MenuItem>

                            </Menu>
                            <div className='px-2 flex justify-start item-center gap-y-2 flex-col md:text-right text-center lg:mb-0 mb-5'>
                                <div className='flex justify-between item-center ml-5 mt-3'>
                                    <Typography gutterBottom variant="h5" component="div" sx={{ fontSize: 18 }}>
                                        {language.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, mt: 0.3 }}>
                                        ( {language.levelsCount} مستوى)
                                    </Typography>
                                </div>
                                <p className='text-sm'>{language.description}</p>
                            </div>

                        </Card>
                    ))
                }
                {
                    !isLoading && languages?.length == 0 && <div className='col-span-4'>
                        <NoData />
                    </div>
                }

                {
                    isLoading && [1, 2, 3, 4, 5, 6].map((el) => (
                        <>
                            <Card key={el} className="lg:flex items-center hidden">
                                <CardMedia
                                    sx={{ height: 120, width: { lg: 200, md: 200, xs: 250 }, borderRadius: '5px', marginX: { lg: 1.5, md: 2, xs: 2 }, marginY: { lg: 1.5, md: 2, xs: 2 } }}
                                    image="/non-image.svg"
                                    title="image"
                                />
                                <CardContent className='flex flex-col'>
                                    <Skeleton sx={{ width: 200 }} />
                                    <Skeleton sx={{ width: 200 }} />

                                </CardContent>
                            </Card>
                            <Card key={el} className="flex flex-col justify-center items-center lg:hidden">
                                <Skeleton sx={{ width: 150, height: 200 }} />
                            </Card>
                        </>

                    ))

                }

            </div>
            <LanguageForm setId={(value) => setLanguageId(value)} id={languageId} open={open} setOpen={(value) => setOpen(value)}></LanguageForm>
        </Page>
    )
}
