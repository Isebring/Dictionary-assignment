import { IconMoon, IconSun } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import './Header.css';

function Header() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <>
      <header>
        <div className={`App ${darkMode ? 'dark' : 'light'}`}>
          <button className="toggle-container" onClick={toggleDarkMode}>
            {darkMode ? <IconMoon /> : <IconSun />}
            <label htmlFor="Light : Dark ">{darkMode ? 'Dark' : 'Light'}</label>
          </button>
        </div>
        <h1 className="text-style">My Dictionary</h1>
      </header>
      <hr className="hr-style" />
    </>
  );
}

export default Header;
