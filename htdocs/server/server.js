const http = require('http');
const fs = require('fs');

http.createServer(async (request, response) => {
    console.log(request.url)
    if(request.url === '/') {
        fs.readFile('../index.html', 'utf-8', (e, data) => {
            response.end(data);
        });

    } else if(request.url === '/register/') {
        const buffer = [];

        for await (const chunk of request) {
            buffer.push(chunk);
        }

        const data = Buffer.concat(buffer).toString();
        const dataObj = JSON.parse(data);
        const stringToWriteInFile = `${dataObj?.email} : Успешно принят, ${dataObj?.name}\n`;

        if(!fs.existsSync('data.txt')) {
            fs.writeFile('data.txt', stringToWriteInFile, (e) => {
                if(e) throw e;
            });
        } else {
            fs.appendFile('data.txt', stringToWriteInFile, (e) => {
                if(e) throw e;
            });
        }

    } else if (request.url.split('/').length > 2) {
        path = request.url.split('/')[1] === 'src' ? `../${request.url}` : `../src${request.url}`
        fs.readFile(path, (e, data) => {
            response.end(data);
        });

    } else {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        response.end("Page Not Found!");
    }

}).listen(3000, () => console.log("Сервер запущен по адресу http://localhost:3000"));
