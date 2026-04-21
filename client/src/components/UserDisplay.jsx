import { useEffect, useState } from "react";

export default function UserDisplay() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLogin = () => {
      const storedUser = localStorage.getItem("username");
      const token = localStorage.getItem("token");
      if (storedUser && token) {
        setUsername(storedUser);
      } else {
        setUsername("");
      }
    };

    // Check on mount
    checkLogin();

    // Listen for login events from the same tab
    window.addEventListener("userLoggedIn", checkLogin);
    window.addEventListener("storage", checkLogin); // For multi-tab support

    return () => {
      window.removeEventListener("userLoggedIn", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  if (!username) return null;

  return (
    <div className="UserDisplay">
      Logged in as: {username}
    </div>
  );
}

