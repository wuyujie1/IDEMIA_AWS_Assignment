import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#C0C0C0",
        },
        secondary: {
            main: "#FF66B2",
        },
    },
} as const);

export default theme;