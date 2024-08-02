function modifyRole(id) {
    fetch(`/api/users/premium/${id}`, {
        method: "GET"
    }).then((response)=> response.json())
    .then((data) => {
        if (data.status == "success") {
            alert("Rol actualizado");    
            var userUpdated = document.getElementById(`userId${id}`); 
            userUpdated.querySelector("#rol").innerHTML = `Rol: ${data.data}`;
        }else {
            alert("El usuario no tiene documentos");
        }
    }).catch((e) => {
        alert(e.message);
    });
}

function deleteUser(id) {
    fetch(`/api/users/${id}`, {
        method: "DELETE"
    }).then((data) => {
        if (data.status == 200) {
            alert("Usuario eliminado");
            var userDeleted = document.getElementById(`userId${id}`);
            userDeleted.remove();
        } else {
            alert("Error al eliminar el usuario");
        }
    }).catch((e) => {
        alert(e.message);
    });
}