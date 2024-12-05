import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v15-pagesRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({ 
   weight: ['300', '400', '500', '700'],
 subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const theme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});

export default function MyApp(props: AppProps) {
 const { Component, pageProps } = props;
 return (
   <AppCacheProvider {...props}>
     <Head>...</Head>
     <ThemeProvider theme={theme}>
       <main className={roboto.variable}>
         <Component {...pageProps} />
       </main>
     </ThemeProvider>
   </AppCacheProvider>
 );
}
