import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import "./Header.css";

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <>
      <header>
        <h1 className="text-style">
          My Dictionary
          <span style={{ color: "#89CFF0" }}>.</span>
        </h1>
        <div className={`App ${darkMode ? "dark" : "light"}`}>
          <button
            style={{ marginRight: "1rem" }}
            className="toggle-container"
            onClick={toggleDarkMode}
          >
            {darkMode ? <IconSun /> : <IconMoon />}
            <label htmlFor="Light and Dark mode toggle ">
              {darkMode ? "Light" : "Dark"}
            </label>
          </button>
        </div>
      </header>
      <hr className="hr-style" />
    </>
  );
}

export default Header;
