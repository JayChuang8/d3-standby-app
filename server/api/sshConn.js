const express = require('express');
const { Client } = require('ssh2');
const router = express.Router();


router.get('/', (req, res) => {
    console.log('Hello');
    const conn = new Client();
    conn.on('ready', () => {
        console.log('Client :: ready');
        conn.exec('ls -l', (err, stream) => {
          if (err) throw err;
          let output = '';
          stream.on('close', (code, signal) => {
            console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
            conn.end();
            res.send(output);
          }).on('data', (data) => {
            console.log('STDOUT: ' + data);
            output += data;
          }).stderr.on('data', (data) => {
            console.log('STDERR: ' + data);
            output += data;
          });
        });
      }).connect({
        host: '10.13.132.14',
        username: 'double',
        password: '15-003432'
      });
});

module.exports = router;