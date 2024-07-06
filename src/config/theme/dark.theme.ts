
import { createTheme } from '@mui/material'
import { sharedThemeConfig } from './sharedThemeConfig'

export const darkTheme = createTheme({
    direction: 'rtl',
    ...sharedThemeConfig,

    palette: {
        mode: 'dark',
        primary: {
            main: "#8750f7",
            contrastText: "#ffffff"
        },
        secondary: {
            main: "#0B0D1D",
            light: '#EDF6F9'
        },

        background: {
            default: '#0B0D1D',
            paper: '#141523',
        },
        text: {
            primary: "#ffffff",
            secondary: "#eeeeee"
        },
        divider: '#373C40'
    },


})
