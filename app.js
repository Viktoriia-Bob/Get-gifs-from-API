const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    const fileData = path.join(__dirname, 'public', 'data.json');

    https.get('https://api.giphy.com/v1/gifs/search?api_key=qxca4nX05WkwV0lRFW4fS3Hya0M2nwQG&q=king&limit=10', (res) => {
        let body = "";
    
        res.on('data', (chunk) => {
            body += (chunk);
        });
    
        res.on('end', () => {
            const newBody = JSON.parse(body).data;
    
            newBody.sort((a, b) => a.rating < b.rating ? -1 : (a.rating > b.rating ? 1 : 0));
            try {
                fs.writeFile(fileData, JSON.stringify(newBody), err => {
                    if(err) throw err;
                });
            } catch (error) {
                console.error(error.message);
                console.log('error res.on(end)');
            }
        });
    }).on('error', (e) => {
        console.error(e);
        console.log('error get.on');
    });
    

    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js': 
            contentType = 'text/javascript';
            break;
        case '.css': 
            contentType = 'text/css';
            break;
        case '.json': 
            contentType = 'application/json';
            break;
        case '.png': 
            contentType = 'image/gif';
            break;
    }
  
    fs.readFile(filePath, (err, content) => {
        if(err) {
            if(err.code === 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                })
            } else {
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`)
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen((process.env.PORT || 5000), () => {
    console.log('Server running');
})
