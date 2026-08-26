const axios = require('axios')
const pool = require('../models/db')
require('dotenv').config()


async function stkPush(req,res,next) {
    try {
        const mUrl = process.env.MPESA_URL;
        const shortCode = process.env.MPESA_SHORTCODE;
        const consumer= process.env.MPESA_CONSUMER_KEY;
        const secret = process.env.MPESA_SECRET_KEY;
        const passkey = process.env.MPESA_PASS_KEY;
        const token = req.token;
        const rawDate = new Date().toISOString();
        const timestamp = rawDate.slice(0,19).replace(/[-T: ]/g, '');
        console.log({
            timestamp: timestamp,
            consumer: consumer,
            secret: secret,
            passkey: passkey,
            Token: token
        })
        const Password =new Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64")
        await axios.post(mUrl,
            {
                BusinessShortCode: shortCode,
                Password: Password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: amount,
                PartyA: phone_no,
                PartyB: shortCode,
                PhoneNumber: phone_no,
                CallBackURL: "https://5d1a-102-205-236-30.ngrok-free.app/pay/callback",
                AccountReference: "Clad Legion Esports",
                TransactionDesc: "Team registration"
            },
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }

        ).then(async(response)=>{
            console.log(response.data)
            req.chck = response.data.CheckoutRequestID
            await pool.query(`UPDATE clients SET t_code = ? WHERE c_status = 'Pending'AND phone_no = ?`,[response.data.CheckoutRequestID, phone_no]);

            if(next) next()
        }).catch((error)=>{
            console.log("Mpesa Error: ",error.message)
        })
    } catch (error) {
        const status = error.response?.status || 502;
        console.log('Mpesa error:', status, error.response?.data || error.message);
        res.status(status).json({ message: 'M-Pesa STK request failed', details: error.response?.data });
    }
    
};

module.exports = stkPush;