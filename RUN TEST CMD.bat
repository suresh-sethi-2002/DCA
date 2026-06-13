B:
cd B:\DCA\1_DCA
node -e "require('http').createServer((req,res)=>{const fs=require('fs'),path=require('path');let p=path.join(process.cwd(),req.url==='/'?'index.html':decodeURIComponent(req.url));fs.readFile(p,(e,d)=>{res.writeHead(e?404:200);res.end(e?'Not found':d)})}).listen(8000)"