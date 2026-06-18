// Neon Corridor — infinite tunnel flight through a glowing geometric passage
// Concentric hexagonal rings rush past the camera while edge glow,
// pulsing neon strips, and angular panelling create depth. A fog
// function fades distant rings; corner accent lights add atmosphere.

uniform float iTime;
uniform vec3 iResolution;

// 2D rotation
mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

// Hexagonal distance: |p| adjusted for hex symmetry
float hexDist(vec2 p) {
    p = abs(p);
    float d = dot(p, normalize(vec2(1.0, 1.732)));
    return max(d, p.x);
}

// Signed distance to hexagon edge (returns 0 on edge)
float hexEdge(vec2 p, float size) {
    return abs(hexDist(p) - size);
}

// Hash for flicker
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float t = iTime;

    // Slow camera roll
    uv *= rot2(t * 0.08);

    // Polar-like mapping for tunnel: radius = distance from center,
    // "depth" encoded via 1/r (closer rings are far away in z)
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Prevent division by zero at center
    float rSafe = max(r, 0.001);

    // Depth parameter: rings closer to center are "further ahead"
    float depth = 1.0 / rSafe;

    // Advance through tunnel
    depth += t * 1.2;

    vec3 col = vec3(0.0);

    // Dark background with subtle radial gradient
    col += vec3(0.01, 0.005, 0.02) * exp(-r * 3.0);

    // ---- Main hex ring tunnel ----
    {
        // Ring spacing in depth
        float ringInterval = 1.5;
        float ringPhase = fract(depth / ringInterval);

        // Ring position in depth (0 = far, 1 = close)
        float ringZ = ringPhase;

        // Hex distortion on the UV for this ring
        vec2 hp = uv * rot2(depth * 0.15 + floor(depth / ringInterval) * 1.047);

        // Hex edge glow
        float hexSize = 0.35 + 0.05 * sin(depth * 0.8 + t);
        float edge = hexEdge(hp, hexSize);

        // Glow on edges, sharp falloff
        float edgeGlow = exp(-edge * 30.0);

        // Fog: rings further away (small ringZ) fade out
        float fog = exp(-ringZ * 0.5) * (1.0 - exp(-ringZ * 3.0));

        // Colour shifts with depth and angle
        float hue = fract(depth * 0.05 + a / 6.2831853 * 0.3);
        // Neon palette: cycling through cyan → magenta → orange → cyan
        vec3 neon;
        neon.r = 0.5 + 0.5 * cos(6.2831853 * (hue + 0.0));
        neon.g = 0.5 + 0.5 * cos(6.2831853 * (hue + 0.33));
        neon.b = 0.5 + 0.5 * cos(6.2831853 * (hue + 0.67));

        // Accent: brighten the edge based on which "ring layer" (gives individuality)
        float layerId = floor(depth / ringInterval);
        float flicker = 0.7 + 0.3 * sin(layerId * 2.37 + t * 2.5);

        col += neon * edgeGlow * fog * flicker * 0.8;
    }

    // ---- Secondary ring layer (different spacing → moiré depth) ----
    {
        float ringInterval = 2.3;
        float ringPhase = fract(depth * 0.7 / ringInterval + 0.5);
        float ringZ = ringPhase;

        vec2 hp2 = uv * rot2(-depth * 0.1 + floor(depth * 0.7 / ringInterval) * 0.785);
        float hexSize2 = 0.28 + 0.04 * sin(depth * 0.5);
        float edge2 = hexEdge(hp2, hexSize2);
        float edgeGlow2 = exp(-edge2 * 50.0);

        float fog2 = exp(-ringZ * 0.7) * (1.0 - exp(-ringZ * 4.0));

        // Warm amber accent
        vec3 warmC = vec3(1.0, 0.6, 0.15);
        col += warmC * edgeGlow2 * fog2 * 0.25;
    }

    // ---- Corner accent lights (ring highlights at 6 angular positions) ----
    {
        // 6-fold angular symmetry
        float a6 = abs(fract(a / 6.2831853 * 6.0 + t * 0.02) - 0.5) * 2.0;
        float corner = smoothstep(0.12, 0.0, a6);

        // Pulsing radial bands at tunnel depth intervals
        float pulseBand = sin(depth * 4.0 + t * 3.0);
        float brightness = 0.5 + 0.5 * pulseBand;

        // Only near the hex corners (modulated by radius)
        float rBand = smoothstep(0.2, 0.15, r) * smoothstep(0.01, 0.04, r);

        vec3 lightCol = mix(vec3(0.2, 0.8, 1.0), vec3(1.0, 0.3, 0.6), 0.5 + 0.5 * sin(t * 0.5));
        col += lightCol * corner * rBand * brightness * 0.15;
    }

    // ---- Speed lines / streaks converging to center ----
    {
        // Angular streaks pulled towards center
        float streak = abs(sin(a * 12.0 + depth * 0.3));
        streak = pow(streak, 8.0);
        float streakEnv = exp(-r * 6.0) * smoothstep(0.04, 0.12, r);
        col += vec3(0.4, 0.6, 1.0) * streak * streakEnv * 0.2;
    }

    // ---- Central glow (headlight effect) ----
    {
        float pulse = 0.7 + 0.3 * sin(t * 1.8);
        float center = exp(-r * 12.0) * pulse;
        vec3 centerCol = mix(vec3(0.6, 0.8, 1.0), vec3(1.0, 0.9, 0.7), 0.5 + 0.5 * sin(t * 0.3));
        col += centerCol * center * 0.6;
    }

    // ---- Sparkle / dust in corridor ----
    {
        vec2 grid = floor(uv * 20.0 + t * 0.5);
        float sparkle = hash12(grid);
        sparkle = smoothstep(0.985, 1.0, sparkle);
        float envS = exp(-r * 2.5);
        col += vec3(1.0, 0.95, 0.9) * sparkle * envS * 0.3;
    }

    // Vignette
    col *= 1.0 - 0.4 * smoothstep(0.5, 1.2, r);

    // Mild Reinhard tone-map + gamma
    col = col / (1.0 + col);
    col = pow(col, vec3(0.85));

    gl_FragColor = vec4(col, 1.0);
}
