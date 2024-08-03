import React from 'react'
import { ListItemIcon, ListItemText, IconButton, List, ListItem, ListProps, ListItemProps, Card } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { useFile } from '@/shared/hooks/useFile';
type FileType = 'doc' | 'excel' | 'folder' | 'image' | 'pdf' | 'rar' | 'svg' | 'text' | 'txt' | 'video' | 'zip' | 'png' | 'word' | 'mp4'
export interface Preview {
    type: FileType,
    name: string
    // size?: number
    url?: string,
    id: string

}
type Props = {
    listPreview: Preview[];
    onDelete: (index: number) => void;
    listProps?: ListProps
    listItemProps?: ListItemProps
}

export default function FilesPreview({ listPreview, onDelete, listProps, listItemProps }: Props) {
    const { getFileUrl } = useFile();

    return (
        <List sx={{ width: '100%', padding: 0, margin: 0, rounded: 1, }} {...listProps}>

            {
                listPreview.map((preview, index) => (
                    <ListItem dense key={getFileUrl(preview.url)} sx={{ border: t => `1px solid ${t.palette.divider}`, borderRadius: 1, my: 1, overflowX: 'hidden' }} {...listItemProps}>
                        <a target='_blank' href={preview.url}>
                            <ListItemIcon>
                                <img src={`/icons/${preview.type}.png`} width={30} height={30} alt={preview.type} />
                            </ListItemIcon>
                        </a>
                        <ListItemText primary={preview.name.length > 40 ? preview.name.slice(0, 40) + ".........." : preview.name} />
                        <IconButton onClick={() => onDelete(index)}>
                            <CloseIcon></CloseIcon>
                        </IconButton>
                    </ListItem>
                ))
            }

        </List>
    )
}
