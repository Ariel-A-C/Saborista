const userCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
if (userCookie) {
    // If the user cookie exists, show the "Añadir Receta" link
    document.getElementById('addRecipeLink').style.display = 'flex';
    document.getElementById('profileLink').style.display = 'flex';
    // Hide the login and registration links
    document.getElementById('loginLink').style.display = 'none';
    document.getElementById('registerLink').style.display = 'none';
}