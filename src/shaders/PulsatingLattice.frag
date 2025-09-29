uniform float iTime;
uniform vec3 iResolution;

const int CUBE_SIZE = 10;
const float LED_RADIUS = 0.05;
const float GRID_SPACING = 0.35;
const vec3 LED_COLOR = vec3(1.0);


float sdSphere(vec3 p, float r) {
    return length(p) - r;
}


float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float map(vec3 p) {
    float angle = -iTime * 0.25;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotMatrix = mat2(c, -s, s, c);
    p.xz = rotMatrix * p.xz;
    
    vec3 q = mod(p, GRID_SPACING) - GRID_SPACING * 0.5;
    float spheresDist = sdSphere(q, LED_RADIUS);

    float cubeHalfSize = float(CUBE_SIZE) * GRID_SPACING * 0.5;
    float boxDist = sdBox(p, vec3(cubeHalfSize));

    return max(spheresDist, boxDist);
}



void main()
{
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;

    float time = iTime * 0.2;
    vec3 ro = vec3(1.0, 2.5, 4.0);
  
    vec3 target = vec3(0.0);
    vec3 camZ = normalize(target - ro);
    vec3 camX = normalize(cross(vec3(0.0, 1.0, 0.0), camZ));
    vec3 camY = cross(camZ, camX);
    vec3 rd = normalize(camX * uv.x + camY * uv.y + camZ * 1.5);

    float t = 0.0;
    vec3 col = vec3(0.0);

    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        if (d < 0.001) {
            float ripple = 0.5 + 0.5 * sin(length(p.xz) * 4.0 - iTime * 3.0);
            
            float pulse = smoothstep(0.8, 0.95, ripple);
            
            vec3 blueColor = LED_COLOR * 0.475;
            vec3 redColor = vec3(1.0, 0.0, 0.01);
            
            vec3 finalColor = mix(blueColor, redColor, pulse);
            col = finalColor * exp(-0.15 * t) * (1.0 + pulse * 10.0);
            
            break;
        }

        t += d;

        if (t > 20.0) {
            break;
        }
    }

    col = max(col, vec3(0.0, 0.0, 0.0) + uv.y * 0.05);

    col = pow(col, vec3(0.4545));
    gl_FragColor = vec4(col, 1.0);
}
