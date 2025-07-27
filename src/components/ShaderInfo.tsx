import React from 'react';
import { useFPS } from '../hooks/use-fps';

export const ShaderInfo: React.FC = () => {
  const fps = useFPS();
  console.log('fps', fps);
  return (
    <div className="fixed bottom-6 left-6 right-6 z-40">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-md bg-glass-bg border border-glass-border rounded-xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Plasma Waves</h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                A dynamic fragment shader featuring layered sine waves, circular interference patterns,
                and smooth color transitions. Built with Three.js and GLSL.
              </p>
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
  );
};
