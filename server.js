// server.js
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const users = {}; // 存储已连接的用户

io.on('connection', (socket) => {
  // 检查当前连接的用户数量
  const userCount = Object.keys(users).length;

  if (userCount >= 2) {
    // 发送消息给客户端，告知聊天室已满
    socket.emit('room full');
    socket.disconnect();
    return;
  }

  console.log('一位使用者已連線：', socket.id);

  // 等待接收使用者暱稱
  socket.on('set username', (username) => {
    users[socket.id] = {
      username: username,
      color: '', // 颜色稍后分配
    };

    // 为用户分配固定的颜色
    if (Object.keys(users).length === 1) {
      users[socket.id].color = '#FFE6EA'; // 更淡的粉紅色
    } else {
      users[socket.id].color = '#F5F5DC'; // 米白色
    }

    console.log('使用者已連線：', users[socket.id]);
  });

  socket.on('chat message', (msg) => {
    if (users[socket.id]) {
      const user = users[socket.id];
      const timestamp = new Date().toLocaleTimeString('zh-TW', { hour12: false });
      io.emit('chat message', {
        msg: msg,
        username: user.username,
        color: user.color,
        time: timestamp,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('使用者已離線：', socket.id);
    delete users[socket.id];
  });
});

http.listen(PORT, () => {
  console.log(`伺服器正在監聽 ${PORT} 埠口`);
});
