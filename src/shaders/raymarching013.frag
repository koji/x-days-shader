uniform float iTime;
uniform vec3 iResolution;


float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q) - t.y;
}
float map(vec3 p) {
    float angle = iTime;
    float s = sin(angle);
    float c = cos(angle);
    mat2 rotationMatrix = mat2(c, -s, s, c);
    p.xz = rotationMatrix * p.xz;
    return sdTorus(p, vec2(1.0, 0.4));
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
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    vec3 ro = vec3(0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv, -1.5));
    float t = 0.0;
    vec3 col = vec3(0.0);
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if (d < 0.001) {
            vec3 normal = calcNormal(p);
            float t = tan(angle * 8.0 + iTime);
            float r = tan(radius * 5.0 - iTime);
            col = normal * 0.5 + vec3(fract(t) * fract(r));;
            
            break;
        }
        
        if (t > 100.0) break;
        t += d;
    }
    
    gl_FragColor = vec4(col, 1.0);
}
