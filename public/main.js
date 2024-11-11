// public/main.js
$(function () {
  const socket = io();
  let username = '';

  // 顯示暱稱輸入模態框
  $('#username-modal').show();

  $('#username-submit').click(function () {
    const inputName = $('#username-input').val().trim();
    if (!inputName) {
      alert('請輸入您的名字');
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
    if (data.username === '機器人') {
      // 实现逐字显示效果
      const msgElement = $('<li>').css('position', 'relative');
      const usernameElement = $('<strong>').text(`${data.username}: `);
      const textElement = $('<span>');
      const timeElement = $('<span>').text(data.time).addClass('timestamp');

      msgElement.append(usernameElement).append(textElement).append(timeElement);
      msgElement.css('background-color', data.color);
      msgElement.css('border', '1px solid #000');

      $('#messages').append(msgElement);
      $('#messages').scrollTop($('#messages')[0].scrollHeight);

      // 逐字显示消息
      let index = 0;
      const message = data.msg;
      const typingInterval = setInterval(() => {
        textElement.text(textElement.text() + message.charAt(index));
        index++;
        if (index >= message.length) {
          clearInterval(typingInterval);
        }
        $('#messages').scrollTop($('#messages')[0].scrollHeight);
      }, 100); // 每个字符显示的间隔时间，单位毫秒
    } else {
      // 正常显示消息
      const msgElement = $('<li>').css('position', 'relative');
      const usernameElement = $('<strong>').text(`${data.username}: `);
      const textElement = $('<span>').text(data.msg);
      const timeElement = $('<span>').text(data.time).addClass('timestamp');

      msgElement.append(usernameElement).append(textElement).append(timeElement);
      msgElement.css('background-color', data.color);
      msgElement.css('border', '1px solid #000');

      $('#messages').append(msgElement);
      $('#messages').scrollTop($('#messages')[0].scrollHeight);
    }
  });

  // 處理聊天室已滿的情況
  socket.on('room full', function () {
    alert('聊天室已滿，請稍後再試。');
  });
});
