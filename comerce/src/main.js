import io from 'socket.io-client';
const SERVER_URL = 'http://localhost:8080'



const socket = io(SERVER_URL);
socket.on('connect', () => {
    const session = localStorage.getItem('sessionId');

    if(localStorage.getItem('sessionId') != undefined){
         socket.emit('session-connect',session)
    }
});
socket.on('session', (msg) => {
    localStorage.setItem('sessionId', msg)
})


const amountInput = document.getElementById('amount')

const btnSender = document.getElementById("sendAmount");
btnSender.addEventListener("click", async  function () {
    const amount = parseInt(amountInput.value);
    const session = localStorage.getItem('sessionId');
    const res =  { amount: amount, sessionId: session, serviceType: "", userLogin: "" }
    const response = await fetch(`${SERVER_URL}/qiwi/pay`, { method: 'POST',headers:{ 'Content-Type': 'application/json'}, body:JSON.stringify(res) })
    let result = await response.json();
    console.log(result);
});