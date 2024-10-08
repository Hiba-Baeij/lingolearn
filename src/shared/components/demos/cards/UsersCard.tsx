import React from 'react'
import { Avatar, Card, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import { FaEllipsisV } from 'react-icons/fa'
import { Best } from '@/api/home/dto'
import { HOST_URL } from '@/api/app.config'
type Props = {
    students: Best[] | undefined
}
export default function UsersCard({ students }: Props) {
    return (
        <Card className='col-span 12 md:col-span-4 p-4'>
            <Typography variant="h6" fontWeight={'bold'}>أفضل الطلاب</Typography>
            {/* <Typography variant="body1" color='GrayText' >Lorem ipsum dolor sit amet.</Typography> */}
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    students && students?.length ? students?.map(student => (

                        <ListItem key={student.id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={student.name} src={student.imageUrl ? HOST_URL + "/" + student.imageUrl : "/user.jpg"} />
                            </ListItemAvatar>
                            <ListItemText>{student.name}</ListItemText>
                            <IconButton size='small'>
                                <FaEllipsisV></FaEllipsisV>
                            </IconButton>
                        </ListItem>
                    )) : <div className="text-center flex justify-center w-full py-4 text-xl font-bold text-gray-400">
                        لا توجد بيانات
                    </div>

                }

            </List>
        </Card>
    )
}
