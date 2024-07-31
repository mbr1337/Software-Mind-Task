import { Box, Button, Divider, Grid, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
// import { Link as ScrollLink } from 'react-scroll';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { toast, cssTransition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const data3 = [
    { website: 'LinkedIn', url: 'https://www.linkedin.com/in/mikołaj-bryndal-394a9026b' },
    { website: 'GitHub', url: 'https://github.com/mbr1337' },
]
const swirl = cssTransition({
    enter: "swirl-in-fwd",
    exit: "swirl-out-bck"
});


const hoverEffect = {
    position: 'relative',
    '&:hover': { color: 'primary.main' },
    '&::after': {
        content: '""',
        position: 'absolute',
        width: '0',
        height: '2px',
        bottom: '-2px',
        left: '0',
        backgroundColor: 'primary.main',
        transition: 'width 0.3s',
    },
    '&:hover::after': {
        width: '100%',
    },
};

function Footer() {
    const [isCopying, setIsCopying] = useState(false);
    const [copied, setCopied] = useState(false);
    const theme = useTheme();
    const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));

    const handleCopyEmail = () => {
        setCopied(false);
        setIsCopying(true);

        navigator.clipboard.writeText('bryndalmikolaj@gmail.com')
            .then(() => {
                setIsCopying(false);
                setCopied(true);
                isLgDown && toast.success('Email copied to clipboard', {
                    position: 'bottom-center',
                    transition: swirl,
                    theme: 'dark',
                    draggablePercent: 80,
                    draggable: true
                })
                setTimeout(() => {
                    setCopied(false);
                }, 3000);
            })
            .catch((err) => {
                setIsCopying(false);
                console.error('Failed to copy:', err);
            });
    };

    return (
        <Box p={5} >
            <Divider sx={{ m: 3 }} />
            {isLgDown ? (
                <Stack direction="column" spacing={2} alignItems="center">
                    <Typography variant="h6" >Mikołaj Bryndal</Typography>
                    <Typography variant="h6" p={1} onClick={handleCopyEmail} sx={{ cursor: 'pointer' }}>bryndalmikolaj@gmail.com</Typography>
                    <Button variant="contained" sx={{ border: '2px solid #fdfdfd', borderRadius: 50, bgcolor: "#ffffff" }} href='https://drive.google.com/file/d/11qL4PwZEiJ1AuGB4YrzpweJ9KJPpq75C/view?usp=sharing' target='_blank'>CV</Button>
                    {data3.map((item, index) => (
                        <a key={index} href={item.url} target='_blank' rel='noreferrer'>
                            <Typography variant="h6" sx={[hoverEffect, { cursor: 'pointer' }]} >
                                {item.website}
                            </Typography>
                        </a>
                    ))}

                </Stack>
            ) : (
                <Grid container justifyContent={isLgDown ? "center" : "space-between"} alignItems="center" spacing={isLgDown ? 3 : 0}>
                    <Grid item>
                        <Typography variant="h6" >Mikołaj Bryndal</Typography>
                    </Grid>
                    <Grid item>
                        <Stack direction={isLgDown ? "column" : "row"} spacing={2} alignItems="center">
                            <Box sx={{ borderRadius: 50, px: 2, py: 1, display: 'flex', alignItems: 'center', bgcolor: "#ffffff" }}>
                                <Typography variant="h6" p={1}>bryndalmikolaj@gmail.com</Typography>
                                <Button
                                    variant="contained"
                                    onClick={handleCopyEmail}
                                    disabled={isCopying}
                                >
                                    {isCopying ? '...' : (copied ? 'Copied!' : 'Copy')}
                                </Button>
                            </Box>
                            <Button variant="contained" sx={{ border: '2px solid #fdfdfd', borderRadius: 50, bgcolor: "#ffffff" }} href='https://drive.google.com/file/d/11qL4PwZEiJ1AuGB4YrzpweJ9KJPpq75C/view?usp=sharing' target='_blank'>CV</Button>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack direction="row" spacing={2} justifyContent={isLgDown ? "center" : "flex-end"}>
                            {data3.map((item, index) => (
                                <a key={index} href={item.url} target='_blank' rel='noreferrer'>
                                    <Typography variant="h6" sx={[hoverEffect, { cursor: 'pointer' }]}  >
                                        {item.website}
                                    </Typography>
                                </a>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>
            )
            }
        </Box>
    );
}

export default Footer