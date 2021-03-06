const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { setErrorResponse, ErrorHandler } = require('./helpers/errors');
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

app.use(cors({origin: true, credentials: true}));

const port = 3000;

const users = require('./routes/users');
const auth = require('./routes/auth');
const customers = require('./routes/customers');
const budgets = require('./routes/budgets');


const mongoURI = 'mongodb://localhost:27017/app4'; // en la ruta definimos la base de datos
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(mongoURI, options)
        .then(() => console.log('Dataserver connected'))
        .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ACME Technologies',
            version: '1.0.0',
            description: 'AppBudgets API Rest server',
            contact: {
                name: 'Pedro Jiménez',
                email: 'pjimenez@corenetworks.es'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ],
        supportedSubmitMethods: []
    },
    apis: ['./routes/customers.js']
}

const specs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs, {customCss: '.swagger-ui .topbar, .swagger-ui .try-out {display: none}'}))

app.use('/users', users);
app.use('/auth', auth);
app.use('/customers', customers);
app.use('/budgets', budgets);
app.use('/avatars', express.static('avatars'));
app.use('/budgetspdf', express.static('budgetsPDF'));

app.use('/*', () => {
    throw new ErrorHandler(404, 'Invalid path');
})

app.use((err, req, res, next) => {
    setErrorResponse(err, res);
})

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`)
})