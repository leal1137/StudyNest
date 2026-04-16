import { Navigate, redirect } from "react-router-dom";

//login.js
if (localStorage.getItem('token')) {
    //window.location.href = '/index.html';
  }


/**
 * Hanterar inloggningsprocessen på klientsidan. Funktionen hämtar 
 * användarens e-post och lösenord direkt från webbsidans inmatningsfält 
 * och skickar en autentiseringsförfrågan till servern. Vid framgång 
 * sparas en behörighetstoken lokalt i webbläsaren och användaren 
 * skickas vidare till huvudsidan. Vid fel visas ett felmeddelande på sidan.
 *
 * @name login
 * @function.
 */
export async function login() {
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

      const payload = JSON.parse(atob(data.token.split('.')[1]));
      localStorage.setItem('username', payload.username);

      // Redirect to main app
      redirect('/');
    }