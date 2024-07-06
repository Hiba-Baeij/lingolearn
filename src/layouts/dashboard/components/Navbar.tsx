import React from "react"
import { styled } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import {
  Avatar,
  Badge,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Slide,
} from "@mui/material";
import {
  IoMenuOutline,
  IoNotificationsOutline,

} from "react-icons/io5";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { BsChevronCompactRight, } from "react-icons/bs";
import { useContext } from "react";
import { ColorModeContext } from "@/app/hooks/useDarkMode";
import { BreadCrumbItem } from "@/shared/types/navigation";
import { GetDataLingoLearn, GetDecodedJwt } from "@/shared/hooks/useAuth";
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface Props {
  drawerWidth: number;
  drawerOpen: boolean;
  onMobileDrawerOpen: (e: any) => void;
  onOpen: (e: any) => void;
  title: string,
  breadCrumb?: BreadCrumbItem[]
}
export default function Navbar({
  drawerWidth,
  onOpen,
  drawerOpen,
  breadCrumb,
  title,
  onMobileDrawerOpen,
}: Props) {
  // const { toggle, isDarkMode } = useDarkMode({localStorageKey:'dark_mode'});
  const { mode, setMode } = useContext(ColorModeContext);
  const toggle = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const handleOpenUserMenu = () => {
    console.log('handler')
  };

  interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
    children: React.ReactElement;
  }

  function HideOnScroll(props: Props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      threshold: 50,
    });

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })<AppBarProps>(({ theme, open: drawerOpen }) => ({
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(drawerOpen && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <HideOnScroll>
      <AppBar
        position="sticky"
        color="transparent"
        sx={{ borderLeft: 0, borderTop: 0 }}
      >
        <Paper sx={{ p: 1.5, borderRadius: 0, border: 0 }}>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={2}
            justifyContent={"space-between"}
            width={"100%"}
          >
            <Box
              className="left"
              display={"flex"}
              gap={2}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {!drawerOpen && (
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onOpen}
                  edge="start"
                  sx={{
                    height: 35,
                    width: 35,
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <BsChevronCompactRight />
                </IconButton>
              )}

              <IconButton
                onClick={onMobileDrawerOpen}
                size="large"
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{
                  display: {
                    md: "none",
                  },
                }}
              >
                <IoMenuOutline />
              </IconButton>

              <Box className="navigation" gap={2} display='flex' flexWrap='wrap'>

                <Typography fontSize={'20px'} fontWeight={'bold'} variant='h2'>
                  {title ?? breadCrumb?.[breadCrumb.length - 1].text as string}
                </Typography>

              </Box>


            </Box>
            <Box className="right relative" flexBasis={'50%'} justifyContent='flex-end' display='flex' alignItems='flex-start'>
              <Box
                sx={{ flexGrow: 0, alignItems: "center" }}
                display={"flex"}
                gap={{
                  md: 2,
                  xs: 1,
                }}
              >

                <IconButton onClick={() => toggle()}>
                  {mode === "dark" ? <HiOutlineSun /> : <HiOutlineMoon />}
                </IconButton>

                <IconButton >
                  <Badge variant="standard" color="error" badgeContent={5} sx={{ width: 'max-content' }}>
                    <IoNotificationsOutline></IoNotificationsOutline>
                  </Badge>
                </IconButton>

                {/* <Tooltip title="Open settings"> */}
                <Box display={"flex"} alignItems={"center"} gap="10px">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/user.jpg" />
                  </IconButton>
                  <Box
                    sx={{
                      display: {
                        xs: "none",
                        md: "flex",
                      },
                      flexDirection: "column",
                    }}
                  >
                    <Typography>{GetDataLingoLearn()?.fullName}</Typography>
                    <Typography fontSize={10} color="GrayText">
                      {GetDecodedJwt()?.Type}
                    </Typography>
                  </Box>
                </Box>
                {/* </Tooltip> */}
              </Box>
            </Box>
          </Box>
        </Paper>
      </AppBar>
    </HideOnScroll>
  );
}
