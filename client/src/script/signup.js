export async function signup({ email, username, password }) {
  const apiUrl = import.meta.env.VITE_API_URL || '';

  console.log("Sending sign up request to:", `${apiUrl}/auth/signup`);
  console.log("Data:", { email, username, password });

  try {
    const res = await fetch(`/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    });

    const data = await res.json();

    console.log("Response ok:", res.ok);
    console.log("Response data:", data);

    if (!res.ok) {
      return {
        success: false,
        message: data.error || 'Signup failed'
      };
    }

    // Dispatch custom event to notify components of signup success (e.g. to show a success message or redirect)
    window.dispatchEvent(new Event('signupSuccess'));

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