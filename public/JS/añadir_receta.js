function agregarCampo(listaId) {
    var ul = document.getElementById(listaId);
    var li = document.createElement("li");
    var input = document.createElement("input");
    input.type = "text";
    input.name = listaId.includes("utensilios") ? "utensilio[]" : "ingrediente[]";
    input.required = true;
    li.appendChild(input);

    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete";
    deleteButton.onclick = function () {
        ul.removeChild(li);
    };
    li.appendChild(deleteButton);

    ul.appendChild(li);
}

function agregarPaso() {
    var ul = document.getElementById("pasosList");
    var li = document.createElement("li");

    var inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.name = "paso_nombre[]";
    inputNombre.required = true;

    li.appendChild(inputNombre);

    var deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.className = "delete";
    deleteButton.onclick = function () {
        ul.removeChild(li);
    };
    li.appendChild(deleteButton);

    ul.appendChild(li);
}

function eliminarCampo(button) {
    var li = button.parentNode;
    var ul = li.parentNode;
    ul.removeChild(li);
}

document.getElementById('recetaForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    console.log('Form submission initiated...'); // Debug message

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const utensilios = Array.from(document.getElementsByName('utensilio[]')).map(input => input.value);
    const ingredientes = Array.from(document.getElementsByName('ingrediente[]')).map(input => input.value);
    const pasos = Array.from(document.getElementsByName('paso_nombre[]')).map(input => input.value);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('customID', 'not_used');

    formData.append('utensilios', JSON.stringify(utensilios));
    formData.append('ingredientes', JSON.stringify(ingredientes));
    formData.append('pasos', JSON.stringify(pasos));

    const imageInput = document.getElementById('imagen');
    formData.append('imagen', imageInput.files[0], `public/uploads/${imageInput.files[0].name}`);

    try {
        console.log('Sending request to server...'); // Debug message
        const response = await fetch('http://localhost:3000/guardarReceta', {
            method: 'POST',
            headers: {
                'Authorization': document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='))
            },
            body: formData,
        });

        if (response.ok) {
            console.log('Receta guardada exitosamente'); // Debug message
            alert('Receta guardada exitosamente');
            window.location.href = 'recetas.html';
        } else {
            console.error('Error al guardar la receta'); // Error message
            alert('Error al guardar la receta');
        }
    } catch (err) {
        console.error('Error al guardar la receta:', err); // Error message
        alert('Error al guardar la receta. Verifique la conexión y vuelva a intentarlo.');
    }
});