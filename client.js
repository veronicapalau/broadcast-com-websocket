const socket = new WebSocket("ws://localhost:3000");

socket.onopen = function () {
  console.log("Conectado ao servidor");
};

socket.onmessage = function (event) {
  const message = JSON.parse(event.data);
  const li = document.createElement("li");
  li.textContent = message.text;
  document.getElementById("messages").appendChild(li);
};

socket.onclose = function () {
  console.log("Desconectado do servidor");
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("send").addEventListener("click", function () {
    const input = document.getElementById("message");
    const message = {
      text: input.value,
    };
    socket.send(JSON.stringify(message));
    input.value = "";
  });
});
