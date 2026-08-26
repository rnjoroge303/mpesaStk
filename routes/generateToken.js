const axios = require('axios');
const { response } = require('express');
const tUrl = process.env.TOKEN_URL
require('dotenv').config()


async function generateToken(req,res,next) {
    const consumer= process.env.MPESA_CONSUMER_KEY
    const secret = process.env.MPESA_SECRET_KEY
    const auth = Buffer.from(`${consumer.trim()}:${secret.trim()}`).toString("base64");
    await axios.get(tUrl,{
        headers:{
            Authorization: `Basic ${auth}`
        }
    }).then((response)=>{
        console.log(response.data.access_token);
        req.token = response.data.access_token;

        
        if(next) next();
    }).catch((error)=>{
        console.log(error.message)
    })
}
module.exports = generateToken;