import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import Landingpage from "./pages/Landingpage";

function App() {
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
    <div className="container">
      <div className={`App ${darkMode ? "dark" : "light"}`}>
        <button className="toggle-container" onClick={toggleDarkMode}>
          {darkMode ? <IconMoon /> : <IconSun />}
          <label htmlFor="Light : Dark ">{darkMode ? "Dark" : "Light"}</label>
        </button>
        <Landingpage />
      </div>
    </div>
  );
}

export default App;
