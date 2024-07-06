import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Typography } from "@mui/material";
import { BsChevronCompactLeft } from 'react-icons/bs'
import navLinks from "@/router/dasboard.navigation";
import { AppConfig } from "@/api/app.config";
import DashboardNavLinks from "./DashboardNavLinks";


const openedMixin = (theme: Theme, drawerWidth: number): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme,
    miniSizedDrawerWidth: number): CSSObject => ({
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),

        overflowX: "hidden",
        width: miniSizedDrawerWidth + 'px',
        [theme.breakpoints.up("sm")]: {
            width: miniSizedDrawerWidth + 'px',
        },
    });

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));



const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "drawerWidth" && prop !== "miniSizedDrawerWidth" })<{ drawerWidth: number, miniSizedDrawerWidth: number }>(({ theme, open, drawerWidth, miniSizedDrawerWidth }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    backgroundColor: `${theme.palette.secondary}`,

    ...(open && {
        ...openedMixin(theme, drawerWidth),
        "& .MuiDrawer-paper": openedMixin(theme, drawerWidth),
    }),
    ...(!open && {
        ...closedMixin(theme, miniSizedDrawerWidth),
        "& .MuiDrawer-paper": closedMixin(theme, miniSizedDrawerWidth),
    }),
}));
interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    mobileDrawerOpen: boolean;
    setMobileDrawerOpen: (value: boolean) => void;
    drawerFullWidth: number
    miniSizedDrawerWidth: number
}

export default function DrawerSidebar({ open, setOpen, mobileDrawerOpen, setMobileDrawerOpen, drawerFullWidth, miniSizedDrawerWidth }: Props) {
    const theme = useTheme();
    // const [open, setOpen] = React.useState(false);
    // const [isMobileDrawerOpen, setMobileDrawerOpen] = React.useState(false)
    const drawerWidth = React.useMemo(() => open ? drawerFullWidth : miniSizedDrawerWidth, [open])
    const handleDrawerOpen = () => {
        setOpen(true);

    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    return (
        <>
            <Drawer miniSizedDrawerWidth={miniSizedDrawerWidth} variant="permanent" open={open} drawerWidth={drawerWidth} PaperProps={{
                elevation: 0, variant: 'elevation',
                sx: (t) => ({
                    display: {
                        xs: 'none',
                        md: 'block'
                    },
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        width: '10px',
                        display: 'none'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        bgcolor: t.palette.divider
                    },
                    backgroundColor: '#0B0D1D'
                }),

            }}>

                <DrawerHeader>
                    <Box
                        display={"flex"}
                        justifyContent={open ? "space-between" : 'center'}
                        width={"100%"}
                        alignItems={"center"}
                        px={1}
                    >
                        <img alt="test" width={'200px'} src="/logo2-dark.svg" />
                        {/* {
                            open &&
                            <Typography fontSize={24} fontWeight={"bold"} variant="h2">
                                {AppConfig.APP_NAME}
                            </Typography>
                        } */}
                        {/* {
                            open &&
                            <IconButton size="small" onClick={() => open ? handleDrawerClose() : handleDrawerOpen()}>
                                {theme.direction === "rtl" ? (
                                    <ChevronRightIcon />
                                ) : (
                                    <BsChevronCompactLeft />
                                )}
                            </IconButton>


                        } */}

                    </Box>
                </DrawerHeader>
                <Box mt={2}>
                    <DashboardNavLinks items={navLinks} fullWidth={open} />
                </Box>
            </Drawer>

            {/* Mobile Drawer  */}
            <MuiDrawer onClose={() => setMobileDrawerOpen(false)} open={mobileDrawerOpen}
                ModalProps={{
                    sx: {
                        zIndex: 2500
                    }
                }}
                SlideProps={{
                    sx: (t: Theme) => ({
                        backgroundColor: t.palette.background.default,
                        width: 300
                    }),
                    elevation: 0
                } as any}>
                <DrawerHeader sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <img alt='test' width="48" src="/logo.png" />

                    <Typography fontSize={13} fontWeight={"bold"} variant="h2">
                        {AppConfig.APP_NAME}
                    </Typography>
                </DrawerHeader>
                <DashboardNavLinks items={navLinks} fullWidth={true} />
            </MuiDrawer>

        </>
    )
}
