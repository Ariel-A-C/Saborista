fetch('http://localhost:3000/getRecipes')
    .then(response => response.json())
    .then(data => {
        const recipeContainer = document.getElementById('recipe-container');

        data.forEach(recipe => {
            const recipeElement = document.createElement('div');
            recipeElement.classList.add('recipe');

            console.log('Recipe ID:', recipe.customID); // Use customID instead of _id

            const recipeLink = document.createElement('a');
            const recipeUrl = `receta.html?id=${recipe.customID}`; // Use customID instead of _id
            console.log('Recipe URL:', recipeUrl);
            recipeLink.href = recipeUrl;

            const recipeImage = document.createElement('img');
            recipeImage.src = `../${recipe.Imagen}`; // Update image source
            recipeImage.alt = recipe.Nombre;
            recipeImage.width = 400;
            recipeImage.height = 300;

            const recipeName = document.createElement('p');
            recipeName.textContent = recipe.Nombre;

            const recipeRating = document.createElement('div');
            recipeRating.classList.add('rating');

            for (let i = 0; i < 5; i++) {
                const star = document.createElement('span');
                star.classList.add('star');
                star.innerHTML = '&#9733;'; // Filled star

                // Check if the current index is greater than or equal to the recipe's Valoración
                if (i >= recipe.Valoracion) {
                    star.innerHTML = '&#9734'; // Empty star
                }

                recipeRating.appendChild(star);
            }

            recipeLink.appendChild(recipeImage); // Wrap the image with the link
            recipeElement.appendChild(recipeLink);
            recipeElement.appendChild(recipeName);
            recipeElement.appendChild(recipeRating);

            recipeContainer.appendChild(recipeElement);
        });
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
        alert('Error fetching recipes. Please try again later.');
    });
