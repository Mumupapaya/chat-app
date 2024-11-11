// public/main.js
$(function () {
  const socket = io();
  let username = '';

  // 顯示暱稱輸入模態框
  $('#username-modal').show();

  $('#username-submit').click(function () {
    const inputName = $('#username-input').val().trim();
    if (!inputName) {
      alert('請輸入您的暱稱');
      return;
    }
    username = inputName;
    socket.emit('set username', username);
    $('#username-modal').hide();
  });

  $('form').submit(function (e) {
    e.preventDefault();
    const message = $('#message-input').val();
    if (message.trim().length > 0) {
      socket.emit('chat message', message);
      $('#message-input').val('');
    }
    return false;
  });

  socket.on('chat message', function (data) {
    const msgElement = $('<li>');
    const usernameElement = $('<strong>').text(`${data.username}: `);
    const textElement = $('<span>'); // 初始化時不設置文字

    msgElement.append(usernameElement).append(textElement);

    // 判斷訊息是否由當前使用者發送
    if (data.username === username) {
      msgElement.addClass('right'); // 自己的訊息靠右
    } else {
      msgElement.addClass('left'); // 對方的訊息靠左
    }

    // 訊息框樣式
    msgElement.css({
      'background-color': '#FFFFFF', // 白色背景
      'border': '1px solid #000', // 黑色邊框
      'border-radius': '8px',
      'padding': '12px',
      'margin-bottom': '15px',
      'max-width': '60%',
      'word-wrap': 'break-word',
    });

    if (data.username === '機器人') {
      // 實現逐字顯示效果
      $('#messages').append(msgElement);
      $('#messages').scrollTop($('#messages')[0].scrollHeight);

      let index = 0;
      const message = data.msg;
      const typingInterval = setInterval(() => {
        textElement.text(textElement.text() + message.charAt(index));
        index++;
        if (index >= message.length) {
          clearInterval(typingInterval);
        }
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
      }, 200); // 每個字符顯示的間隔時間，單位毫秒
    } else {
      // 正常顯示訊息
      textElement.text(data.msg);
      $('#messages').append(msgElement);
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }
  });

  // 處理聊天室已滿的情況
  socket.on('room full', function () {
    alert('聊天室已滿，請稍後再試。');
  });
});
