const express = require('express')
const app = express();
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000; 

app.get('/',(req,res)=>{
    res.send("hello");
})


app.listen(PORT, ()=>{
    console.log(`listening in port ${PORT}`);
})