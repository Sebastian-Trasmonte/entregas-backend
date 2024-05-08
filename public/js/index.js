const socket = io();

function deleteProduct(id) {
    socket.emit("delete-product", id)
}

socket.on("product-deleted", (id) => {
    const product = document.getElementById(`productId${id}`);
    product.remove();
})

function addProduct() {
    const title = document.getElementById('productTitle').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const code = document.getElementById('productCode').value;
    const stock = document.getElementById('productStock').value;
    const category = document.getElementById('productCategory').value;

    if (title && price && description && code && stock && category) {
        socket.emit("add-product", {
            title,
            price,
            description,
            code,
            stock,
            category
        });
    }else
        alert("All fields are required");
};

socket.on("product-added", (product) => {
    const productsContainer =document.getElementById('product-grid');
    const productDiv = document.createElement('div');
    productDiv.className = "product-card";
    productDiv.id = `productId${product._id}`;
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>ID: ${product._id}</p>
        <p>Precio: ${product.price}</p>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>En stock: ${product.stock}</p>
        <button class="delete-product" onclick="deleteProduct(${product._id})">Delete</button>
    `;
    productsContainer.appendChild(productDiv);
})

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

function logout(){
    fetch("/api/session/logout", {
        method: "POST"
    }).then(() => {
        window.location.href = "/login";
    });
}