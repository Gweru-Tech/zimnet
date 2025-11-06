module.exports = function keepAlive() {
    // Simple HTTP server to keep the bot alive
    const http = require('http');
    const server = http.createServer((req, res) => {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Bot is running\n');
    });
    
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Keep-alive server running on port ${port}`);
    });
    
    // Ping every 5 minutes to prevent idling
    setInterval(() => {
        http.get(`http://localhost:${port}`, () => {});
    }, 300000);
};
