// server.js
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'public')));

// 存儲已連接的使用者
const users = {};

// 處理 Socket.IO 連接
io.on('connection', (socket) => {
  console.log('一位使用者已連線：', socket.id);

  // 接收並設置使用者名稱
  socket.on('set username', (username) => {
    users[socket.id] = username;
    console.log(`使用者 ${socket.id} 設定名稱為：${username}`);
  });

  // 接收聊天訊息並廣播
  socket.on('chat message', (msg) => {
    const username = users[socket.id] || '匿名';
    io.emit('chat message', {
      msg: msg,
      username: username
    });
    console.log(`訊息來自 ${username}: ${msg}`);
  });

  // 處理使用者斷線
  socket.on('disconnect', () => {
    console.log('使用者已離線：', socket.id);
    delete users[socket.id];
  });
});

// 啟動伺服器
http.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器正在監聽 ${PORT} 埠口`);
});
