export async function login({ email, password }) {
  const apiUrl = import.meta.env.VITE_API_URL || '';

  console.log("Sending login request to:", `${apiUrl}/auth/login`);
  console.log("Data:", { email, password });

  try {
    const res = await fetch(`/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('string-result', JSON.stringify(res));
    const data = await res.json();

    console.log("Response ok:", res.ok);
    console.log("Response data:", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.error || 'Invalid email or password'
      };
    }

    localStorage.setItem('token', data.token);

    const payload = JSON.parse(atob(data.token.split('.')[1]));
    localStorage.setItem('username', payload.username);

    // Dispatch custom event to notify components of login
    window.dispatchEvent(new Event('userLoggedIn'));

    return {
      success: true
    };

  } catch (err) {
    return {
      success: false,
      message: 'Network error. Please try again.'
    };
  }
}