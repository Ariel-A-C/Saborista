async function registerUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        console.log('Data being sent:', JSON.stringify({ username, password }));

        const response = await fetch('/registerUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log(response);

        if (response.ok) {
            console.log('User registered successfully');
            alert('Usuario registrado correctamente');

            window.location.href = 'iniciar_sesion.html';

        } else {
            console.error('Failed to register user');
            alert('ERROR: el nombre de usuario ya está en uso');
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