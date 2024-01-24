console.log("test");
async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Registrando', username, password);
        const response = await fetch('/getUsuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        console.log(response);
        if (response.ok) {
            console.log('User registered successfully');
            // Handle successfull registration
        } else {
            console.error('Failed to register user');
            // Handle registration failure, show an error message, etc.
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('registrationForm').addEventListener('submit', function (event) {
    console.log('Registration');
    registerUser();
    event.preventDefault(); // Prevent the default form submission
});
