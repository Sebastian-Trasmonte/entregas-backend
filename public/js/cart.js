function purchase(cartId) {
    fetch(`/api/cart/${cartId}/purchase/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'completed'
        })
    }).then(response => {
        if (response.ok) {
            window.location.href = '/products';
        }
    });
}