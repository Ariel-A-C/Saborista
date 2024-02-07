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
            recipeUtensilios.querySelector('p').textContent = `Utensilios: ${recipe.Utensilios.join(', ')}`;

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
