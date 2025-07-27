uniform float iTime;
uniform vec3 iResolution;

float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

float map(vec3 p) {
    float time = iTime * 0.06;
    p.xy *= mat2(cos(time), -sin(time), sin(time), cos(time));
    p.xz *= mat2(cos(time*0.7), -sin(time*0.7), sin(time*0.7), cos(time*0.7));

    vec3 p_rep = mod(p, 6.0) - 3.0;
    
    return sdOctahedron(p_rep, 1.5);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        map(p + e.xyy) - map(p - e.xyy),
        map(p + e.yxy) - map(p - e.yxy),
        map(p + e.yyx) - map(p - e.yyx)
    ));
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, iTime * 0.75);
    vec3 rd = normalize(vec3(uv, 1.5));
    
    
    float roll = iTime * 0.2;
    rd.xy *= mat2(cos(roll), -sin(roll), sin(roll), cos(roll));

    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) break;
        t += d;
        if (t > 100.0) break;
    }

    vec3 col = vec3(0.0);
    if (t < 100.0) {
        vec3 p = ro + rd * t;
        vec3 normal = getNormal(p);
        
        vec3 color_offset = vec3(1.0, 2.0, 4.0);
        col = normal * 0.5 + 0.5;
        col = cos(col * 3.14 + iTime * 1.5 + color_offset);
    }
    
    
    col = max(col, 0.0);
    col = mix(vec3(0.1), col, 0.9);
    col *= exp(-0.0215 * t);

    gl_FragColor = vec4(col, 1.0);
}
