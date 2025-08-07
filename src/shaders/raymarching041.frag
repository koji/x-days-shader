uniform float iTime;
uniform vec3 iResolution;


mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c,   -s,
        0.0, s,   c
    );
}


mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        c,   0.0, s,
        0.0, 1.0, 0.0,
        -s,  0.0, c
    );
}

float spikes(vec3 p) {
    float spike_freq = 5.0 * tan(iTime) + 8.0;
    float spike_amp = 0.315;
    vec3 q = p * spike_freq;
    return (sin(q.x) * sin(q.y) * sin(q.z) + cos(iTime)) * spike_amp;
}


// the code I referred to
// https://www.shadertoy.com/view/wsSGDG    return (abs(p.x) + abs(p.y) + abs(p.z)) - s;


float sdOctahedron(vec3 p, float s)
{
    p = abs(p);
    float m = p.x + p.y + p.z - s;
    vec3 r = 3.0*p - m;
    
    vec3 q;
    if( r.x < 0.0 ) q = p.xyz;
    else if( r.y < 0.0 ) q = p.yzx;
    else if( r.z < 0.0 ) q = p.zxy;
    else return m*0.57735027;
    
    float k = clamp(0.5*(q.z-q.y+s),0.0,s);
    return length(vec3(q.x,q.y-s+k,q.z-k));
}


// sdf
// out_id for the future usage
float map(vec3 p, out int out_id) {
    
    mat3 invRotX = rotateX(-(iTime * 0.3));
    mat3 invRotY = rotateY(-(iTime * 0.75)); 

    vec3 transformedP = invRotY * invRotX * p;

    float distOctahedron = sdOctahedron(transformedP, 1.0);
    out_id = 0; 
    float spike_amp = 0.15;
    float spikes = spikes(p);
    distOctahedron -= spikes;
    return distOctahedron;
}


vec3 calcAnalyticNormalOctahedron(vec3 p) {
    return normalize(sign(p));
}


vec3 calcNormal(vec3 p) {
    
    mat3 invRotX = rotateX(-(iTime * 0.3));
    mat3 invRotY = rotateY(-(iTime * 0.75));
    vec3 localP = invRotY * invRotX * p; 

    
    vec3 localNormal = normalize(sign(localP));

    mat3 currentRotX = rotateX(iTime * 0.3);
    mat3 currentRotY = rotateY(iTime * 0.75);
    vec3 worldNormal = normalize(currentRotY * currentRotX * localNormal);

    return worldNormal;
}



float rayMarch(vec3 ro, vec3 rd, float maxDist, int maxSteps, out vec3 out_hitPos, out int out_objID) {
    float dist = 0.0001;
    out_objID = -1;
    for (int i = 0; i < maxSteps; ++i) {
        vec3 p = ro + rd * dist;
        int currentObjID;
        float d = map(p, currentObjID); 

        
        if (d < 0.0001) {
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

void main()
{
   
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    
    vec3 ro = vec3(0.0, 0.0, -2.5);
    vec3 rd = normalize(vec3(uv, 1.0));

    vec3 hitPos;
    int objID;
    //float dist = rayMarch(ro, rd, 100.0, 100, hitPos, objID);
    float dist = rayMarch(ro, rd, 100.0, 256, hitPos, objID);

    vec3 finalColor = vec3(0.8);

    if (dist < 100.0) {
    vec3 normal = calcNormal(hitPos);
    
    vec3 baseFaceColor = vec3(0.0);

    vec3 lightDir = normalize(vec3(0.5, 1.0, -1.0));
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 litFaceColor = baseFaceColor * (0.8 + 0.2 * diff);
    
    vec3 dx = dFdx(normal);
    vec3 dy = dFdy(normal);
    float edgeFactor = length(dx) + length(dy);

    
    float edgeWidth = 0.02;
    float edgeTransition = 0.005;
    
   
    float edgeAlpha = smoothstep(edgeWidth + edgeTransition, edgeWidth - edgeTransition, edgeFactor);
    
    vec3 glowEdgeColor = vec3(
        abs(sin(iTime * 1.5 + 0.0)),
        abs(sin(iTime * 1.8 + 2.0)),
        abs(sin(iTime * 2.1 + 4.0))
    );
    glowEdgeColor *= 1.5;
    finalColor = mix(glowEdgeColor, litFaceColor, edgeAlpha);
}

    gl_FragColor = vec4(finalColor, 1.0);
}
