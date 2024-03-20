import { ReactNode, createContext, useContext, useState } from "react";

const DarkModeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

type DarkModeProviderProps = {
  children: ReactNode;
};

const DarkModeProvider = (props: DarkModeProviderProps) => {
  const { children } = props;

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    console.log("toggle dark mode");

    const newIsDarkMode = !isDarkMode;
    const bodyClass = window.document.body.classList;

    newIsDarkMode ? bodyClass.add("dark") : bodyClass.remove("dark");

    setIsDarkMode(!isDarkMode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

const useDarkMode = () => {
  return useContext(DarkModeContext);
};

export { DarkModeProvider, useDarkMode };
