uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

#define MAX_ITERATIONS 100

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    uv *= 1.5;
    
    

    // Use mouse position or animated values if mouse is not available
    vec2 mouse = iMouse.xy / iResolution.xy;
    vec2 c;
    
    if (mouse.x > 0.0 && mouse.y > 0.0) {
        // Use mouse position
        c = vec2(-1.0, -1.0) + mouse * 2.0;
    } else {
        // Animated values when mouse is not available
        c = vec2(0.7885 * cos(iTime * 0.2), 0.7885 * sin(iTime * 0.25));
    }

    vec2 z = uv;
    
    vec3 color = vec3(0.0);
    for(int i = 0; i < MAX_ITERATIONS; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if(dot(z, z) > 4.0) {
            float t = float(i) / float(MAX_ITERATIONS);
            color = 0.5 + 0.5 * cos(iTime + t * 12.0 + vec3(0.245, 0.6, 1.0));
            break;
        }
    }

    gl_FragColor = vec4(color, 1.0);
}
