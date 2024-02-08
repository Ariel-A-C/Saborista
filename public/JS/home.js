// home.js

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/getRecipes')
        .then(response => response.json())
        .then(data => {
            // Select 4 random recipes
            const randomRecipes = getRandomRecipes(data, 4);

            // Determine the recipe with the highest rating
            const recipeOfTheDay = getRecipeOfTheDay(randomRecipes);

            // Display Recipe of the Day
            displayRecipeOfTheDay(recipeOfTheDay);

            // Display the other recipes
            displayOtherRecipes(randomRecipes.filter(recipe => recipe !== recipeOfTheDay));
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            alert('Error fetching recipes. Please try again later.');
        });
});

// Function to select n random recipes
function getRandomRecipes(recipes, n) {
    const shuffled = recipes.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

// Function to determine the recipe with the highest rating
function getRecipeOfTheDay(recipes) {
    return recipes.reduce((prev, current) => (prev.Valoracion > current.Valoracion) ? prev : current);
}

// Function to display Recipe of the Day
function displayRecipeOfTheDay(recipe) {
    const recipeOfTheDayContainer = document.querySelector('.recipe-of-the-day');
    const recipeLink = document.createElement('a');
    recipeLink.href = `receta.html?id=${recipe.customID}`;
    recipeOfTheDayContainer.appendChild(recipeLink);

    const recipeImage = document.createElement('img');
    recipeImage.src = recipe.Imagen;
    recipeImage.alt = recipe.Nombre;
    recipeLink.appendChild(recipeImage);

    const recipeName = document.createElement('p');
    recipeName.classList.add('recipe-name');
    recipeName.textContent = recipe.Nombre;
    recipeOfTheDayContainer.appendChild(recipeName);

    const recipeRating = document.createElement('div');
    recipeRating.classList.add('rating');
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        star.innerHTML = (i < recipe.Valoracion) ? '&#9733;' : '&#9734;';
        recipeRating.appendChild(star);
    }
    recipeOfTheDayContainer.appendChild(recipeRating);
}

// Function to display the other recipes
function displayOtherRecipes(recipes) {
    const recipeRowContainer = document.querySelector('.recipe-row');
    recipes.forEach(recipe => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('recipe');

        const recipeLink = document.createElement('a');
        recipeLink.href = `receta.html?id=${recipe.customID}`;
        recipeContainer.appendChild(recipeLink);

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.Imagen;
        recipeImage.alt = recipe.Nombre;
        recipeLink.appendChild(recipeImage);

        const recipeName = document.createElement('p');
        recipeName.classList.add('recipe-name');
        recipeName.textContent = recipe.Nombre;
        recipeContainer.appendChild(recipeName);

        const recipeRating = document.createElement('div');
        recipeRating.classList.add('rating');
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.innerHTML = (i < recipe.Valoracion) ? '&#9733;' : '&#9734;';
            recipeRating.appendChild(star);
        }
        recipeContainer.appendChild(recipeRating);

        recipeRowContainer.appendChild(recipeContainer);
    });
}