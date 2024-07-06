import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/index'
import "@fontsource/almarai"
import "@fontsource/poppins"
import "@fontsource/lexend"
import '@/styles/_global_imports.scss'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { store } from '@/app/store'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <App />
      </QueryParamProvider>
    </Provider>
  </BrowserRouter>
)
