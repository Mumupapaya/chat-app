const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`服务器正在监听 ${PORT} 端口`);
});

console.log('服务器脚本开始运行');
process.on('uncaughtException', function (err) {
    console.error('未捕获的异常：', err);
  });
  
  process.on('unhandledRejection', function (reason, p) {
    console.error('未处理的拒绝：', reason);
  });
  

const express = require('express');
console.log('已导入 express');

const app = express();
console.log('已创建 express 应用');

const http = require('http').createServer(app);
console.log('已创建 http 服务器');

const io = require('socket.io')(http);
console.log('已导入 socket.io');

app.use(express.static(__dirname + '/public'));
console.log('已设置静态文件夹');

io.on('connection', (socket) => {
  console.log('一个用户连接了');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('用户已断开连接');
  });
});

http.listen(3000, () => {
  console.log('服务器正在监听 3000 端口');
});
