import { createTheme } from '@mui/material'
import { sharedThemeConfig } from './sharedThemeConfig';

export const lightTheme = createTheme({
    ...sharedThemeConfig,
    direction: 'rtl',
    palette: {
        mode: 'light',
        primary: {
            main: '#8750f7',
        },
        secondary: {
            main: "#0B0D1D",
        },
        background: {
            default: '#f9f9f9',
            paper: '#ffffff',
        },
        divider: '#eeeeee',

        text: {
            primary: "#2f2f2f",
            secondary: "#777777"
        },


    },



});
