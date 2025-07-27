uniform float iTime;
uniform vec3 iResolution;


#define LAYERS 80.0
#define FRACTAL_ITERATIONS 10

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}


void main() {

    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float t = sin(iTime + 10.275 * 0.628318) * 0.5;
    
    vec4 totalColor = vec4(0.0);


    for(float i = 1.0; i < LAYERS; i++) {
        
        vec3 p = vec3(uv * 0.78, 1.0 + i * 0.015);

        p.xz *= rotate(t / 10. + iTime);
        p.xy *= rotate(t * iTime * 0.001235);

        for(int j = 0; j < FRACTAL_ITERATIONS; j++) {
            p = abs(p) - 0.5; // Fold space
            p += cos(p.yzx * 1.5 - t*2.0) / 2.0;
        }
        

        float v = length(p.xy);
        v = pow(0.02 / (v + 0.001), 1.5);
        vec3 color = sin(vec3(0.1, 0.2, 0.35) * (i * 0.15)) * 0.5 + 0.5;
        totalColor += vec4(color, 1.0) * v + t;
    }

    totalColor /= LAYERS + t;
    totalColor = tanh(totalColor * 2.0);

    totalColor.rgb = pow(totalColor.rgb, vec3(1.75));
    
    gl_FragColor = totalColor;
}
