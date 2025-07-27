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
    
    // distortion
    float frequency = 25.0;
    float amplitude = 0.1;
    p.x += sin(p.y * frequency) * amplitude;
    p.z += cos(p.y * frequency) * amplitude;
    
    
    
    return sdTorus(p, vec2(1.0, 0.175));
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

float calcShadow(vec3 p, vec3 lightDir) {
    float t = 0.01;
    float res = 1.0;

    for (int i = 0; i < 50; i++) {
        float d = map(p + lightDir * t);
        if (d < 0.001) {
            return 0.3;
        }
        t += d;
        if (t > 10.0) break;
    }
    return res;
}


float calcSoftShadow(vec3 ro, vec3 rd, float k) {
    float res = 1.0;
    float t = 0.01;
    for (int i=0; i<64; i++) {
        float h = map(ro + rd * t);
        if (h < 0.001) {
            return 0.0;
        }
        res = min(res, k * h / t);
        t += h;
        if (t > 50.0) {
            break;
        }
    }
    return clamp(res, 0.0, 1.0);
}


void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(3.5 * sin(iTime * 0.1), 1.0, 3.5 * cos(iTime * 0.1));
    vec3 target = vec3(0.0, 0.0, 0.0);
    vec3 ww = normalize(target - ro);
    vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
    vec3 vv = cross(uu, ww);
    float fov = 1.5;
    vec3 rd = normalize(uv.x*uu + uv.y*vv + fov*ww);

    vec3 col = vec3(0.0);
    float t = 0.0;

    float transmittance = 1.0;
    
    float lightRadius = 4.0;
    float lightSpeed = 0.5;
    vec3 lightPos = vec3(lightRadius * sin(iTime * lightSpeed), 3.0, lightRadius * cos(iTime * lightSpeed));
    
    float fogDensity = 0.35;

    for (int i=0; i<180; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);

        if (d < 0.001) {
            vec3 normal = calcNormal(p);
            vec3 lightDir = normalize(lightPos - p);
            
            vec3 baseColor = vec3(1.0, 0.78, 0.55);
            vec3 glazeColor = vec3(1.0);
            float facingUp = smoothstep(0.2, 0.7, normal.y);
            vec3 materialColor = mix(baseColor, glazeColor, facingUp * 0.6);
            float shininess = mix(24.0, 128.0, facingUp);
            float shadow = calcSoftShadow(p, lightDir, 16.0);
            float diff = max(0.0, dot(normal, lightDir));
            float ambient = 0.2;
            vec3 viewDir = normalize(ro - p);
            vec3 reflectDir = reflect(-lightDir, normal);
            float spec_dot = max(0.0, dot(viewDir, reflectDir));
            float spec = pow(spec_dot, shininess);
            vec3 highlightColor = vec3(1.0);
            
            vec3 surfaceColor = materialColor * (diff * shadow + ambient) + highlightColor * spec * shadow;

            col += surfaceColor * transmittance;
            break; 
        }
        
        float lightAmount = calcSoftShadow(p, normalize(lightPos - p), 16.0);
        
        vec3 scatteredLight = vec3(0.105) * lightAmount;

        float stepSize = max(d * 0.5, 0.02);
        
        col += scatteredLight * transmittance * stepSize * fogDensity;
        
        transmittance *= exp(-stepSize * fogDensity);

        if (t > 100.0 || transmittance < 0.01) {
            break;
        }
        t += stepSize;
    }

    col = pow(col, vec3(1.0/2.2));
    gl_FragColor = vec4(col, 1.0);
}
