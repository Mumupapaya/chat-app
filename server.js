// server.js
const express = require('express');
const path = require('path'); // 引入 path 模組
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// 設置靜態文件目錄
app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // 存儲已連接的使用者

io.on('connection', (socket) => {
  // 檢查當前連接的使用者數量
  const userCount = Object.keys(users).length;

  if (userCount >= 2) {
    // 發送訊息給客戶端，告知聊天室已滿
    socket.emit('room full');
    socket.disconnect();
    return;
  }

  console.log('一位使用者已連線：', socket.id);

  // 等待接收使用者暱稱
  socket.on('set username', (username) => {
    users[socket.id] = {
      username: username,
    };

    console.log('使用者已連線：', users[socket.id]);
  });

  socket.on('chat message', (msg) => {
    if (users[socket.id]) {
      const user = users[socket.id];
      io.emit('chat message', {
        msg: msg,
        username: user.username,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('使用者已離線：', socket.id);
    delete users[socket.id];
  });
});

// 確保伺服器監聽所有網絡接口，適用於 Render
http.listen(PORT, '0.0.0.0', () => {
  console.log(`伺服器正在監聽 ${PORT} 埠口`);
});
