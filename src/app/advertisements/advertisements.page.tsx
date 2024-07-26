import Page, { BreadCrumbs } from '@/shared/components/Page'
import React, { useState } from 'react'
import MaterialTable from '@/shared/components/table/MaterialTable';
import { HeadsType } from '@/shared/components/table/CrudTable';
import { LevelDto, Levels as LevelsType } from '@/api/levels/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ADVERTISEMENTS_ENDPOINT, AdvertisementsActions } from '@/api/advertisements/actions';
import AdvertisementForm from './components/AdvertisementForm';
import { FaPlus, FaUsers } from 'react-icons/fa6';
import { useLanguages } from '../languages/useLanguages';
import { useNavigate } from 'react-router-dom';
import { Button, Card, IconButton, ListItemIcon, Menu, MenuItem, Paper, Typography } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdEdit } from 'react-icons/md';


const breadcrumbs = [
    {
        path: '/advertisements',
        text: 'الإعلانات'
    },
    {
        path: '/advertisements',
        text: 'قائمة الإعلانات'
    }
] as BreadCrumbs[]


export default function Advertisements() {
    const [open, setOpen] = useState(false)
    const [advertisementId, setAdvertisementId] = useState("")
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { data: advertisements, isLoading } = useQuery({
        queryKey: [ADVERTISEMENTS_ENDPOINT],
        queryFn: AdvertisementsActions.GetAdvertisements,
    })
    // const advertisements = [
    //     {
    //         id: "1",
    //         order: "1",
    //         name: "Advertisement 1",
    //         imageUrl: ["https://www.marketing91.com/wp-content/uploads/2018/12/Advertising-3.jpg",
    //             "https://previews.123rf.com/images/rawpixel/rawpixel1510/rawpixel151017992/46773264-advertising-advertise-branding-commercial-marketing-concept.jpg",
    //             "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202009/ad_1200x768.png?size=1200:675",
    //         ],
    //         description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    //     },
    //     {
    //         id: "2",
    //         order: "2",
    //         name: "Advertisement 2",
    //         imageUrl: ["https://www.marketing91.com/wp-content/uploads/2018/12/Advertising-3.jpg",
    //             "https://previews.123rf.com/images/rawpixel/rawpixel1510/rawpixel151017992/46773264-advertising-advertise-branding-commercial-marketing-concept.jpg",
    //             "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202009/ad_1200x768.png?size=1200:675",
    //         ],
    //         description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    //     },
    //     {
    //         id: "3",
    //         order: "3",
    //         name: "Advertisement 3",
    //         imageUrl: ["https://www.marketing91.com/wp-content/uploads/2018/12/Advertising-3.jpg",
    //             "https://previews.123rf.com/images/rawpixel/rawpixel1510/rawpixel151017992/46773264-advertising-advertise-branding-commercial-marketing-concept.jpg",
    //             "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202009/ad_1200x768.png?size=1200:675",
    //         ],
    //         description: " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.",
    //     },
    // ]
    const [anchorElArray, setAnchorElArray] = useState(advertisements ? advertisements?.map(() => null) : []);

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
    // const { data: advertisements, isLoading } = useQuery({
    //     queryKey: [ADVERTISEMENTS_ENDPOINT],
    //     queryFn: AdvertisementsActions.GetAdvertisements,
    // })

    const { mutate: mutateDelete, isSuccess } = useMutation({
        mutationFn: (id: string) =>
            AdvertisementsActions.DeleteAdvertisements([id]),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADVERTISEMENTS_ENDPOINT] });
        },
    });
    const onDelete = (id: string) => {
        mutateDelete(id);
    };


    return (
        <Page title={"الإعلانات"} breadcrumbs={breadcrumbs} icon={<FaUsers fontSize={20} />}>
            <div className="flex justify-end items-center mb-4">
                <Button onClick={() => setOpen(true)} endIcon={<FaPlus size={16} />} variant='contained'>
                    إضافة
                </Button>
            </div>
            <div className='grid grid-cols-3 gap-5'>
                {
                    advertisements?.map((item, index) =>
                        <Card key={item.id} className="md:col-span-1 col-span-2 p-5 relative rounded-md">
                            <IconButton
                                sx={{ position: 'absolute', top: 2, right: 2, zIndex: 99, backgroundColor: "#eeeeee" }}
                                aria-label="more"
                                color="inherit"
                                id={`long-button-${item.id}`}
                                aria-controls={anchorElArray[index] ? 'long-menu' : undefined}
                                aria-expanded={anchorElArray[index] ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(event: any) => handleClick(event, index)}
                            >
                                <MoreVertIcon fontSize="inherit" color='primary' />
                            </IconButton>


                            <Menu
                                id={`menu-${item.id}`}
                                MenuListProps={{
                                    'aria-labelledby': `long-button-${item.id}`,
                                }}
                                anchorEl={anchorElArray[index]}
                                open={Boolean(anchorElArray[index])}
                                onClose={() => handleClose(index)}
                            >
                                <MenuItem onClick={() => { onDelete(item.id); handleClose(index) }}>
                                    <ListItemIcon>
                                        <RiDeleteBin6Line fontSize={20} color='#d12f2f' />
                                    </ListItemIcon>
                                    <Typography variant="inherit">حذف</Typography>
                                </MenuItem>
                                <MenuItem onClick={() => { setOpen(true); setAdvertisementId(item.id); handleClose(index) }}>
                                    <ListItemIcon>
                                        <MdEdit fontSize={20} />
                                    </ListItemIcon>
                                    <Typography variant="inherit">تعديل</Typography>
                                </MenuItem>

                            </Menu>
                            <Carousel autoPlay={false}>
                                {
                                    item?.imageUrl?.map(url => (
                                        <img src={url} alt="" className='w-full h-[200px] rounded-md' />
                                    ))
                                }
                            </Carousel>

                            <h5>{item.title}</h5>
                            <p className='text-sm mt-2'>{item.description}</p>
                        </Card>

                    )
                }
            </div>
            {/* <Carousel>
                {
                    advertisements.map((item, i) =>
                        <Card className="p-4" key={i}>
                            <h4>{item.name}</h4>
                            <p>{item.description}</p>

                            <Button className="CheckButton">
                                Check it out!
                            </Button>
                        </Card>
                    )
                }
            </Carousel> */}
            {/* <MaterialTable
                heads={heads}
                rows={levels}
                selectable
                isLoading={isLoading}
                actions={['create', 'delete', 'details', 'edit']}
                onDelete={(ids) => onDelete(ids)}
                onEdit={(id) => navigate(`/levels/${id}`)}
                onCreate={() => setOpen(true)}
            ></MaterialTable> */}

            <AdvertisementForm setId={(value) => setAdvertisementId(value)} id={advertisementId} open={open} setOpen={(value) => setOpen(value)}></AdvertisementForm>
        </Page>
    )
}
