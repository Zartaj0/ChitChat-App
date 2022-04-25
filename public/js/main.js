const socket = io();
const chatform = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

const{username,room}= Qs.parse(location.search,{
  ignoreQueryPrefix:true
})

socket.emit('joinRoom', { username, room });

socket.on('roomUsers',({room,users})=>{
  outputRoomName(room)
  outputUsers(users)
})

socket.on('message',(data)=>{
output(data)

chatform.scrollTop = chatform.scrollHeight
})

document.getElementById('chat-form').addEventListener('submit',(e)=>{
  e.preventDefault()
socket.emit('chatMessage',e.target.elements.msg.value)

e.target.elements.msg.value = ''
e.target.elements.msg.focus()
})


function output(message) {
  const div =document.createElement('div');
  div.classList.add('message');
  div.innerHTML= `<p class="meta">${message.user} <span>${message.time}</span></p>
  <p class="text">
   ${message.message}
  </p>`
  document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room){
  roomName.innerText= room
}

function outputUsers (users) {
  userList.innerHTML =`
  ${users.map(user=> `<li>${user.username}</li>`).join('')}
  `
}