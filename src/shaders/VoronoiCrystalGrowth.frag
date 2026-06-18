// Voronoi Crystal Growth — organic crystal structures that pulse and shift
uniform float iTime;
uniform vec3 iResolution;

// 2D rotation matrix
mat2 rot2(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
}

// Hash function for Voronoi
vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
}

// Voronoi distance with cell ID
float voronoid(vec2 p, out vec2 cellId) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 8.0;
    cellId = vec2(0.0);

    for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        // Animate cell centers
        o = 0.5 + 0.5 * sin(iTime * 0.8 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < md) {
            md = d;
            cellId = n + g;
        }
    }
    return sqrt(md);
}

// Voronoi edge distance (for glowing edges)
float voronoiEdge(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 8.0;
    float md2 = 8.0;

    for (int j = -1; j <= 1; j++)
    for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        o = 0.5 + 0.5 * sin(iTime * 0.8 + 6.2831 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        if (d < md) {
            md2 = md;
            md = d;
        } else if (d < md2) {
            md2 = d;
        }
    }
    return sqrt(md2) - sqrt(md);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    // Slow rotation of the whole field
    uv *= rot2(iTime * 0.1);

    // Scale for crystal density
    float scale = 4.0 + 1.5 * sin(iTime * 0.3);
    vec2 p = uv * scale;

    vec2 cellId;
    float d = voronoid(p, cellId);
    float edge = voronoiEdge(p);

    // Cell-based color using hash
    vec3 cellColor = 0.5 + 0.5 * cos(
        6.28 * (hash2(cellId).x * 0.3 + vec3(0.0, 0.33, 0.67))
        + iTime * 0.5
    );

    // Crystal interior — subtle pulsing brightness
    float pulse = 0.7 + 0.3 * sin(iTime * 2.0 + hash2(cellId).y * 6.28);
    vec3 interior = cellColor * 0.4 * pulse;

    // Crystal edge glow
    float edgeGlow = exp(-8.0 * edge);
    float edgeGlow2 = exp(-3.0 * edge);
    vec3 glowColor = cellColor * 1.5 + vec3(0.2, 0.1, 0.3);

    // Crystal facet effect — diagonal lines within cells
    vec2 fp = fract(p);
    float facet = smoothstep(0.02, 0.0, abs(fp.x - fp.y));
    facet += smoothstep(0.02, 0.0, abs(fp.x + fp.y - 1.0));
    facet *= 0.15;

    // Compose
    vec3 col = interior;
    col += glowColor * edgeGlow * 0.9;
    col += glowColor * edgeGlow2 * 0.3;
    col += cellColor * facet * pulse;

    // Distance fade — crystals glow brighter near center
    float vignette = 1.0 - 0.4 * length(uv);
    col *= vignette;

    // Subtle depth shadow based on distance from cell center
    float depth = smoothstep(0.0, 0.5, d);
    col *= 0.6 + 0.4 * (1.0 - depth);

    // Gamma correction
    col = pow(col, vec3(0.85));

    gl_FragColor = vec4(col, 1.0);
}
