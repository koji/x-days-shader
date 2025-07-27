uniform float iTime;
uniform vec3 iResolution;

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q)-t.y;
}


float map(vec3 p) {
    // rotate
    float angle = iTime;
    float s = sin(angle);
    float c = cos(angle);
    
    mat2 rotationMatrix = mat2(c, -s ,s ,c);
    p.xz = rotationMatrix * p.xz;
    
    
    return sdTorus(p, vec2(1.0, 0.4));
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
            
            // ambient light
            float ambient = 0.2;
            
            
            
            vec3 viewDir = normalize(ro - p);
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec_dot = max(0.0, dot(viewDir, reflectDir));
            float spec = pow(spec_dot, 32.0); 
            
            
            //vec3 materialColor = vec3(1.0);
            vec3 materialColor = 0.5 + 0.5*cos(iTime*0.5 + p.y*8.0 + vec3(0,2,4));
            vec3 highlightColor = vec3(1.0);
            col = materialColor * (diff + ambient) + highlightColor * spec;
            float pattern = fract(tan(uv.x * float(i)));
            col *= vec3(pattern);
            
            break;
        }
        
        if(t>100.0) {
            break;
        }
        
        t+= d;
    }
    float gamma = 2.2;
    col = pow(col, vec3(1.0/gamma));
    
    gl_FragColor = vec4 (col, 1.0);
    
    
}
