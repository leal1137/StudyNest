if (localStorage.getItem('token')) {
    window.location.href = '/index.html';
  }

async function login() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        document.getElementById('error').innerText = data.error;
        return;
      }

      // Save token
      localStorage.setItem('token', data.token);

      // Redirect to main app
      window.location.href = '/index.html';
    }