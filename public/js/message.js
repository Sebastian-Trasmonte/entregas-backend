const socket = io();

let user;
let chatBox = document.querySelector("#chatBox");
let messagesLogs = document.querySelector("#messagesLogs");

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para ingresar al chat",
    inputValidator: (value) => {
        return !value && "¡Necesitas identificarte para continuar!";
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value;
    socket.emit("userConnect", user);
});

chatBox.addEventListener("keypress", e => {
    if (e.key == "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit("message", {
                user,
                message: chatBox.value
            });

            chatBox.value = "";
        }
    }
});

socket.on("messagesLogs", data => {
    let messages = "";

    data.forEach(chat => {
        messages += `${chat.user}: ${chat.message} </br>`;
    });

    messagesLogs.innerHTML = messages;
});

socket.on("newUser", data => {
    Swal.fire({
        text: `${data} se ha unido al chat`,
        toast: true,
        position: "top-right"
    })
})
