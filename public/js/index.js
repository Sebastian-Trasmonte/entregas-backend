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

    if (title && price && description && code && stock) {
        socket.emit("add-product", {
            title,
            price,
            description,
            code,
            stock
        });
    }else
        alert("All fields are required");
};

socket.on("product-added", (product) => {
    const productsContainer =document.getElementById('product-grid');
    const productDiv = document.createElement('div');
    productDiv.className = "product-card";
    productDiv.id = `productId${product.id}`;
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>ID: ${product.id}</p>
        <p>Precio: ${product.price}</p>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>En stock: ${product.stock}</p>
        <button class="delete-product" onclick="deleteProduct(${product.id})">Delete</button>
    `;
    productsContainer.appendChild(productDiv);
})