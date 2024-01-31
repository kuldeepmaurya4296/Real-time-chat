let name;

do {
  name = prompt("Enter Your Nick Name ")
} while (!name)


var typing = document.querySelector(".typing");
var button = document.querySelector("button");
var messageArea = document.querySelector('.messages')


const socket = io();
button.addEventListener("click", function (evt) {
  evt.preventDefault()
  socket.emit("msg", typing.value)
})

typing.addEventListener("keyup", function (e) {
  if (e.key === 'Enter') {
    sendMessage(e.target.value)
  }
})

function sendMessage(message) {
  let msg = {
    user: name,
    message: message
  }
  appendMessage(msg, 'outgoing')
  typing.value = ''
  ScrolltoBottom()

  socket.emit('message', msg)
}

function appendMessage(msg, type) {
  let mainDiv = document.createElement('div')
  let classname = type
  mainDiv.classList.add(classname, 'message')


  let markup = `
  <font align="right">
      <h1><mark>${msg.user}</mark></h1>
      <p>${msg.message} </p>
      </font>
      `

  mainDiv.innerHTML = markup
  messageArea.appendChild(mainDiv)

}

socket.on('message', function (data) {
  appendMessage(data, 'incoming')
  ScrolltoBottom()
})

function ScrolltoBottom() {
  messageArea.scrollTop = messageArea.scrollHeight
}


socket.on("online",function(data){
  document.querySelector("#online").textContent = data
})