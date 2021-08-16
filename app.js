// const WebSocketServer = new require('ws');

const url = 'wss://fep-app.herokuapp.com/';
const username = document.getElementById('username');
const form = document.getElementById('form');
const msgEl = document.getElementById('messages');
const msgSend = document.getElementById('messageSend');
const subscribe = document.getElementById('subscribe');

form.addEventListener('submit', onSend);

let socket = null;
function initConnection(){
  socket = new WebSocket(url);  

  socket.onopen = () => {
    console.log('connected');    
  }

  socket.onmessage = (msg) => {
    console.log(msg.data);
    if (!msg || !msg.data) {
      return;
    }

    const data = JSON.parse(msg.data);    
    showMessage(data);
  }
  
  
  socket.onclose = () => {
    initConnection();
    console.log('connection closed');
  }

socket.onerror = (err) => {
   console.log('disconnected')
}
}

function send(msg) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}

function showMessage(data) {
  const chat = document.createElement('div');
  const user = createUser(data.payload.username);  
  const userMsg = createUserMsg(data.payload.message);
  chat.appendChild(user);
  chat.appendChild(userMsg);
  subscribe.appendChild(chat);
  msgEl.value = '';
}
initConnection();



function onSend(e) {
  e.preventDefault();
   send({
    type: 'message',
    payload: {
      username: username.value,
      message: msgEl.value,
    },
  },);
}

function createUser(username) {
  const user = document.createElement('p')
  user.innerHTML = `${username}`;
  return user;
}

function createUserMsg(message) {
  const userMsg = document.createElement('p');
  userMsg.innerHTML = message;
  return userMsg;
}