import { createContext, useContext, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { darkModeCookie } from '~/cookies.js';

interface DarkMode {
  isDark: boolean;
  setDark: (value: boolean) => void;
}

export const DarkContext = createContext<DarkMode>({
  isDark: false,
  setDark: () => {},
});

export const getDarkMode = async (request: Request): Promise<boolean> => {
  let cookieHeader = request.headers.get('Cookie');
  let darkMode = Boolean(await darkModeCookie.parse(cookieHeader));
  return darkMode;
};

export const useDarkMode = () => {
  const { isDark, setDark } = useContext(DarkContext);

  const toggleDark = () => {
    setDark(!isDark);
  };

  return { isDark, toggleDark };
};

export const DarkThemeWrapper = ({ children, defaultValue }) => {
  const [isDark, setDarkValue] = useState(defaultValue);

  const setDark = () => {
    const newDark = !isDark;
    setDarkValue(newDark);
    fetch('/api/setDark', {
      method: 'POST',
      body: JSON.stringify({ dark: newDark }),
    });
  };

  return (
    <DarkContext.Provider value={{ isDark, setDark }}>
      {children}
    </DarkContext.Provider>
  );
};

export const DarkModeToggle = () => {
  const { isDark, toggleDark } = useDarkMode();

  return (
    <button
      onClick={toggleDark}
      className="flex title-font font-medium items-center text-gray-900 dark:text-gray-100 mx-2"
    >
      {isDark ? <MdLightMode /> : <MdDarkMode />}
    </button>
  );
};
