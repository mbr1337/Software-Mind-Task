const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const FormData = sequelize.define('FormData', {
    kontynent: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    imie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nazwisko: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dataUrodzenia: {
        type: DataTypes.DATE,
        allowNull: true,
    },
});

module.exports = FormData;