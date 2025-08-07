uniform float iTime;
uniform vec3 iResolution;

// rotate the cube
mat2 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

// SDF
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, vec3(0.0))) + min(0.0, max(q.x, max(q.y, q.z)));
}

// Noise functions
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float v000 = hash(i.xy + vec2(0, 0));
    float v100 = hash(i.xy + vec2(1, 0));
    float v010 = hash(i.xy + vec2(0, 1));
    float v110 = hash(i.xy + vec2(1, 1));
    
    float v001 = hash(i.xy + vec2(0, 0) + i.z * 0.1);
    float v101 = hash(i.xy + vec2(1, 0) + i.z * 0.1);
    float v011 = hash(i.xy + vec2(0, 1) + i.z * 0.1);
    float v111 = hash(i.xy + vec2(1, 1) + i.z * 0.1);

    float b00 = mix(v000, v100, f.x);
    float b10 = mix(v010, v110, f.x);
    float b01 = mix(v001, v101, f.x);
    float b11 = mix(v011, v111, f.x);
    
    float c0 = mix(b00, b10, f.y);
    float c1 = mix(b01, b11, f.y);
    
    return mix(c0, c1, f.z);
}

float spikes(vec3 p) {
    float spike_freq = 18.0 * cos(iTime) + 18.0;
    float noise_scale = 1.5;
    
    float noise_val = noise(p * noise_scale);
    float min_amp = 0.1;
    float max_amp = 1.0;
    float spike_amp = min_amp + noise_val * (max_amp - min_amp);
    
    vec3 q = p * spike_freq;
    float wave = sin(q.x) * sin(q.y) * sin(q.z);
    float wave_sign = sign(wave);
    float sharp_wave = pow(abs(wave), 18.0);
    //sharp_wave *= wave_sign;
    
    return (sharp_wave + cos(iTime)) * spike_amp;
}

// Main SDF
float map(vec3 p, out int out_id) {
    
    vec3 rotatedP = p;
    
    mat2 rotY = rotateZ(iTime * 0.75);
    rotatedP.xz = vec2(p.x * rotY[0].x + p.z * rotY[0].y, p.x * rotY[1].x + p.z * rotY[1].y);
    
    mat2 rotX = rotateZ(iTime * 0.3);
    rotatedP.yz = vec2(rotatedP.y * rotX[0].x + rotatedP.z * rotX[0].y, rotatedP.y * rotX[1].x + rotatedP.z * rotX[1].y);

    float distBox = sdBox(rotatedP, vec3(1.0));
    out_id = 0;
    float spikes = spikes(rotatedP);
    distBox -= spikes;
    return distBox;
}

// Normal calculation
vec3 calcNormal(vec3 p) {
    vec2 eps = vec2(0.001, 0.0);
    int id;
    return normalize(vec3(
        map(p + eps.xyy, id) - map(p - eps.xyy, id),
        map(p + eps.yxy, id) - map(p - eps.yxy, id),
        map(p + eps.yyx, id) - map(p - eps.yyx, id)
    ));
}

// Ray marching
float rayMarch(vec3 ro, vec3 rd, float maxDist, int maxSteps, out vec3 out_hitPos, out int out_objID) {
    float dist = 0.0;
    out_objID = -1; // not detected
    for (int i = 0; i < maxSteps; ++i) {
        vec3 p = ro + rd * dist;
        int currentObjID;
        float d = map(p, currentObjID);
        if (d < 0.001) {
            out_hitPos = p;
            out_objID = currentObjID;
            return dist;
        }
        dist += d;
        if (dist > maxDist) {
            break;
        }
    }
    return maxDist;
}

// Main image function
void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;
    
    vec3 ro = vec3(0.0, 0.0, -5.0);
    vec3 rd = normalize(vec3(uv, 1.0));

    vec3 hitPos;
    int objID;
    float dist = rayMarch(ro, rd, 100.0, 100, hitPos, objID);

    vec3 finalColor = vec3(0.0);

    if (dist < 100.0) {
        vec3 normal = calcNormal(hitPos);
        vec3 faceColor = vec3(0.0);

        if (abs(normal.x) > abs(normal.y) && abs(normal.x) > abs(normal.z)) {
            faceColor = vec3(sin(iTime * 1.0) * 0.5 + 0.5, cos(iTime * 0.7) * 0.5 + 0.5, 0.2);
        }
        else if (abs(normal.y) > abs(normal.x) && abs(normal.y) > abs(normal.z)) {
            faceColor = vec3(0.2, sin(iTime * 0.8) * 0.5 + 0.5, cos(iTime * 1.2) * 0.5 + 0.5);
        }
        else if (abs(normal.z) > abs(normal.x) && abs(normal.z) > abs(normal.y)) {
            faceColor = vec3(cos(iTime * 0.9) * 0.5 + 0.5, 0.2, sin(iTime * 1.1) * 0.5 + 0.5);
        }
        else {
            faceColor = vec3(0.5);
        }

        // Lighting
        vec3 lightDir = normalize(vec3(0.5, 1.0, -1.0));
        vec3 viewDir = normalize(ro - hitPos);

        // Diffuse
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuseColor = faceColor * (0.63 + 0.7 * diff);

        // Specular
        float shininess = 32.0;
        float specularStrength = 0.7;
        vec3 reflectDir = reflect(-lightDir, normal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), shininess);
        vec3 specularColor = vec3(1.0) * spec * specularStrength;

        // Final color
        finalColor = diffuseColor + specularColor;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
