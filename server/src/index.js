const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const colors = require('colors');
const mongoSanitize = require('express-mongo-sanitize');
const socket = require('./sockets');
const connectDB = require('./config/db');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/handlerError');
const port = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(mongoSanitize());
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to the server',
    });
});
routes(app);
app.use(notFound);
app.use(errorHandler);
const server = app
    .listen(port, async () => {
        await connectDB();
        console.log(colors.green(`Server listening on http://localhost:${port}`));
    })
    .on('error', (err) => console.log(colors.red(err.message)));

socket(server);
