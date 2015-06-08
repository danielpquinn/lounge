document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  if (TOKEN.length > 0) { localStorage.setItem('token', TOKEN) }
  var token = localStorage.getItem('token')
  var socket = io.connect('http://localhost:3000')
  var $body = $('body')
  var $form = $('form')
  var $message = $form.find('input')
  var $messages = $('.messages')

  var signIn = function (data) {
    localStorage.setItem('token', data.token)
    token = data.token
  }

  var signOut = function () {
    localStorage.removeItem('token')
  }

  var scrollToBottom = function () {
    window.scroll(0, document.body.offsetHeight);
  }

  $form.on('submit', (e) => {
    var message = $message.val()
    e.preventDefault()
    if (!message) { return; }
    socket.emit('message', {
      token: token,
      text: $message.val()
    })
    $message.val('')
  })

  socket.on('command', data => {
    console.log(data);
    if (data.command === 'signin') { signIn(data) }
    if (data.command === 'signout') { signOut(data) }
    $messages.append(`<li class="info"><span class="message">${data.message}</span></li>`);
  })

  socket.on('warning', data => {
    $messages.append(`<li class="warning"><span class="message">${data}</span></li>`);
    scrollToBottom()
  })

  socket.on('message', data => {
    $messages.append(`<li><span class="username">${data.username || 'anonymous'}</span><span class="message">${data.text}</span></li>`);
    scrollToBottom()
  })

  $messages.prepend('<li><pre>' +
    ' __    __  _  _ __ _  ___ ____\n' +
    '(  )  /  \\/ )( (  ( \\/ __|  __)\n' +
    '/ (_/(  O ) \\/ (    ( (_ \\) _)\n' +
    '\\____/\\__/\\____|_)__)\\___(____)' +
    '</pre></li>')

  $message.focus()

  $body.on('click', () => { $message.focus() })

  scrollToBottom()
})