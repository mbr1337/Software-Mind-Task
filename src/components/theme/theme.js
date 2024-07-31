import { createTheme } from '@mui/material';

const createDynamicTheme = (fontSize) => createTheme({
    typography: {
        h1: {
            fontSize: 34 * fontSize,
        },
        h2: {
            fontSize: 30 * fontSize,
        },
        h3: {
            fontSize: 26 * fontSize,
        },
        h4: {
            fontSize: 22 * fontSize,
        },
        h5: {
            fontSize: 18 * fontSize,
        },
        h6: {
            fontSize: 16 * fontSize,
        },
        fontFamily: 'Montserrat',
    },
    palette: {
        text: {},
        background: {},
        buttons: {
            proceed: {
                color: 'green',
            },
            warning: {
                color: 'red',
            },
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 50,
                    fontSize: 14 * fontSize,
                    backgroundColor: 'white',
                    color: 'black',
                    padding: '10px 20px',
                    '&:hover': {
                        backgroundColor: 'white',
                        color: 'black',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: 14 * fontSize,
                },
            },
        },
    },
});

export default createDynamicTheme;
