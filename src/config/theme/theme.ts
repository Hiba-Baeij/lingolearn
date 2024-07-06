import { PaletteMode } from "@mui/material";
import { lightTheme } from "./light.theme";
import { darkTheme } from './dark.theme';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const createThemeMui = (mode: PaletteMode) => {
    if (mode === 'light') return lightTheme
    else return darkTheme
};
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
}


