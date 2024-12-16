// public/main.js
$(function () {
  const socket = io();
  let username = '';
  let isTyping = false; // 標記是否正在顯示刪節號

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

  // 發送訊息
  $('form').submit(function (e) {
    e.preventDefault();
    const message = $('#message-input').val();
    if (message.trim().length > 0) {
      socket.emit('chat message', message);
      $('#message-input').val('');
      // 顯示「機器人」的動態刪節號
      showTypingIndicator();
    }
    return false;
  });

  // 接收訊息
  socket.on('chat message', function (data) {
    if (data.username === '機器人') {
      // 移除動態刪節號
      removeTypingIndicator();
      // 顯示「機器人」的訊息逐字出現
      appendRobotMessageWithTyping(data.msg);
    } else {
      // 如果其他使用者發送訊息（多使用者情境）
      appendUserMessage(data.msg);
    }
  });
  

  // 函數：顯示使用者的訊息
  function appendUserMessage(message) {
    const msgElement = $('<li>').addClass('right');
    const messageContent = $('<div>').addClass('message-content').text(message);
    msgElement.append(messageContent);
    $('#messages').append(msgElement);
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
    
  }

  // 函數：逐字顯示「機器人」的訊息
  function appendRobotMessageWithTyping(message) {
    const msgElement = $('<li>').addClass('left');
    const avatarElement = $('<img>').addClass('avatar').attr('src', 'images/robot-avatar.png').attr('alt', '機器人頭像');
    const messageContent = $('<div>').addClass('message-content');
    const container = $('<div>').addClass('message-container'); // 包裝頭像與訊息框
    container.append(avatarElement).append(messageContent);
    msgElement.append(container);
    $('#messages').append(msgElement);

    // 動態顯示每個字
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex < message.length) {
        messageContent.append(message[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval); // 顯示完成後清除定時器
        // 添加按鈕容器（僅在訊息完全顯示後添加）
        appendActionButtons(msgElement, message);
      }
      $('#messages').scrollTop($('#messages')[0].scrollHeight); // 滾動到底部
    }, 200); // 每個字出現的時間間隔（100毫秒）
  }

  // 函數：添加行動按鈕
  function appendActionButtons(msgElement, message) {
    const buttonContainer = $('<div>').addClass('button-container');

    // 創建複製按鈕
    const copyButton = $('<button>')
      .addClass('action-button')
      .attr('title', '複製')
      .html('<img src="images/copy.png" alt="複製按鈕" />');

    copyButton.click(function () {
      // 複製訊息文本到剪貼簿
      navigator.clipboard.writeText(message).then(() => {
        $(this).addClass('pressed');
        setTimeout(() => {
          $(this).removeClass('pressed');
        }, 200);
      }).catch(err => {
        console.error('複製失敗:', err);
      });
    });

    // 創建按讚按鈕
    const likeButton = $('<button>')
      .addClass('action-button')
      .attr('title', '按讚')
      .html('<img src="images/like.png" alt="按讚按鈕" />');

    likeButton.click(function () {
      $(this).addClass('pressed');
      setTimeout(() => {
        $(this).removeClass('pressed');
      }, 200);
    });

    // 創建倒讚按鈕
    const dislikeButton = $('<button>')
      .addClass('action-button')
      .attr('title', '倒讚')
      .html('<img src="images/dislike.png" alt="倒讚按鈕" />');

    dislikeButton.click(function () {
      $(this).addClass('pressed');
      setTimeout(() => {
        $(this).removeClass('pressed');
      }, 200);
    });

    // 創建更新按鈕
    const updateButton = $('<button>')
      .addClass('action-button')
      .attr('title', '更新')
      .html('<img src="images/update.png" alt="更新按鈕" />');

    updateButton.click(function () {
      $(this).addClass('pressed');
      setTimeout(() => {
        $(this).removeClass('pressed');
      }, 200);
    });

    // 將按鈕添加到按鈕容器
    buttonContainer.append(copyButton, likeButton, dislikeButton, updateButton);

    // 將按鈕容器添加到訊息元素的下方
    msgElement.append(buttonContainer);
  }

  // 函數：顯示動態刪節號
  function showTypingIndicator() {
    if (isTyping) return; // 如果已經在顯示，則不再添加
    isTyping = true;
    const typingElement = $('<li>').addClass('left typing');
    const avatarElement = $('<img>').addClass('avatar').attr('src', 'images/robot-avatar.png').attr('alt', '機器人頭像');
    const dotsElement = $('<span>').addClass('typing-dots').text('...');
    const container = $('<div>').addClass('message-container');
    container.append(avatarElement).append(dotsElement);
    typingElement.append(container);
    $('#messages').append(typingElement);
    $('#messages').scrollTop($('#messages')[0].scrollHeight);
  }

  // 函數：移除動態刪節號
  function removeTypingIndicator() {
    $('.left.typing').remove();
    isTyping = false;
  }
});
