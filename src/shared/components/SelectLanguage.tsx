import { FormControl, ListItemIcon, ListItemText, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language'; // Import your image/icon here
import { ContentCut } from '@mui/icons-material';

export default function SelectLanguage() {
    const { i18n, t } = useTranslation();
    const handleChange = (e: SelectChangeEvent) => {
        localStorage.setItem('lang', e.target.value)
        i18n.changeLanguage(e.target.value);
        document.documentElement.lang = i18n.language;
        document.documentElement.dir = i18n.dir();
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
            <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={i18n.language}
                variant="standard"
                onChange={(e) => handleChange(e)}
                renderValue={(selected) => selected == 'ar' ? <div className='gap-4 flex justify-center items-center'>
                    <img src='/uae.png' alt='' width={20} />
                    <h4 className='text-base font-normal'>{t('arabic')}</h4>
                </div> :
                    <div className='gap-4 flex justify-center items-center'>
                        <img src='/tr.png' alt='' width={20} />
                        <h4 className='text-base font-normal'>{t('turkish')}</h4>
                    </div>
                }
            >
                <MenuItem value='ar' >
                    <ListItemIcon>
                        <img src='/uae.png' alt='' width={20} />
                    </ListItemIcon>
                    <ListItemText>{t('arabic')}</ListItemText>
                </MenuItem>
                <MenuItem value='tr'>
                    <ListItemIcon>
                        <img src='/tr.png' alt='' width={20} />
                    </ListItemIcon>
                    <ListItemText>{t('turkish')}</ListItemText>
                </MenuItem>
            </Select >
        </FormControl >

    )
}
