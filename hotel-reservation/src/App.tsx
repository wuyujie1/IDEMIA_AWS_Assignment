import React from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <HomePage/>
        </ThemeProvider>
    );
}

export default App;
