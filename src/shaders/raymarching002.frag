uniform float iTime;
uniform vec3 iResolution;


float map(vec3 p) {
    float sphere_radius = 1.0;
    return length(p) - sphere_radius;
}



void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy)/iResolution.y;
    
    vec3 ro = vec3(0.0, 0.0, 2.5);
    
    vec3 rd = normalize(vec3(uv, -1.0));
    
    float t = 0.0;
    
    for(int i=0; i<64; i++) {
        vec3 p = ro + t * rd;
        
        float d = map(p);
        
        if(d<0.001) {
            break;
        }
        t += d;
    }

    
    vec3 col = vec3(0.0);
    
    if(t < 100.0) {
        col.r = sin(iTime / t);
    }

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}
