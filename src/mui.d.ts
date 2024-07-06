// mui.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
    interface Palette {
        light: PaletteColor; // Define the custom color
    }

    interface PaletteOptions {
        light?: PaletteColorOptions; // Define the options for the custom color
    }

}

    declare module '@mui/material/styles' {
        interface ButtonVariants {
            containedLight: React.CSSProperties; // Define the custom button variant
        }

        interface ButtonVariantOverrides {
            containedLight: true; // Enable the variant
        }
        
    }