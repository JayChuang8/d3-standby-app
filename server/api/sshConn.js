const express = require('express');
const { Client } = require('ssh2');
const router = express.Router();


router.get('/', (req, res) => {

    const conn = new Client();
    console.log("Before connection")
    conn.on('ready', () => {
        conn.exec('ls -l', (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
        }).on('data', (data) => {
            console.log('STDOUT: ' + data);
            res.send(data);
        }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
        });
        });
    }).connect({
        host: '10.13.132.14',
        username: 'double',
        password: '15-003432'
    });
    console.log("After connection")
});

module.exports = router;