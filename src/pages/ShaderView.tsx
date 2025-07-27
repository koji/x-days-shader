import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ShaderCanvas } from '../components/ShaderCanvas';
import { shaders } from '../data/shaders';
import { Button } from '../components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFPS } from '../hooks/use-fps';
import { loadShader } from '../lib/shaders';

const ShaderViewContent: React.FC = () => {
  const { shaderId } = useParams<{ shaderId: string }>();
  const { theme, toggleTheme } = useTheme();
  const [shaderSource, setShaderSource] = useState<string>('');
  const fps = useFPS();

  const shader = shaders.find(s => s.id === shaderId);

  useEffect(() => {
    if (!shader) return;

    const loadShaderSource = async () => {
      try {
        const shaderSource = await loadShader(shader.fragmentShader);
        setShaderSource(shaderSource);
      } catch (error) {
        console.error(`Failed to load shader ${shader.fragmentShader}:`, error);
        setShaderSource(`
          uniform float iTime;
          uniform vec3 iResolution;
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(iTime), 1.0);
          }
        `);
      }
    };

    loadShaderSource();
  }, [shader]);

  if (!shader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Shader Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The shader you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* Full-screen shader canvas */}
      <div className="absolute inset-0">
        <ShaderCanvas fragmentShader={shaderSource} />
      </div>

      {/* UI Overlay */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-glow-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="sr-only">Back to gallery</span>
              </Button>
            </Link>

            <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl px-6 py-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {shader.name}
              </h1>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl hover:bg-primary/10 transition-all duration-300 hover:shadow-lg hover:shadow-glow-primary"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Bottom Info Panel */}
      <div className="fixed bottom-6 left-6 right-6 z-40">
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {shader.description}
                </p>
                {shader.author && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Created by {shader.author}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Resolution: <span className="text-primary font-mono">Auto</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  FPS: <span className="text-primary font-mono">{fps}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShaderView = () => {
  return (
    <ThemeProvider>
      <ShaderViewContent />
    </ThemeProvider>
  );
};

export default ShaderView;
