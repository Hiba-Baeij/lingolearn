import React from 'react'
import { Avatar, Card, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import { FaEllipsisV } from 'react-icons/fa'
import { Best } from '@/api/home/dto'
import { HOST_URL } from '@/api/app.config'
type Props = {
    languages: Best[] | undefined
}
export default function LanguagesCard({ languages }: Props) {
    return (
        <Card className='col-span 12 md:col-span-4 p-4'>
            <Typography variant="h6" fontWeight={'bold'}>أفضل اللغات</Typography>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    languages && languages?.length ? languages?.map(lang => (

                        <ListItem key={lang.id} alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={lang.name} src={lang.imageUrl ? HOST_URL + "/" + lang.imageUrl : "/user.jpg"} />
                            </ListItemAvatar>
                            <ListItemText>{lang.name}</ListItemText>
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
