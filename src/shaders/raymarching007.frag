uniform float iTime;
uniform vec3 iResolution;


// rotate the cube
mat2 rotateZ(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}


float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, vec3(0.0))) + min(0.0, max(q.x, max(q.y, q.z)));
}


// sdf
// out_id for the future usage
float map(vec3 p, out int out_id) {
    
    vec3 rotatedP = p;
   
    mat2 rotY = rotateZ(iTime * 0.75);
    rotatedP.xz = vec2(p.x * rotY[0].x + p.z * rotY[0].y, p.x * rotY[1].x + p.z * rotY[1].y);
    
    mat2 rotX = rotateZ(iTime * 0.3);
    rotatedP.yz = vec2(rotatedP.y * rotX[0].x + rotatedP.z * rotX[0].y, rotatedP.y * rotX[1].x + rotatedP.z * rotX[1].y);

    float distBox = sdBox(rotatedP, vec3(1.0));
    out_id = 0;
    return distBox;
}

vec3 calcNormal(vec3 p) {
    vec2 eps = vec2(0.001, 0.0);
    int id;
    return normalize(vec3(
        map(p + eps.xyy, id) - map(p - eps.xyy, id),
        map(p + eps.yxy, id) - map(p - eps.yxy, id),
        map(p + eps.yyx, id) - map(p - eps.yyx, id)
    ));
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


void main()
{
    vec2 uv = (gl_FragCoord.xy - 0.5* iResolution.xy) / min(iResolution.x, iResolution.y);

    
    vec3 ro = vec3(0.0, 0.0, -5.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, 1.0));

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

        vec3 lightDir = normalize(vec3(0.5, 1.0, -1.0));
        float diff = max(dot(normal, lightDir), 0.0);
        finalColor = faceColor * (0.63 + 0.7 * diff);
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
