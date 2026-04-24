async function signup() {
      const email = document.getElementById('email').value;
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        document.getElementById('error').innerText = data.error;
        return;
      }

      document.getElementById('error').style.color = 'green';
      document.getElementById('error').innerText = "Account created! You can now log in.";
    }