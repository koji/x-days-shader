import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ShaderInfo } from '../data/shaders';
import { vertexShader } from '../lib/shaders';

interface ShaderCardProps {
  shader: ShaderInfo;
  fragmentShaderSource: string;
}

export const ShaderCard: React.FC<ShaderCardProps> = ({ shader, fragmentShaderSource }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!canvasRef.current) {
      console.warn(`No canvas ref for ${shader.name}`);
      return;
    }

    // Validate fragment shader source
    if (!fragmentShaderSource || fragmentShaderSource.trim() === '') {
      console.warn(`Empty shader source for ${shader.name} (ID: ${shader.id})`);
      return;
    }

    // Clean up previous renderer
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }



    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Disable for performance in preview
      alpha: false,
      powerPreference: "high-performance"
    });

    renderer.setPixelRatio(0.75); // Even lower pixel ratio for preview cards

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    let material: THREE.ShaderMaterial;
    try {
      material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() },
          iMouse: { value: new THREE.Vector4(0, 0, 0, 0) }
        },
        vertexShader,
        fragmentShader: fragmentShaderSource
      });
    } catch (error) {
      console.error(`Shader compilation error for ${shader.name}:`, error);
      // Fallback to a simple shader
      material = new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          iResolution: { value: new THREE.Vector3() },
          iMouse: { value: new THREE.Vector4(0, 0, 0, 0) }
        },
        vertexShader,
        fragmentShader: `
          uniform float iTime;
          uniform vec3 iResolution;
          uniform vec4 iMouse;
          
          void main() {
            vec2 uv = gl_FragCoord.xy / iResolution.xy;
            vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
            gl_FragColor = vec4(col, 1.0);
          }
        `
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    rendererRef.current = renderer;
    materialRef.current = material;

    const handleResize = () => {
      if (!renderer || !material) return;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width <= 0 || height <= 0) {
        console.warn(`Canvas has zero or negative dimensions for ${shader.name}: ${width}x${height}`);
        return;
      }

      renderer.setSize(width, height, false);
      material.uniforms.iResolution.value.set(width, height, 1);
    };

    handleResize();

    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = 30; // Limit preview cards to 30 FPS
    const frameInterval = 1000 / targetFPS;

    const animate = () => {
      if (!renderer || !scene || !camera || !material) return;

      const currentTime = performance.now();
      if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = currentTime;
      const time = clockRef.current.getElapsedTime();
      material.uniforms.iTime.value = time;

      try {
        renderer.render(scene, camera);
      } catch (error) {
        console.error(`Render error for ${shader.name}:`, error);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer?.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [fragmentShaderSource]);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-glow-primary hover:scale-[1.02] group">
      <Link to={`/shader/${shader.id}`} className="block">
        <div className="aspect-video relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {shader.name}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {shader.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {shader.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {shader.author && (
            <p className="text-xs text-muted-foreground mt-3">
              by {shader.author}
            </p>
          )}
        </CardContent>
      </Link>

      {/* ShaderToy link outside the Link wrapper */}
      {shader.shaderToyId && (
        <div className="px-6 pb-6">
          <a
            href={`https://www.shadertoy.com/view/${shader.shaderToyId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            View on ShaderToy
          </a>
        </div>
      )}
    </Card>
  );
};
