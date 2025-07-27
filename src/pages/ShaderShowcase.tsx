import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { ShaderCard } from '../components/ShaderCard';
import { shaders } from '../data/shaders';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Palette } from 'lucide-react';
import { loadShader } from '../lib/shaders';

const ShaderShowcase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [shaderSources, setShaderSources] = useState<Record<string, string>>({});

  // Load shader sources
  useEffect(() => {
    const loadShaders = async () => {
      const sources: Record<string, string> = {};

      for (const shader of shaders) {
        try {
          const shaderSource = await loadShader(shader.fragmentShader);
          sources[shader.id] = shaderSource;
        } catch (error) {
          console.error(`Failed to load shader ${shader.fragmentShader}:`, error);
          sources[shader.id] = `
            uniform float iTime;
            uniform vec3 iResolution;
            uniform vec4 iMouse;
            
            void main() {
              vec2 uv = gl_FragCoord.xy / iResolution.xy;
              vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
              gl_FragColor = vec4(col, 1.0);
            }
          `;
        }
      }

      setShaderSources(sources);
    };

    loadShaders();
  }, []);

  // Get all unique tags
  const allTags = Array.from(new Set(shaders.flatMap(shader => shader.tags)));

  // Filter shaders
  const filteredShaders = shaders.filter(shader => {
    const matchesSearch = shader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shader.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || shader.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  X Days Shader Gallery
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore a collection of interactive GLSL fragment shaders.
                Click any shader to view it in full-screen glory.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search shaders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                <Badge
                  variant={selectedTag === null ? "default" : "secondary"}
                  className="cursor-pointer transition-colors hover:bg-primary/80"
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Badge>
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer transition-colors hover:bg-primary/80"
                    onClick={() => setSelectedTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Shader Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredShaders.map((shader) => (
                <ShaderCard
                  key={shader.id}
                  shader={shader}
                  fragmentShaderSource={shaderSources[shader.id] || ''}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredShaders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No shaders found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ShaderShowcase;
