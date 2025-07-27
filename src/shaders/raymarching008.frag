uniform float iTime;
uniform vec3 iResolution;

// rotate the cube
mat2 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}



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

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, vec3(0.0))) + min(0.0, max(q.x, max(q.y, q.z)));
}


// sdOctahedron(p,s)=(abs(p.x)+abs(p.y)+abs(p.z))−s
float sdOctahedron(vec3 p, float s) {
    return (abs(p.x) + abs(p.y) + abs(p.z)) - s;
}


// sdf
// out_id for the future usage
float map(vec3 p, out int out_id) {
    
    vec3 rotatedP = p;
   
    //mat2 rotY = rotateZ(iTime * 0.75);
    //rotatedP.xz = vec2(p.x * rotY[0].x + p.z * rotY[0].y, p.x * rotY[1].x + p.z * rotY[1].y);
    
    //mat2 rotX = rotateZ(iTime * 0.3);
    //rotatedP.yz = vec2(rotatedP.y * rotX[0].x + rotatedP.z * rotX[0].y, rotatedP.y * rotX[1].x + rotatedP.z * rotX[1].y);
    
    //rotatedP = rotateX(iTime * 0.3) * rotatedP;
    //rotatedP = rotateY(iTime * 0.75) * rotatedP;

    //float distBox = sdBox(rotatedP, vec3(1.0));
    float distOctahedron = sdOctahedron(rotatedP, 1.0);
    out_id = 0;
    return distOctahedron;
}


vec3 calcAnalyticNormalOctahedron(vec3 p) {
    return normalize(sign(p));
}

vec3 calcNormal(vec3 p) {
    vec2 eps = vec2(0.00001, 0.0);
    int id;
    // inverted mat
    mat3 invRotX = rotateX(-(iTime * 0.3));
    mat3 invRotY = rotateY(-(iTime * 0.75));
    vec3 localP = invRotY * invRotX * p;
    vec3 localNormal = calcAnalyticNormalOctahedron(localP);
    mat3 currentRotX = rotateX(iTime * 0.3);
    mat3 currentRotY = rotateY(iTime * 0.75);
    vec3 worldNormal = normalize(currentRotY * currentRotX * localNormal);

    return worldNormal;
}


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


void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    vec3 ro = vec3(0.0, 0.0, -2.5);
    vec3 rd = normalize(vec3(uv, 1.0));

    vec3 hitPos;
    int objID;
    float dist = rayMarch(ro, rd, 100.0, 100, hitPos, objID);

    vec3 finalColor = vec3(0.0);

    if (dist < 100.0) {
        vec3 normal = calcNormal(hitPos);
        vec3 baseFaceColor = vec3(0.8, 0.8, 0.8);
        vec3 dx = dFdx(normal);
        vec3 dy = dFdy(normal);
        
        float edgeFactor = length(dx) + length(dy);
        float edgeThreshold = 0.005;

        vec3 faceColor = normal * 0.5 + 0.5;

        if (edgeFactor > edgeThreshold) {
        } else {
            vec3 lightDir = normalize(vec3(0.5, 1.0, -1.0));
            float diff = max(dot(normal, lightDir), 0.0);
            finalColor = baseFaceColor * (0.63 + 0.7 * diff);
        }
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
