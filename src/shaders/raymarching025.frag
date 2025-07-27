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

float map(vec3 p) {
    return sdTetrahedron(p, 1.0);
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
            
            vec3 lightPos = vec3(4.0 * sin(iTime * 0.2), 3.5, 4.0 * cos(iTime * 0.2));
            vec3 lightColor = vec3(0.143, 0.75, 0.65);
            vec3 objectColor = vec3(0.3, 0.6, 1.0);
            
            float ambientStrength = 0.315;
            vec3 ambient = ambientStrength * lightColor;
            
            
            vec3 lightDir = normalize(lightPos - p);
            
            
            float diff = max(dot(normal, lightDir), 0.0);
            vec3 diffuse = diff * lightColor;
            
            float specularStrength = 0.985;
            vec3 viewDir = normalize(ro - p);
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
            vec3 specular = specularStrength * spec * lightColor;
            
            
            col = (ambient + diffuse) * objectColor + specular;
            break;
        }
        
        if(t>100.0) {
            break;
        }
        
        t+= d;
    }
    
    gl_FragColor = vec4 (col, 1.0);  
}
