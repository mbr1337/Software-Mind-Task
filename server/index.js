const express = require('express');
const dataRouter = require('./dataRouter');
const sequelize = require('./db');

const port = 5000;
const app = express();
const cors = require('cors')

app.use(cors());
app.use('/api', dataRouter);




app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.info(`Listening at http://localhost:${port}`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

module.exports = app;