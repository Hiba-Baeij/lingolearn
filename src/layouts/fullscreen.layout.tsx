import { Box, CssBaseline } from '@mui/material'
import React, { PropsWithChildren } from 'react'

export default function FullScreenLayout({ children }: PropsWithChildren) {
    return (
        <Box component="main" sx={{ flexGrow: 1, position: "relative" }}>
            <CssBaseline />

            {children}
        </Box>
    )

}
