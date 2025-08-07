uniform float iTime;
uniform vec3 iResolution;

float sdSphere(vec3 p, float r) {
    return length(p) -r;
}


float map(vec3 p) {
    float res = sdSphere(p, 1.0);
    
    float spike_freq = 11.0 * sin(iTime) + 11.0; 
    float spike_amp = 0.15;
    
    vec3 q = p * spike_freq;
    float spikes = sin(q.x) * sin(q.y) * sin(q.z) + cos(iTime);
    res -= spikes * spike_amp;
    
    return res;
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
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = (2.0 * fragCoord - iResolution.xy)/iResolution.y;
    
    vec3 ro = vec3 (0.0, 0.0, 3.0);
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
            
            col = vec3(diff);
            break;
        }
        
        if(t>100.0) {
            break;
        } 
        
        t+= d;
    }
    
    gl_FragColor = vec4 (col, 1.0);
}
