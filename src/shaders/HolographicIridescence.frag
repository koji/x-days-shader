// HolographicIridescence.frag
// Iridescent holographic surface using thin-film interference simulation.
// Multiple overlapping wave layers simulate light reflecting off a thin film,
// where path-length differences produce color shifts based on viewing angle.
// A flowing normal-mapped surface adds depth and motion to the effect.

uniform float iTime;
uniform vec3 iResolution;

// Simple hash for pseudo-random values
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Value noise for surface distortion
float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // smoothstep
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal brownian motion — 5 octaves for rich detail
float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
        v += a * vnoise(p);
        p = rot * p * 2.0;
        a *= 0.5;
    }
    return v;
}

// Thin-film interference: color from optical path difference
// Simulates light reflecting from top and bottom of a thin film,
// producing wavelength-dependent constructive/destructive interference.
vec3 thinFilmColor(float opd) {
    // Phase for each RGB wavelength (different film thickness response)
    float r = cos(opd * 6.2832 * 1.0) * 0.5 + 0.5;
    float g = cos(opd * 6.2832 * 1.5) * 0.5 + 0.5;
    float b = cos(opd * 6.2832 * 2.0) * 0.5 + 0.5;
    return vec3(r, g, b);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float t = iTime * 0.3;

    // Flowing surface normals via fbm
    // Two noise samples offset in time create a drifting surface
    float n1 = fbm(uv * 3.0 + vec2(t * 0.7, t * 0.4));
    float n2 = fbm(uv * 3.0 + vec2(-t * 0.5, t * 0.6) + 5.0);
    float n3 = fbm(uv * 2.0 + vec2(t * 0.3, -t * 0.8) + 10.0);

    // Simulated surface normal from noise gradients
    // Approximate derivative via finite difference
    float eps = 0.01;
    float nx = fbm((uv + vec2(eps, 0.0)) * 3.0 + vec2(t * 0.7, t * 0.4))
             - fbm((uv - vec2(eps, 0.0)) * 3.0 + vec2(t * 0.7, t * 0.4));
    float ny = fbm((uv + vec2(0.0, eps)) * 3.0 + vec2(t * 0.7, t * 0.4))
             - fbm((uv - vec2(0.0, eps)) * 3.0 + vec2(t * 0.7, t * 0.4));
    vec3 normal = normalize(vec3(-nx, -ny, 1.0) * 2.0);

    // Viewing direction (from center, like looking at a curved surface)
    vec3 viewDir = normalize(vec3(uv, 1.0));

    // Fresnel-like term: grazing angle → stronger iridescence
    float fresnel = 1.0 - abs(dot(normal, viewDir));
    fresnel = pow(fresnel, 2.0);

    // Optical path difference depends on:
    //   - viewing angle (Fresnel shift)
    //   - film thickness (driven by noise)
    //   - spatial position (different thickness across surface)
    float filmThickness = mix(0.3, 1.5, n1);
    float opd = filmThickness / max(dot(normal, viewDir), 0.1);

    // Base iridescent color from thin-film interference
    vec3 iriColor = thinFilmColor(opd * 3.0);

    // Second interference layer offset for more color complexity
    float opd2 = mix(0.2, 1.0, n2) / max(dot(normal, vec3(-viewDir.xy, 1.0)), 0.1);
    vec3 iriColor2 = thinFilmColor(opd2 * 4.0 + 1.5);

    // Third layer for deep color shifts
    float opd3 = mix(0.4, 1.2, n3) / max(dot(normal, vec3(viewDir.yx, 1.0)), 0.1);
    vec3 iriColor3 = thinFilmColor(opd3 * 5.0 + 3.0);

    // Combine interference layers — weighted by Fresnel and noise
    vec3 col = iriColor * 0.5 + iriColor2 * 0.3 + iriColor3 * 0.2;

    // Boost iridescence at grazing angles
    col *= mix(0.4, 1.8, fresnel);

    // Specular highlight — fake light source
    vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVec), 0.0), 60.0);
    col += spec * vec3(1.0, 0.95, 0.9) * 0.6;

    // Subtle diffuse lighting based on noise-driven normal
    float diffuse = max(dot(normal, lightDir), 0.0) * 0.3 + 0.7;
    col *= diffuse;

    // Edge glow — rim lighting for holographic feel
    float rim = pow(fresnel, 3.0) * 0.5;
    col += rim * vec3(0.6, 0.8, 1.0);

    // Subtle vignette to frame the effect
    float vig = 1.0 - dot(uv * 0.5, uv * 0.5);
    col *= smoothstep(0.0, 0.8, vig);

    // Tone-map to prevent blow-out, preserve vivid colors
    col = col / (1.0 + col * 0.5);

    // Slight gamma correction
    col = pow(col, vec3(0.9));

    gl_FragColor = vec4(col, 1.0);
}
