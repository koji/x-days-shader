uniform float iTime;
uniform vec3 iResolution;


float sdSphere(vec3 p, float r) {
    return length(p) -r;
}


float map(vec3 p) {
    return sdSphere(p, 1.0);
}


vec3 calcNormal(vec3 p) {
    vec2 e = vec2 (0.001, 0.0);
    return normalize(
        vec3(
             map(p + e.xyy) - map(p - e.xyy),
             map(p + e.yxy) - map(p - e.yxy),
             map(p + e.yyx) - map(p - e.yyx)
        )
    );
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    vec3 ro = vec3 (0.0, 0.0, 2.0);
    vec3 rd = normalize(vec3(uv, -1.5));
    float t = 0.0;
    vec3 col = vec3(0.0);
    
    for (int i=0; i<100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d<0.001) {
            vec3 normal = calcNormal(p);
            vec3 lightPos = vec3(2.0, 3.0, 4.0);
            vec3 lightDir = normalize(lightPos - p);
            
            float diff = max(0.0, dot(normal, lightDir));
            
            // gradation
            vec3 colorA = vec3(1.0, 0.0, 0.0);
            vec3 colorB =  vec3(0.0, 0.0, 1.0);
            //float mix_float = p.x * tan(iTime) * 0.5 + 0.5;
            //float mix_float = (p.x + p.y) * tan(iTime) * 0.25 + 0.5;
            //float wave_x = sin(p.x * 12.0 + iTime);
            //float wave_y = cos(p.y * 12.0 + iTime);
            //float mix_float = wave_x * wave_y * 0.5 +0.5;
            float dist = length(p.xy);
            float angle = atan(p.y, p.x) + cos(iTime);
            float mix_float = sin(angle * 10.0 + dist * 5.0 - iTime * 2.0) * 0.5 + 0.5;  
            vec3 materialColor = mix(colorA, colorB, mix_float);
            
            col = materialColor * diff;
            break;
        }
        if(t>100.0) {
            break;
        }
        t+= d;
    }
    
    gl_FragColor = vec4 (col, 1.0);
    
    
}
