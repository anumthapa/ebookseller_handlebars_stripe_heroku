import express, { static } from 'express';
import { stripeSecretKey } from './config/keys';
const stripe = require('stripe')(stripeSecretKey);
import { json, urlencoded } from 'body-parser';
import exphbs from 'express-handlebars';

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultlayout: 'main'}));
app.set('view engine' , 'handlebars');

// Body Parser Middleware
app.use(json());
app.use(urlencoded({extended:false}));

// Set Static Folder
app.use(static(`${__dirname}/public`));

//Index Route 
app.get('/', (req,res)=>{
    res.render('index',{
        stripePublishableKey : key.stripePublishableKey
    });
});

app.get('/success', (req,res)=>{
    res.render('success');
});
// charge Route

app.post('/charge', (req, res)=>{
    const amount = 2500;

    stripe.customers.create({
        email : req.body.stripeEmail,
        source : req.body.stripeToken
    })
    .then(customer=> stripe.charges.create({
        amount,
        description : 'Web Development Ebook',
        currency : 'usd',
        customer : customer.id
    }))
    .then(charge => res.render('success'));
   
});
const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server started on Port ${port}`);
});
