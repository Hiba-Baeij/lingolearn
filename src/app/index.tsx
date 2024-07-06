import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import React, { useContext } from "react";
import { useEffect, useMemo } from 'react'
import FeedBackProvider from "@/shared/components/FeedBackProvider";
import 'rsuite/dist/rsuite.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { QueryClientProvider, QueryClient, useQuery } from "@tanstack/react-query"
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { Routes, useNavigate } from "react-router-dom";
import { CacheProvider } from "@emotion/react";
import CssBaseline from '@mui/material/CssBaseline';
import { IsLoggedIn, LogOut } from "@/shared/hooks/useAuth";
import { DashboardRoutes } from "@/router/routes/dashboard.routes";
import RenderRoutes from "@/router/Router";
import { darkTheme } from "@/config/theme/dark.theme";
import { lightTheme } from "@/config/theme/light.theme";
import { ColorModeContext, useDarkMode } from "./hooks/useDarkMode";

function App() {
  const qyeryClient = new QueryClient()
  const { mode, setMode } = useDarkMode();
  const isDarkMode = useMemo(() => mode === 'dark', [mode])
  const activeTheme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode])
  const navigation = useNavigate();

  const stylisPlugins = [prefixer];
  const htmlDir = document.querySelector('html');
  if (htmlDir?.dir === 'rtl') {
    stylisPlugins.push(rtlPlugin)
  }

  const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins,

  });

  useEffect(() => {
    isDarkMode ? document.body.classList.add('dark') : document.body.classList.remove('dark')
  }, [isDarkMode])

  useEffect(() => {
    if (!IsLoggedIn()) {
      LogOut();
      navigation('/login')
    }

  }, [])


  return (
    <>
      <div className="app" dir="rtl">
        <ColorModeContext.Provider value={{ mode, setMode }}>
          <ThemeProvider theme={activeTheme}>
            <QueryClientProvider client={qyeryClient}>
              <CacheProvider value={cacheRtl}>
                <CssBaseline />
                <FeedBackProvider>
                  <Routes>
                    {RenderRoutes({ routes: DashboardRoutes, })}
                  </Routes>
                </FeedBackProvider>
              </CacheProvider>
            </QueryClientProvider>
            <ToastContainer />
          </ThemeProvider>
        </ColorModeContext.Provider>

      </div>
    </>
  );
}

export default App;
