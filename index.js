const express = require("express");
require('dotenv').config()
const app = express()
const port = process.env.PORT || 8000;


app.use('/pay',require('./routes/user'))
require('./models/db')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/', (req,res)=>{
    res.send('Welcome to clads Legion');
});

app.listen(port, (req,res)=>{
    try {
        console.log(`Server Running On ${port}`)
    } catch (error) {
        console.log(error.message)
    }
});