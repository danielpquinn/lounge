document.addEventListener('DOMContentLoaded', () => {
  var socket = io.connect('http://localhost:3000')
  var $body = $('body')
  var $form = $('form')
  var $message = $form.find('input')
  var $messages = $('.messages')

  $form.on('submit', (e) => {
    var message = $message.val()
    e.preventDefault()
    if (!message) { return; }
    socket.emit('message', { message: $message.val() })
    $message.val('')
  })

  socket.on('message', data => {
    $messages.append(`<li><span class="username">${data.username}</span><span class="message">${data.text}</span></li>`);
  })

  $messages.prepend('<li><pre>' +
    ' __    __  _  _ __ _  ___ ____\n' +
    '(  )  /  \\/ )( (  ( \\/ __|  __)\n' +
    '/ (_/(  O ) \\/ (    ( (_ \\) _)\n' +
    '\\____/\\__/\\____|_)__)\\___(____)' +
    '</pre></li>')

  $message.focus()

  $body.on('click', () => { $message.focus() })
})