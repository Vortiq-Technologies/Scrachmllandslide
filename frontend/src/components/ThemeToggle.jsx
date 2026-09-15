import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle-icon">
        {theme === 'dark' ? (
          <Sun size={16} />
        ) : (
          <Moon size={16} />
        )}
      </span>

      <span className="theme-toggle-text">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}

export default ThemeToggle;