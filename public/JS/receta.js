document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const recipeContainer = document.getElementById('recipe-container');

    fetch(`http://localhost:3000/getRecipe?id=${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Recipe not found');
            }
            return response.json();
        })
        .then(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            const recipeName = document.createElement('h1');
            recipeName.textContent = recipe.Nombre;

            const recipeImageContainer = document.createElement('div');
            recipeImageContainer.classList.add('image-container');

            const recipeImage = document.createElement('img');
            recipeImage.src = recipe.Imagen;
            recipeImage.alt = recipe.Nombre;
            recipeImage.width = 800;
            recipeImage.height = 600;

            const recipeDescription = document.createElement('p');
            recipeDescription.classList.add('section', 'descripcion');
            recipeDescription.textContent = recipe.Descripcion;

            const createSection = (title, content, className) => {
                const section = document.createElement('div');
                section.classList.add('section', className);

                const sectionTitle = document.createElement('h2');
                sectionTitle.textContent = title;

                section.appendChild(sectionTitle);
                section.appendChild(content);

                return section;
            };

            const recipeUtensilios = createSection('Utensilios', document.createElement('p'), 'utensilios');
            recipeUtensilios.querySelector('p').textContent = `${recipe.Utensilios.join(' - ')}`;

            const recipeIngredientes = createSection('Ingredientes', document.createElement('ul'), 'ingredientes');
            recipe.Ingredientes.forEach(ingrediente => {
                const ingredienteItem = document.createElement('li');
                ingredienteItem.textContent = ingrediente;
                recipeIngredientes.querySelector('ul').appendChild(ingredienteItem);
            });

            const recipePasos = createSection('Pasos', document.createElement('ol'), 'pasos');
            recipe.Pasos.forEach((paso) => {
                const pasoItem = document.createElement('li');
                pasoItem.textContent = `${paso}`;
                recipePasos.querySelector('ol').appendChild(pasoItem);
            });

            recipeImageContainer.appendChild(recipeImage);
            recipeElement.appendChild(recipeName);
            recipeElement.appendChild(recipeImageContainer);
            recipeElement.appendChild(recipeDescription);
            recipeElement.appendChild(recipeUtensilios);
            recipeElement.appendChild(recipeIngredientes);
            recipeElement.appendChild(recipePasos);

            recipeContainer.appendChild(recipeElement);
        })
        .catch(error => {
            console.error('Error fetching recipe details:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = 'Error fetching recipe details. Please try again later.';
            recipeContainer.appendChild(errorMessage);
        });
});


fetch('http://localhost:3000/getComments')
    .then(response => response.json())
    .then(data => {
        const commentsContainer = document.getElementById('comments-container');
        const recipeId = getRecipeId(); // Obtener el recipeId

        data.forEach(comment => {
            if (comment.recipeID === recipeId) { // Filtrar comentarios por recipeID
                const commentText = document.createElement('p');
                commentText.textContent = '(' + comment.date + ') ' + comment.username + ': ' + comment.text;
                commentsContainer.appendChild(commentText);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching comments:', error);
        alert('Error fetching comments. Please try again later.');
    });

document.getElementById('comment-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const recipeId = getRecipeId();
    const commentInput = document.getElementById('comment');
    const text = commentInput.value;
    const date = getDate();

    const commentData = {
        recipeID: recipeId,
        text: text,
        date: date
    };

    try {
        const response = await fetch('http://localhost:3000/saveComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='))
            },
            body: JSON.stringify(commentData),
        });

        if (response.ok) {
            console.log('Comentario guardado exitosamente');
            commentInput.value = "";
        } else {
            console.error('Error al guardar el comentario');
        }
    } catch (err) {
        console.error('Error al guardar el comentario:', err);
    }
});

function getDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const time = hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm;

    return `${day}/${month}/${year} - ${time}`;
}

function getRecipeId() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    const numeroRecipeId = parseInt(recipeId);

    if (!isNaN(numeroRecipeId)) {
        return numeroRecipeId;
    } else {
        console.error("Error");
        return null;
    }
}

const ws = new WebSocket('ws://localhost:3000');

function addMessage(comment, fecha) {
    let newMsgDiv = document.createElement("div");
    newMsgDiv.innerHTML = `<span>(${fecha}):</span> ${comment}`;

    let msgs = document.getElementById("comments-container");
    msgs.appendChild(newMsgDiv);
}

ws.onmessage = (event) => {
    const datos = JSON.parse(event.data);
    addMessage(datos.comment, datos.date);
    const chatIndex = chats.findIndex(chat => chat.nombre === datos.chat);
    chats[chatIndex].mensajes.push({
        comment: datos.comment,
        date: datos.date
    });
};

function enviarMensaje() {
    const commentInput = document.getElementById("comment");
    const comment = commentInput.value;

    if (comment.trim() !== "") {
        const date = getDate();
        const commentObj = {
            comment: comment,
            date: date,
        };
        ws.send(JSON.stringify(commentObj));
        addMessage(comment, date);
    }
}