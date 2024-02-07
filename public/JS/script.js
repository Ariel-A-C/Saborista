const userCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('user='));
if (userCookie) {
    document.getElementById('addRecipeLink').style.display = 'block';
    document.getElementById('profileLink').style.display = 'block';
    document.getElementById('loginLink').style.display = 'none';
}