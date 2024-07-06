import * as React from "react";
import { DrawerProps } from "@mui/material/Drawer";
import { Alert, AlertTitle, Box, Container } from "@mui/material";
import CssBaseline from '@mui/material/CssBaseline'

import Navbar from "@/layouts/dashboard/components/Navbar";
import DrawerSidebar from "@/layouts/dashboard/components/Drawer";
import { PageProps } from "@/shared/types/pageProps";

const drawerFullWidth = 260;
const miniSizedDrawerWidth = 85
const dashboardPaddingX = 8


const DashboardLayout = (props: Omit<DrawerProps, 'key'> & PageProps) => {
  const [open, setOpen] = React.useState(true);
  const [isMobileDrawerOpen, setMobileDrawerOpen] = React.useState(false)
  const drawerWidth = React.useMemo(() => open ? drawerFullWidth : miniSizedDrawerWidth, [open])
  const handleDrawerOpen = () => {
    setOpen(!open);
  };


  return (

    <Box sx={{ display: "flex", transition: '0.3s', flexDirection: 'column', width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }, ml: { xs: 0, md: drawerWidth + 'px' } }}>
      <CssBaseline />
      <Navbar title={props.title as string} breadCrumb={props.breadCrumbs} onMobileDrawerOpen={() => setMobileDrawerOpen(true)} drawerOpen={open} drawerWidth={drawerWidth} onOpen={handleDrawerOpen} />


      <DrawerSidebar drawerFullWidth={drawerFullWidth} miniSizedDrawerWidth={miniSizedDrawerWidth} open={open} setOpen={(value) => setOpen(value)} mobileDrawerOpen={isMobileDrawerOpen} setMobileDrawerOpen={(value) => setMobileDrawerOpen(value)} />

      <Box component="main" sx={{ flexGrow: 1, position: "relative", pb: 2, mb: { xs: '100px', md: 0 }, px: dashboardPaddingX }}>

        {props.children}
      </Box>
    </Box >
  );
}

export default DashboardLayout