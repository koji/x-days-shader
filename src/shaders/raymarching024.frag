uniform float iTime;
uniform vec3 iResolution;

float sdTetrahedron( vec3 p, float g )
{
    //float angle = 2.86;
    float angle = 2.86 + iTime * 0.75;
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    p.xz = rot * p.xz;

    const vec3 n1 = normalize(vec3( 1.0, 1.0, 1.0));
    const vec3 n2 = normalize(vec3( 1.0,-1.0,-1.0));
    const vec3 n3 = normalize(vec3(-1.0, 1.0,-1.0));
    const vec3 n4 = normalize(vec3(-1.0,-1.0, 1.0));
    return max(max(dot(p,n1), dot(p,n2)), max(dot(p,n3), dot(p,n4))) - g;
}


float sdSphere(vec3 p, float r) {
    return length(p) -r;
}

vec3 opRep( vec3 p, vec3 c )
{
    return mod(p + 0.5*c, c) - 0.5*c;
}


float morphing() {
    return(sin(iTime * 0.5) + 1.0) * 0.5;
}


float map(vec3 p) {
    vec3 p_rep = opRep(p, vec3(8.0));
    
    float tetra = sdTetrahedron(p_rep, 1.0);
    float sphere = sdSphere(p_rep, 1.0);
    
    // morphing
    float morph = morphing();
    float d = mix(tetra, sphere, morph);
    
    return d;
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
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy)/iResolution.y;
    
    vec3 ro = vec3 (0.0, 0.0, 6.0);
    vec3 rd = normalize(vec3(uv, -1.5));
    
    float t = 0.0;
    
    vec3 col = vec3(0.0);
    
    
    for (int i=0; i<100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d<0.001) {
            vec3 normal = calcNormal(p);
            
            vec3 lightPos = vec3(0.0, 0.0, 4.0);
            
            vec3 lightDir = normalize(lightPos - p);
            
            float diff = max(0.0, dot(normal, lightDir));
            
            
            float morph = morphing();
            vec3 colorA = vec3(0.25, 0.5, 1.0);
            vec3 colorB = vec3(1.0, 0.25, 0.2);
            
            vec3 mixCol = mix(colorA, colorB, morph);
            
            //col = vec3(diff);
            col = mixCol * (diff * 0.8 + 0.2);
            break;
        }
        
        if(t>100.0) {
            break;
        }
        
        t+= d;
    }
    
    gl_FragColor = vec4 (col, 1.0);
}
