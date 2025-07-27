import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo/Title */}
        <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl px-6 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Shader Canvas
          </h1>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-glow-primary"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
};