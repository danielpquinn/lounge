document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  if (TOKEN.length > 0) { localStorage.setItem('token', TOKEN) }
  var inputHistory = ['']
  var inputHistoryIndex = 0
  var inputHistoryLength = 50
  var token = localStorage.getItem('token')
  var socket = io.connect('http://' + IP + ':' + PORT)
  var $body = $('body')
  var $form = $('form')
  var $message = $form.find('input')
  var $messages = $('.messages')

  // Save token in localstorage

  var signIn = function (data) {
    localStorage.setItem('token', data.token)
    token = data.token
  }

  // Remove token from localstorage

  var signOut = function () {
    localStorage.removeItem('token')
  }

  // Scroll to the bottom of the window

  var scrollToBottom = function () {
    window.scroll(0, document.body.offsetHeight);
  }

  // Move back one item in inputHistory
  
  var inputHistoryUp = function () {
    if (inputHistoryIndex < inputHistory.length) {
      inputHistoryIndex += 1
    }
    $message.val(inputHistory[inputHistoryIndex])
  }

  // Move forward one item in inputHistory
  
  var inputHistoryDown = function () {
    if (inputHistoryIndex > 0) {
      inputHistoryIndex -= 1
    }
    $message.val(inputHistory[inputHistoryIndex])
  }

  // Handle keyboard events
  
  document.addEventListener('keyup', e => {
    switch (e.keyCode) {
      case 38:
      e.preventDefault()
      inputHistoryUp()
      break
      case 40:
      e.preventDefault()
      inputHistoryDown()
      break
    }
  })

  // Grab user input and send it to the server

  $form.on('submit', (e) => {
    var message = $message.val()

    // Prevent default behavior

    e.preventDefault()

    // Return if no message

    if (!message) { return; }

    // Send message to server via socket

    socket.emit('message', {
      token: token,
      text: message
    })

    // Add message to inputHistory

    inputHistory.unshift(message)

    // Don't allow more than x entries in inputHistory

    if (inputHistory.length > inputHistoryLength) { inputHistory.pop() }

    // Set inputHistory index back to zero
    
    console.log('setting back to zero for some reason')
    
    inputHistoryIndex = 0;

    $message.val('')
  })

  // Decide what to do with a command

  socket.on('command', data => {
    if (data.command === 'removelastmessage') { $('#' + data._id).remove(); }
    if (data.command === 'signin') { signIn(data) }
    if (data.command === 'signout') { signOut(data) }

    // If there's no text, don't show a message

    if (!data.text) { return }

    // Append message to list

    $messages.append(`<li class="info"><span class="message">${data.text}</span></li>`);

    scrollToBottom()
  })

  // Show user a warning

  socket.on('warning', data => {
    $messages.append(`<li class="warning"><span class="message">${data}</span></li>`);
    scrollToBottom()
  })

  // Add message from another user

  socket.on('message', data => {
    $messages.append(`<li id="${data._id}"><span class="username">${data.username || 'anonymous'}</span><span class="message">${data.text}</span></li>`);
    scrollToBottom()
  })

  // Print out a banner

  $messages.prepend('<li><pre>' +
    ' __    __  _  _ __ _  ___ ____\n' +
    '(  )  /  \\/ )( (  ( \\/ __|  __)\n' +
    '/ (_/(  O ) \\/ (    ( (_ \\) _)\n' +
    '\\____/\\__/\\____|_)__)\\___(____)' +
    '</pre></li>')

  // Focus on the input

  $message.focus()

  // Focus on click

  $body.on('click', () => { $message.focus() })

  // Start off by scrolling to the bottom of the screen

  scrollToBottom()
})