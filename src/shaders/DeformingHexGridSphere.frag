uniform float iTime;
uniform vec3 iResolution;

#define PI 3.14159;

mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float calcPattern(vec2 uv) {
    vec2 p = vec2(0.0);
    float i = 0.0;
    float g = 0.0;
    float d = 1.0;

    for ( ; ++i < 128.0 && d > 0.001; g += d) {
        p = vec2((uv - 0.5 * iResolution.xy) / iResolution.y) * g
            + vec2(0.3) * rotate2D(g * 2.0);
        d = -(length(p) - 2.0 + g / 9.0) / 2.0;
    }

    p = vec2(atan(p.x, p.y), g) * 8.28 + iTime * 2.0;

    p = abs(fract(p + vec2(0.0, 0.5 * ceil(p.x))) - 0.5);

    float o = 30.0 / i - 0.5 / step(0.9, 1.0 - abs(max(p.x * 1.5 + p.y, p.y * 2.0) - 1.0));
    return o;
}


float sdSphere(vec3 p, float r) {
    return length(p) - r;
}

float map(vec3 p) {
    float res = sdSphere(p, 1.0);
    
    float spike_freq = 11.0 * sin(iTime) + 11.0; 
    float spike_amp = 0.15;
    
    vec3 q = p * spike_freq;
    float spikes = sin(q.x) * sin(q.y) * sin(q.z) * cos(iTime);
    res -= spikes * spike_amp;
    
    return res;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(
        vec3(
            map(p + e.xyy) - map(p - e.xyy),
            map(p + e.yxy) - map(p - e.yxy),
            map(p + e.yyx) - map(p - e.yyx)
        )
    );
}

void main() {
    vec2 uv_screen = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    
    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv_screen, -1.5));
    
    float t = 0.0;
    vec3 col = vec3(0.25);
    
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if (d < 0.001) {
            vec3 normal = calcNormal(p);
            

            vec2 uv_sphere = vec2(atan(p.z, p.x), acos(p.y / length(p)));
            uv_sphere /= PI;

            float pattern_value = calcPattern(uv_sphere * 200.0);

            vec3 materialColor = vec3(pattern_value + pattern_value * cos(iTime),
                                      pattern_value,
                                      pattern_value + pattern_value * sin(iTime));
            
            vec3 lightPos = vec3(2.0, 3.0, 4.0);
            vec3 lightDir = normalize(lightPos - p);
            float diff = max(0.0, dot(normal, lightDir));
            float ambient = 0.2;

            col = materialColor * (diff + ambient);
            break;
        }
        
        if (t > 100.0) {
            break;
        }
        
        t += d;
    }
    
    gl_FragColor = vec4(col, 1.0);
}
