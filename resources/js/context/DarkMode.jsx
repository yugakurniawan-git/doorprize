import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

export default function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode")
      ? JSON.parse(localStorage.getItem("isDarkMode"))
      : false
  );
  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);
  return (
    <DarkModeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
