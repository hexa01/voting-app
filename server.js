const express = require('express')
const app = express();
const db = require('./db')
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000; 

app.get('/',(req,res)=>{
    res.send("hello");
})

// Import the router files
const userRoutes = require('./routes/userRoutes');

// Use the routers
app.use('/user', userRoutes);

app.listen(PORT, ()=>{
    console.log(`listening in port ${PORT}`);
})