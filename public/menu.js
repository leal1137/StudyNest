async function loadMenu() {
  const res = await fetch('/menu.html');
  const html = await res.text();

  const container = document.getElementById('menu-container');
  container.innerHTML = html;

  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (token && username) {
    const nav = container.querySelector('nav'); // 🔥 HÄR

    nav.innerHTML += `
    <span style="color:white; margin-left:20px;">
        Logged in as: <b>${username}</b>
    </span>
    <button id="logout-btn" style="margin-left:10px;">Logout</button>
    `;

    const logoutBtn = nav.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.href = '/login.html';
    });
  }
}

loadMenu();