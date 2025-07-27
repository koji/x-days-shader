uniform float iTime;
uniform vec3 iResolution;


float map(vec3 p) {
    return length(p) - 1.0;
}


vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    // float bass = texture(iChannel0, vec2(0.1, 0.25)).r;
    // float mid = texture(iChannel0, vec2(0.4, 0.25)).r;
    // float high = texture(iChannel0, vec2(0.8, 0.25)).r;
    

    return normalize(
        vec3(
            map(p + e.xyy) - map(p - e.xyy) *0.5,
            map(p + e.yxy) - map(p - e.yxy) / 0.24,
            map(p + e.yyx) - map(p - e.yyx) * 0.5
        )
    );
}


void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    
    float time = iTime * 1.2;
    vec3 ro = vec3(2.5 * cos(time), 1.0, 1.* sin(time)); //camera position
    vec3 ta = vec3(0.0, 0.0, 0.0);
    
    vec3 fwd = normalize(ta - ro);
    vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, fwd);
    vec3 rd = normalize(fwd + uv.x * right + uv.y * up); // Ray Direction

    // Raymarching
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + t * rd;
        float d = map(p);
        if (abs(d) < 0.001 || t > 20.0) break;
        
        t += d * 0.5;
    }

   
    vec3 col = vec3(0.0);
    if (t < 20.0) {
        vec3 pos = ro + t * rd;
        vec3 nor = calcNormal(pos);
        float dif = max(0.0, dot(nor, normalize(vec3(0.5, 1.0, -0.5))));
        col = vec3(0.8, 0.8, 0.6) * dif + vec3(0.1);
    }

    gl_FragColor = vec4(col, 1.0);
}
