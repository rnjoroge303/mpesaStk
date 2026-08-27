const express = require('express');
const router = express.Router();
const pool = require('../models/db')
const generateToken = require('./generateToken');
const stkPush = require('./stkPush');
const userData = require('./pay');

router.use(express.json());
router.use(express.urlencoded({extended: true}));


router.post('/client',userData,generateToken,stkPush, async(req,res,)=>{
    res.json({
        Message: "Stk sent",
        CheckoutRequestID: req.chck
    })
});
router.post('/callback',async (req,res)=>{
    const callback = req.body.Body.stkCallback;

    if(!callback){
        console.log("Data not Available")
    }else{
        console.log(callback)
    }
   
    if(callback.ResultCode === 1032 || callback.ResultCode === 1){
        await pool.query(`UPDATE clients SET c_status = 'Failed' WHERE t_code = ?`,[callback.CheckoutRequestID])
        res.json("ok")
        console.log("Database update successful")
    }else{
        console.log(callback.CallbackMetadata.Item[1].Value)
        await pool.query(`UPDATE clients SET c_status = 'Success', m_code = ? WHERE t_code = ? AND m_code IS NULL`, [callback.CallbackMetadata.Item[1].Value, callback.CheckoutRequestID])
    }
})
module.exports = router;