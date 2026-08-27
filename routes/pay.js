const express = require('express');
const pool = require('../models/db')

async function userData(req,res,next) {
    phone_no = '254'+req.body.phone.substring(1);
    amount = req.body.amount;
    const package_name = req.body.package;
    const duration = req.body.duration;
    
    pool.query(`DELETE FROM clients WHERE phone_no = ? AND c_status IN ('Pending', 'Failed')`,[phone_no]);
    console.log('Deleteed')
    try {
        await pool.query(`INSERT INTO clients(package_name,price,duration,phone_no) VALUES (?,?,?,?)`,[package,amount,duration,phone_no])
        console.log('Data inserted');

        if(next)next();
    } catch (error) {
        console.log('Failed to insert:', error.message)
    }
};


module.exports = userData;
