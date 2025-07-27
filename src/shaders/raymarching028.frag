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


vec3 opRep( vec3 p, vec3 c )
{
    return mod(p + 0.5*c, c) - 0.5*c;
}


float map(vec3 p) {

    vec3 p_rep = opRep(p, vec3(16.0));
    return sdTetrahedron(p_rep, 1.0);
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
    
    float angle = radians(iTime*20.5);
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    
    vec3 ro = vec3 (0.0, 0.0, 10.0);
    vec3 rd = normalize(vec3(uv, -1.5));
    
    float t = 0.0;
    vec3 col = vec3(0.0);
    
    bool hit = false;
    
    for (int i=0; i<100; i++) {
        vec3 p = ro + rd * t * abs(cos(iTime));
        float d = map(p);
        
        if(d < 0.001) {
            vec3 normal = calcNormal(p);
            vec3 lightPos = vec3(0.0, 0.0, 4.0);
            vec3 lightDir = normalize(lightPos - p);
            float diff = max(0.0, dot(normal, lightDir));
            col = vec3(diff);


            hit = true;
            break;
        }
        
        if(t > 100.0) {
            break;
        }
        
        t += d;
    }
    
   
    vec3 finalColor;
    if (hit) {
        vec3 fogColor = vec3(0.0, 0.0, 0.1);
        float fogAmount = 1.0 - exp(-t * 0.05);
        finalColor = mix(col, fogColor, fogAmount);
    } else {
        vec3 topColor = vec3(0.31, 0.52, 0.04);
        vec3 bottomColor = vec3(0.8, 0.715, 0.27);
        
        float switcher = mod(floor(iTime / 2.0), 2.0);
        float coord = mix(uv.y, uv.x, switcher);
        
        finalColor += mix(bottomColor, topColor, coord * 0.5 + 0.75*cos(iTime * 0.25));
    }
    
    gl_FragColor = vec4 (finalColor, 1.0);
}
