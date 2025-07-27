uniform float iTime;
uniform vec3 iResolution;

float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    vec2 c = vec2(-0.7, 0.0) + uv * 1.5;
    
    vec2 z = vec2(0.0);
    vec3 col = vec3(0.0);

   
    float time_int = floor(iTime * 2.5); // iTime = 10.8 -> 10.0
    float time_frac = fract(iTime * 2.5); // iTime = 10.8 -> 0.8

    // get the hash value of x sec and the hash value of x+1 sec
    float random_val_a = hash(time_int);
    float random_val_b = hash(time_int + 1.0);
    
    // mix two values with frac
    float smooth_random = mix(random_val_a, random_val_b, time_frac);
    
    // iterations from 0 - 20 times
    int Max = int(smooth_random * 20.0);
    
    // --- ここまで ---

    for(int i = 0; i < Max; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if(dot(z, z) > 4.0) {
            col = vec3(1.0);
            break;
        }
    }
    
    gl_FragColor = vec4(col, 1.0);
}
