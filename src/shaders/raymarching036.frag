uniform float iTime;
uniform vec3 iResolution;

float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x + p.y + p.z - s) * 0.57735027;
}

float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q)-t.y;
}


float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) -b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}


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



float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h); // k*h*(1.0-h) for the joint section
}

float map(vec3 p) {
    float res = 1e9;
    
    for (int i = 0; i < 60; i++) {
        float fi = float(i);
        float time = iTime * (0.5 + fi * 0.1);
        
        
        vec3 center = vec3(
            sin(time + fi * 1.57),
            cos(time * 0.8 + fi * 2.0),
            sin(time * 1.2 - fi * 1.0)
        ) * 1.5;
        
        vec3 p_local = p - center;
        
        float rot_angle = iTime * (1.0 + fi * 0.3);
        p_local.xz *= mat2(cos(rot_angle), -sin(rot_angle), sin(rot_angle), cos(rot_angle));
        p_local.xy *= mat2(cos(rot_angle * 0.7), -sin(rot_angle * 0.7), sin(rot_angle * 0.7), cos(rot_angle * 0.7));
        
        float shape_dist;
        if(i<20){
            shape_dist = max(sdOctahedron(p_local, 0.7), -sdBox(p_local, vec3(0.2, 0.3, 0.5)));
        } else if(i>=21 && i<35) {
            shape_dist = min(sdTetrahedron(p_local, 0.3), sdBox(p_local, vec3(0.5, 0.4, 0.3)));
        } else {
            shape_dist = max(sdTorus(p_local, vec2(0.3,0.2)), -sdBox(p_local, vec3(0.4, 0.5, 0.25)));
        }

        res = opSmoothUnion(res, shape_dist, 0.75);
    }
    
    return res;
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


    float angle = iTime * 0.15;
    vec3 ro = vec3(sin(angle) * 5.0, 1.5, cos(angle) * 8.0);
    vec3 ta = vec3(0.0, 0.0, 0.0);
    vec3 ww = normalize(ta - ro);
    vec3 uu = normalize(cross(vec3(0.0, 1.0, 0.0), ww));
    vec3 vv = cross(ww, uu);
    vec3 rd = normalize(uv.x * uu + uv.y * vv + 2.0 * ww);

    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001) break;
        t += d;
        if (t > 20.0) break;
    }

    vec3 col = vec3(0.0);
    if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);
        
        vec3 c1 = 0.5 + 0.5 * cos(iTime * 0.8 + vec3(0,1,2));
        vec3 c2 = 0.5 + 0.5 * cos(iTime * 0.5 + vec3(2,0,1));
        col = mix(c1, c2, smoothstep(-1.0, 1.0, n.y));
        
        float fresnel = pow(1.0 + dot(rd, n), 3.0);
        col += vec3(1.0) * fresnel * 0.5;
    }
    
    gl_FragColor = vec4(col, 1.0);
}
