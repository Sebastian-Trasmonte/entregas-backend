const socket = io();

function deleteProduct(id) {
    const userRole = document.getElementById('userRole').value;
    const userEmail = document.getElementById('userEmail').value;
    socket.emit("delete-product", {
        id,
        userRole,
        userEmail
    })
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
    const userRole = document.getElementById('userRole').value;
    const userEmail = document.getElementById('userEmail').value;

    if (title && price && description && code && stock && category) {
        socket.emit("add-product", {
            title,
            price,
            description,
            code,
            stock,
            category,
            userRole,
            userEmail
        });
    } else
        alert("All fields are required");
};

socket.on("product-added", (product) => {
    const productsContainer = document.getElementById('product-grid');
    const productDiv = document.createElement('div');
    productDiv.className = "product-card";
    productDiv.id = `productId${product._id}`;
    productDiv.innerHTML = `
        <h2>${product.title}</h2>
        <p>ID: ${product._id}</p>
        <p>Categoria: ${product.category}</p>
        <p>Precio: ${product.price}</p>
        <p>Descripción: ${product.description}</p>
        <p>Código: ${product.code}</p>
        <p>En stock: ${product.stock}</p>
        <button class="delete-product" onclick="deleteProduct('${product._id}')">Eliminar</button>
    `;
    productsContainer.appendChild(productDiv);
})

function addToCart(productId, cart, role, email) {
    const quantity = document.getElementById('stockToAdd').value
    socket.emit("add-to-cart", {
        productId,
        quantity,
        cart,
        role,
        email
    });
}

function add(stockMax) {
    const stockToAdd = document.getElementById('stockToAdd').value;
    const newStock = parseInt(stockToAdd) + 1;
    if (newStock <= stockMax)
        document.getElementById('stockToAdd').value = newStock;
}

function subtract() {
    const stockToAdd = document.getElementById('stockToAdd').value;
    const newStock = parseInt(stockToAdd) - 1;
    if (newStock >= 1)
        document.getElementById('stockToAdd').value = newStock;
}

socket.on("productAddedToCart", (productId) => {
    alert(`Producto ${productId} añadido al carrito`);
})

socket.on("error-occurred", (message) => {
    alert(message);
})

function goBack() {
    window.history.back();
}

function goToCart(idCart) {
    if (!idCart)
        alert("Todavía no se generó ningún carrito");
    else
        window.location.href = `/cart/${idCart}`;        
}