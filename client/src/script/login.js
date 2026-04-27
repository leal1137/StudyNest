/**
 * Hanterar inloggningsprocessen på klientsidan. Funktionen tar emot
 * användarens e-post och lösenord, skickar en autentiseringsförfrågan
 * till servern och sparar JWT-token lokalt vid framgång.
 *
 * @name login
 * @function
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ok: boolean, error?: string, username?: string}>}
 */
export async function login(email, password) {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    return { ok: false, error: data.error || 'Login failed' }
  }

  localStorage.setItem('token', data.token)

  const payload = JSON.parse(atob(data.token.split('.')[1]))
  localStorage.setItem('username', payload.username)

  return { ok: true, username: payload.username }
}
