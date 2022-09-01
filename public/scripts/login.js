async function loginHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#email-login').value.trim();
    const pw = document.querySelector('#password-login').value.trim();

    if (email && pw) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

async function signUpHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const pw = document.querySelector('#password-signup').value.trim();

    if (username && email && pw) {
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                pw
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            console.log('good to go!');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginHandler);
document.querySelector('.signup-form').addEventListener('submit', signUpHandler);