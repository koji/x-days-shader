// Chromatic Wave Pool — interference patterns from multiple wave sources
// Procedural circular waves emanate from drifting point sources.
// Overlapping wavefronts create constructive/destructive interference.
// Each RGB channel uses a slightly different frequency, producing
// chromatic fringes that ripple across the surface like light through
// a thin film. Brightness is modulated by wave amplitude squared for
// realistic intensity superposition.

uniform float iTime;
uniform vec3 iResolution;

// Simple 2D hash for pseudo-random source positions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Smooth minimum for blending wave centers
float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    // Accumulate wave amplitudes per color channel
    float waveR = 0.0;
    float waveG = 0.0;
    float waveB = 0.0;

    // Multiple wave sources that drift over time
    // Each source orbits on its own path
    for (int i = 0; i < 7; i++) {
        float fi = float(i);
        // Position: each source orbits around a different center
        float angle0 = fi * 0.897 + 0.5;  // golden-angle-ish offset
        float radius0 = 0.35 + 0.15 * sin(fi * 1.3);
        vec2 center = vec2(
            radius0 * cos(iTime * 0.3 + angle0),
            radius0 * sin(iTime * 0.25 + angle0 * 1.3)
        );

        float dist = length(uv - center);

        // Per-source frequency variation
        float freq = 12.0 + fi * 1.7;
        float speed = 2.0 + fi * 0.3;

        // Chromatic dispersion: each channel gets a slightly different frequency
        // This mimics thin-film interference where wavelength determines path length
        float phase = freq * dist - speed * iTime;
        waveR += sin((phase + 0.0) * 1.00) / (1.0 + dist * 3.0);
        waveG += sin((phase + 0.8) * 1.03) / (1.0 + dist * 3.0);
        waveB += sin((phase + 1.6) * 1.06) / (1.0 + dist * 3.0);
    }

    // Add two slowly-drifting "deep sources" for larger-scale patterns
    for (int j = 0; j < 3; j++) {
        float fj = float(j);
        vec2 deepCenter = vec2(
            0.5 * cos(iTime * 0.15 + fj * 2.094),
            0.5 * sin(iTime * 0.12 + fj * 2.094 + 1.0)
        );
        float d = length(uv - deepCenter);
        float deepFreq = 6.0 + fj * 2.0;
        float deepPhase = deepFreq * d - 1.5 * iTime;
        waveR += 0.5 * sin(deepPhase) / (1.0 + d * 1.5);
        waveG += 0.5 * sin(deepPhase + 0.6) / (1.0 + d * 1.5);
        waveB += 0.5 * sin(deepPhase + 1.2) / (1.0 + d * 1.5);
    }

    // Square the amplitude for intensity (energy ~ amplitude^2)
    // This makes interference fringes more pronounced
    vec3 col = vec3(waveR * waveR, waveG * waveG, waveB * waveB);

    // Tone mapping: bring the dynamic range into visible range
    col = 1.0 - exp(-col * 2.5);

    // Subtle vignette to draw the eye inward
    float vig = 1.0 - 0.3 * dot(uv, uv);
    col *= vig;

    // Boost saturation slightly (mix toward luminance)
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, 1.4);

    gl_FragColor = vec4(col, 1.0);
}
