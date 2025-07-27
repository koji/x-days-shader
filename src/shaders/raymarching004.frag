uniform float iTime;
uniform vec3 iResolution;

float map(vec3 p) {
    float amplitude = 0.25;
    float frequency = 27.0 * sin(iTime * 0.25);
    float speed = 2.0;

    float angle = tan(p.y + p.x * 0.01);
    float dynamic_radius = 1.0 + amplitude * sin(angle * frequency + iTime * speed);

    return length(p) - dynamic_radius;
}

vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.01, 0.1);
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

    vec3 ro = vec3(0.0, 0.0, 2.05); // camera position
    vec3 ta = vec3(0.0, 0.0, 0.0);
    
    vec3 fwd = normalize(ta - ro);
    vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, fwd);
    vec3 rd = normalize(fwd + uv.x * right + uv.y * up);

  
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        vec3 p = ro + t * rd;
        float d = map(p);
        if (abs(d) < 0.001 || t > 20.0) break;
        t += d;
    }

    vec3 col = vec3(0.8, 0.8, 0.8);
    if (t < 20.0) {
        vec3 pos = ro + t * rd;
        vec3 nor = calcNormal(pos);
        vec3 lightDir = normalize(vec3(1.0, 1.0, -1.0));
        float dif = max(0.0, dot(nor, lightDir));
        col = vec3(0.295, 0.487 * abs(sin(iTime * 0.02)), abs(0.9*cos(iTime))) / dif + vec3(0.1);
    }

    gl_FragColor = vec4(col, 1.0);
}
