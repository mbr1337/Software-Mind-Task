import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { ClearIcon, DatePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import { cssTransition, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import { setIsOldie } from '../store';
import { saveFormData, getFormData, getContinents, deleteUserData, deleteAllUsersData, getSingleFormData } from '../api';
import dayjs from 'dayjs';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
const continentsList = [
    "Afryka",
    "Ameryka Południowa",
    "Ameryka Północna",
    "Antarktyda",
    "Australia",
    "Azja",
    "Europa"
];

function Form() {
    const dispatch = useDispatch();
    const isOldie = useSelector(state => state.oldie);
    const [formData, setFormData] = useState({
        kontynent: '',
        imie: '',
        nazwisko: '',
        dataUrodzenia: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
    const [formList, setFormList] = useState([]);
    const [singleFormList, setSingleFormList] = useState(null);
    const [continents, setContinents] = useState([]);
    const theme = useTheme();
    const isLgDown = useMediaQuery(theme.breakpoints.down('lg'));


    useEffect(() => {
        console.log('isOldie', isOldie);
    }, [isOldie]);

    useEffect(() => {
        const fetchContinents = async () => {
            const data = await getContinents();
            setContinents(data);
        };

        const fetchFormData = async () => {
            const data = await getFormData();
            setFormList(data);
        };

        fetchContinents();
        fetchFormData();
    }, []);

    useEffect(() => {
        if (formData.dataUrodzenia && formData.dataUrodzenia > new Date()) {
            setIsSubmitDisabled(true);
        } else {
            setIsSubmitDisabled(false);
        }
    }, [formData.dataUrodzenia]);

    useEffect(() => {
        const calculateAge = (dob) => {
            const diff = Date.now() - new Date(dob).getTime();
            const age = new Date(diff).getUTCFullYear() - 1970;
            console.log('age', age);
            return age;
        };
        if (formData.dataUrodzenia && calculateAge(formData.dataUrodzenia) > 60) {
            dispatch(setIsOldie(true));
        } else {
            dispatch(setIsOldie(false));
        }
    }, [formData.dataUrodzenia, dispatch]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, dataUrodzenia: date });
    };

    const validate = () => {
        let tempErrors = {};
        if (!formData.imie) {
            tempErrors.imie = "To pole jest wymagane";
        }
        if (formData.kontynent === "Europa" && formData.nazwisko.length < 2) {
            tempErrors.kontynent = "Nie spełnione kryteria";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            const dataToSend = {
                kontynent: formData.kontynent || null,
                imie: formData.imie || null,
                nazwisko: formData.nazwisko || null,
                dataUrodzenia: formData.dataUrodzenia ? formData.dataUrodzenia.format('YYYY-MM-DD') : null
            };

            await saveFormData(dataToSend);
            const data = await getFormData();
            setFormList(data);

            const age = dayjs().diff(dayjs(formData.dataUrodzenia), 'year');
            if (age > 60) {
                dispatch(setIsOldie(true));
            }

            setFormData({ kontynent: '', imie: '', nazwisko: '', dataUrodzenia: null });
            toast.success("Success", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        } catch (error) {
            console.error('Error saving data', error);
            toast.error("Error saving data", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        }
    };


    const handleDeleteUser = async (id) => {
        try {
            await deleteUserData(id);
            const data = await getFormData();
            setFormList(data);
            toast.info("User deleted", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        } catch (error) {
            console.error('Error deleting data', error);
            toast.error("Error deleting user", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        }
    };

    const handleDeleteAllUsers = async () => {
        try {
            await deleteAllUsersData();
            const data = await getFormData();
            setFormList(data);
            toast.warning("All users deleted", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        } catch (error) {
            console.error('Error deleting data', error);
            toast.error("Error deleting all users", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        }
    };


    const [open, setOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleClosePreview = () => {
        setPreviewOpen(false);
    };

    const handleConfirmDelete = () => {
        handleDeleteAllUsers();
        setOpen(false);
    };

    const handleViewUser = async (id) => {
        try {
            const response = await getSingleFormData(id);
            setSingleFormList(response);
            setPreviewOpen(true);
            console.log('response', response)

        } catch (error) {
            console.error('Error getting data', error);
            toast.error("Error fetching user data", {
                position: 'bottom-center',
                transition: swirl,
                theme: 'dark',
                draggablePercent: 80,
                draggable: true
            });
        }
    }

    const swirl = cssTransition({
        enter: "swirl-in-fwd",
        exit: "swirl-out-bck"
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom textAlign={"center"}>
                Formularz
            </Typography>
            <TextField
                select
                label="Kontynent"
                name="kontynent"
                value={formData.kontynent}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.kontynent}
                helperText={errors.kontynent}
            >
                {continentsList.map((continent) => (
                    <MenuItem key={continent} value={continent}>
                        {continent}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                label="Imię"
                name="imie"
                value={formData.imie}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.imie}
                helperText={errors.imie}
            />
            <TextField
                label="Nazwisko"
                name="nazwisko"
                value={formData.nazwisko}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
            />
            <DatePicker
                label="Data urodzenia"
                value={formData.dataUrodzenia}
                onChange={handleDateChange}
                slotProps={{
                    textField: {
                        fullWidth: true,
                        margin: 'normal',
                        error: !!errors.dataUrodzenia,
                        helperText: errors.dataUrodzenia
                    }
                }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                sx={{ mx: 'auto', display: 'block' }}
            >
                Wyślij
            </Button>

            <Table sx={{ mt: 4 }}>
                <TableHead>
                    {isLgDown ? (
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Kontynent</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Imię</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Nazwisko</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Data urodzenia</TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell sx={{ textAlign: 'center' }}>Kontynent</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Imię</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Nazwisko</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Data urodzenia</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Usuń</TableCell>
                            <TableCell sx={{ textAlign: 'center' }}>Podejrzyj</TableCell>
                        </TableRow>
                    )}
                </TableHead>
                <TableBody>
                    {isLgDown ? (
                        formList.map((item) => (
                            <TableRow key={item.id} onClick={() => handleViewUser(item.id)}>
                                <TableCell sx={{ textAlign: 'center' }}>{item.kontynent}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{item.imie}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{item.nazwisko}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{dayjs(item.dataUrodzenia).format('YYYY-MM-DD')}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        formList.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ textAlign: 'center' }}>{item.kontynent}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{item.imie}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{item.nazwisko}</TableCell>
                                <TableCell sx={{ textAlign: 'center' }}>{dayjs(item.dataUrodzenia).format('YYYY-MM-DD')}</TableCell>
                                <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}> <ClearIcon data-testid="delete-user-icon-1" onClick={() => handleDeleteUser(item.id)} /> </TableCell>
                                <TableCell sx={{ textAlign: 'center', cursor: 'pointer' }}> <RemoveRedEyeIcon data-testid="view-user-icon-1" onClick={() => handleViewUser(item.id)} /></TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
                disabled={formData.length === 0}
                sx={{ mx: 'auto', display: 'block', mt: 3 }}
            >
                Usuń wszystkich
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
                    {"Czy na pewno chcesz usunąć wszystkich użytkowników?"}
                </DialogTitle>
                <DialogContent>
                    <Typography textAlign={"center"}>
                        Ta akcja jest nieodwracalna. Czy na pewno chcesz kontynuować?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus sx={{ color: 'green' }}>
                        Anuluj
                    </Button>
                    <Button onClick={handleConfirmDelete} sx={{ color: 'red' }} >
                        Potwierdź
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={previewOpen}
                onClose={handleClosePreview}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
                    {"Dane szczegółowe"}
                </DialogTitle>
                <DialogContent>
                    {singleFormList ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                ID: {singleFormList.id}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Stworzono: {singleFormList.createdAt.slice(0, 10)}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Zaktualizowano: {singleFormList.updatedAt.slice(0, 10)}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Imię: {singleFormList.imie}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Nazwisko: {singleFormList.nazwisko}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Kontynent: {singleFormList.kontynent}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Data urodzenia: {dayjs(singleFormList.dataUrodzenia).format('YYYY-MM-DD')}
                            </Typography>
                        </Box>
                    ) : (
                        <Typography variant="body1" align="center">
                            Loading data...
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button onClick={handleClosePreview} color="primary" >
                        <DeleteIcon data-testid="delete-user-icon-1" sx={{ color: 'red' }} onClick={() => { handleDeleteUser(singleFormList.id); handleClosePreview(); }} />
                    </Button>
                    <Button onClick={handleClosePreview} color="primary" autoFocus >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer transition={swirl} limit={3} draggable draggablePercent={80} />
        </Container>
    );
}

export default Form;
