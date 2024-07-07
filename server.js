const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for all routes

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'cii-calculator',
    port: 3306 // Make sure this is the correct port
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Route to fetch data
app.get('/data', (req, res) => {
    // Select specific columns from the 'ship' table
    // const sql = 'SELECT *' +
    //         'FROM ship';
    
    const sql = `SELECT rf.*, s.*
    FROM resistance_friction rf
    JOIN ship s ON rf.ship_ID = s.ship_ID
    WHERE rf.ship_ID = 1`;
    
    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            // Handle errors
            res.status(500).send(err.toString());
        } else {
            // Send JSON response with results
            res.json(results);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
