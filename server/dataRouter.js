const express = require('express');
const { body, validationResult } = require('express-validator');
const FormData = require('./models/FormData');
const router = express.Router();

router.use(express.json());

const continents = [
    "Afryka",
    "Ameryka Południowa",
    "Ameryka Północna",
    "Antarktyda",
    "Australia",
    "Azja",
    "Europa"
];

router.post('/form', [

    body('kontynent').optional(),
    body('imie').isString().notEmpty(),
    body('nazwisko').optional(),
    body('dataUrodzenia').optional(),
    // body('dataUrodzenia').optional().isISO8601().toDate(),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { kontynent, imie, nazwisko, dataUrodzenia } = req.body;

    try {
        const formData = await FormData.create({ kontynent, imie, nazwisko, dataUrodzenia });
        res.status(201).json(formData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

router.get('/continents', (req, res) => {
    res.json(continents);
});

router.get('/form', async (req, res) => {
    try {
        const formData = await FormData.findAll();
        res.json(formData);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/form/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await FormData.destroy({ where: { id: id } });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.delete('/form', async (req, res) => {
    try {
        await FormData.destroy({ where: {} });
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/form/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const formData = await FormData.findOne({ where: { id: id } });
        res.json(formData);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router