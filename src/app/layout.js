'use client';

import ReduxProvider from "./GlobalRedux/Provider";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useSelector } from "react-redux";
import { lightTheme, darkTheme } from "./theme";

export default function RootLayout({ children }) {
    return (
        <ReduxProvider>
            <ThemeWrapper>{children}</ThemeWrapper>
        </ReduxProvider>
    );
}

// Redux içinde çağırılmalı
function ThemeWrapper({ children }) {
    const theme = useSelector((state) => state.main.theme);

    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
