import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Header } from '../components/Header';
import { VirtualizedShaderGrid } from '../components/VirtualizedShaderGrid';
import { shaders } from '../data/shaders';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Palette } from 'lucide-react';

const ShaderShowcase = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Get all unique tags
  const allTags = Array.from(new Set(shaders.flatMap(shader => shader.tags)));

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

            {/* Virtualized Shader Grid */}
            <VirtualizedShaderGrid
              shaders={shaders}
              searchTerm={searchTerm}
              selectedTag={selectedTag}
            />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ShaderShowcase;
