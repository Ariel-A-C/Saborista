console.log("test");

async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Registrando', username, password);
        console.log('Data being sent:', JSON.stringify({ name: username, password }));

        const response = await fetch('/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: username, password }), // Change 'username' to 'name'
        });

        console.log(response);

        if (response.ok) {
            console.log('User registered successfully');
            // Handle successful registration
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
    event.preventDefault(); // Prevent the default form submission
    registerUser();
});
