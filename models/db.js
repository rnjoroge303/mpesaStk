require('dotenv').config()
const db = require('mysql2/promise')


const pool = db.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 3,
    waitForConnections: true,
    queueLimit: 0 
});

async function createDatabase(){   
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS clients(
            package_name VARCHAR(20)NOT NULL,
            price INT NOT NULL,
            duration VARCHAR(20) NOT NULL,
            phone_no VARCHAR(15) NOT NULL,
            m_code VARCHAR(15),
            t_code VARCHAR(50),
            c_status VARCHAR(30) NOT NULL DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`
        );
        await pool.query(`CREATE EVENT DeletePending ON SCHEDULE EVERY 30 SECOND DO DELETE FROM clients WHERE c_status IN ('Pending', 'Failed')AND created_at <= NOW() - INTERVAL 2 MINUTE`)
        console.log('Table Created Success.')
    } catch (error) {
        console.log('Table created Unsussesful!', error.message)
    }
}

createDatabase();


async function testConnection() {
    try {
        await pool.getConnection(`SELECT 1 + 1 AS RESULTS`);
        console.log("Database Connected")
    } catch (error) {
        console.log('DataBase Error!')
    }
    
    
}
testConnection();

module.exports = pool;