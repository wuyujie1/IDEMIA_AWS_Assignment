import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#808080",
        },
        secondary: {
            main: "#FF66B2",
        },
    },
    components: {
        MuiFormHelperText: {
            styleOverrides: {
                root:{
                    marginLeft: 0
                }
            }
        }

    }
} as const);

export default theme;