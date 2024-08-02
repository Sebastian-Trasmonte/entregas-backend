function logout() {
    fetch("/api/session/logout", {
        method: "POST"
    }).then(() => {
        window.location.href = "/login";
    });
}