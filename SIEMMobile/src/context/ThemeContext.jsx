import { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../styles/themes';

const ThemeContext = createContext();

/**
 * Provide shared light and dark theme state
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Theme context provider
 */
export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState(systemColorScheme === 'dark' ? 'dark' : 'light');
  const isDarkMode = themeMode === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;

  /**
   * Toggle between light and dark application themes
   * @returns {void}
   */
  const toggleTheme = () => {
    setThemeMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    themeMode,
    theme,
    isDarkMode,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Access the current application theme
 * @returns {{themeMode: string, theme: object, isDarkMode: boolean, toggleTheme: Function}} Theme state and actions
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
