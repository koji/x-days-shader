// Sacred Mandala — layered rotational symmetry in polar coordinates
// Nested rings of petals, dots, and geometric arms rotate at different speeds.
// A radial pulse breathes life into the pattern. Colors shift through a
// jewel-toned palette (gold, ruby, emerald, sapphire) mapped to angle and radius.

uniform float iTime;
uniform vec3 iResolution;

// Simple hash for sparkle noise
float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// Smooth sawtooth: repeats 0→1 in [0, period)
float saw(float x, float period) {
    return fract(x / period);
}

// Signed distance to a line segment (2D)
float sdSegment(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float r = length(uv);
    float a = atan(uv.y, uv.x); // -PI..PI

    float t = iTime * 0.3;

    vec3 col = vec3(0.0);

    // Background: deep dark indigo fading to black at edges
    col += vec3(0.02, 0.01, 0.05) * exp(-r * 2.0);

    // ---- Rotational symmetry helper ----
    // Returns pattern that repeats N times around the circle
    // angle: 0..1 within each slice
    float sym(float angle, float N, float offset) {
        return abs(fract(angle * N / 6.2831853 + offset) - 0.5) * 2.0;
    }

    // ---- Ring 1: Outer petal ring (8-fold) ----
    {
        float N = 8.0;
        float s = sym(a, N, t * 0.1);
        // Petal shape: wide at base, narrow at tip
        float petal = smoothstep(0.0, 0.15, s) * smoothstep(0.9, 0.3, s);
        // Radial envelope: ring between r=0.6 and r=0.85
        float env = smoothstep(0.58, 0.62, r) * smoothstep(0.88, 0.82, r);
        float glow = petal * env;
        vec3 c = mix(vec3(0.85, 0.65, 0.1), vec3(1.0, 0.3, 0.2), s);
        col += c * glow * 0.7;
    }

    // ---- Ring 2: Spoked wheel (12-fold) ----
    {
        float N = 12.0;
        float s = sym(a, N, -t * 0.15);
        // Thin spokes
        float spoke = smoothstep(0.05, 0.0, s) * 0.6;
        // Radial: from center out to 0.75
        float env = smoothstep(0.05, 0.15, r) * smoothstep(0.78, 0.72, r);
        float glow = spoke * env;
        vec3 c = vec3(0.9, 0.8, 0.3); // gold
        col += c * glow;
    }

    // ---- Ring 3: Diamond dots (16-fold) ----
    {
        float N = 16.0;
        float s = sym(a, N, t * 0.05);
        // Dot at center of each slice
        float dot = smoothstep(0.08, 0.02, s);
        // Place dots in a ring at r = 0.5
        float env = exp(-80.0 * (r - 0.5) * (r - 0.5));
        float pulse = 0.8 + 0.2 * sin(t * 3.0 + s * 6.28);
        float glow = dot * env * pulse;
        vec3 c = vec3(0.3, 0.9, 0.6); // emerald
        col += c * glow * 0.9;
    }

    // ---- Ring 4: Inner flower (6-fold) ----
    {
        float N = 6.0;
        float s = sym(a, N, -t * 0.2);
        // Broad petals
        float petal = smoothstep(0.0, 0.25, s) * smoothstep(1.0, 0.25, s);
        float env = smoothstep(0.12, 0.18, r) * smoothstep(0.42, 0.35, r);
        float glow = petal * env;
        vec3 c = mix(vec3(0.2, 0.4, 0.9), vec3(0.6, 0.2, 0.8), 0.5 + 0.5 * sin(t + r * 4.0));
        col += c * glow * 0.8;
    }

    // ---- Ring 5: Tiny accent dots (24-fold) at r=0.88 ----
    {
        float N = 24.0;
        float s = sym(a, N, -t * 0.08);
        float dot = smoothstep(0.06, 0.01, s);
        float env = exp(-120.0 * (r - 0.88) * (r - 0.88));
        float glow = dot * env;
        vec3 c = vec3(1.0, 0.9, 0.7); // warm white
        col += c * glow * 0.5;
    }

    // ---- Central glowing orb ----
    {
        float pulse = 0.8 + 0.2 * sin(t * 2.5);
        float orb = exp(-18.0 * r * r) * pulse;
        vec3 c = mix(vec3(1.0, 0.85, 0.5), vec3(0.9, 0.5, 1.0), 0.5 + 0.5 * sin(t * 1.5));
        col += c * orb;
    }

    // ---- Connecting arcs between rings (8-fold) ----
    {
        float N = 8.0;
        float s = sym(a, N, t * 0.1);
        // Thin arc bands
        float arc = smoothstep(0.03, 0.0, abs(s)) * 0.3;
        float env = smoothstep(0.35, 0.4, r) * smoothstep(0.6, 0.55, r);
        float glow = arc * env;
        vec3 c = vec3(0.7, 0.6, 1.0); // lavender
        col += c * glow;
    }

    // ---- Radial pulse ring expanding outward ----
    {
        float phase = fract(t * 0.4);
        float ringR = phase * 1.1;
        float ring = exp(-300.0 * (r - ringR) * (r - ringR));
        float fade = 1.0 - phase; // fades as it expands
        vec3 c = vec3(0.9, 0.75, 0.4) * ring * fade * 0.35;
        col += c;
    }

    // ---- Sparkle overlay ----
    {
        float sparkle = hash21(floor(uv * 40.0) + floor(t * 4.0));
        sparkle = smoothstep(0.97, 1.0, sparkle) * exp(-r * 1.5);
        col += vec3(1.0) * sparkle * 0.5;
    }

    // ---- Outer vignette ----
    col *= 1.0 - smoothstep(0.7, 1.2, r);

    // Tone-map (simple Reinhard) + gamma
    col = col / (1.0 + col);
    col = pow(col, vec3(0.9));

    gl_FragColor = vec4(col, 1.0);
}
