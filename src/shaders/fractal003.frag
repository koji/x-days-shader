uniform float iTime;
uniform vec3 iResolution;

#define MAX_ITERATIONS 100

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    vec2 c = vec2(-0.5, 0.0) + uv * .985;

    vec2 z = vec2(0.0);
    float isInside = 1.0;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z, z) > 4.0) {
            isInside = 0.0;
            break;
        }
    }

    // Always-bright animated color
    vec3 mandelbrotColor = 0.5 + 0.5 * vec3(
        sin(iTime * 0.7),
        sin(iTime * 0.9 + 2.0),
        sin(iTime * 1.1 + 4.0)
    );

    vec3 finalColor = isInside > 0.5 ? mandelbrotColor : vec3(0.0);
    gl_FragColor = vec4(finalColor, 1.0);
}
