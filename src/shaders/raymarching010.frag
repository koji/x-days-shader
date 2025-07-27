uniform float iTime;
uniform vec3 iResolution;


#define DELTA_HIT_THRESHOLD  0.0001   
#define RAY_LENGTH_MAX       100.0  
#define RAY_STEP_MAX         512 
#define AMBIENT_LIGHT_FACTOR 0.3
#define DIFFUSE_LIGHT_FACTOR 0.7


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
/**
float sdOctahedron(vec3 p, float s) {
    return (abs(p.x) + abs(p.y) + abs(p.z)) - s;
}
*/


// the code I referred to
// https://www.shadertoy.com/view/wsSGDG

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

void main() {
    
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;

    
    vec3 ro = vec3(0.0, 0.0, -2.5); 
    vec3 rd = normalize(vec3(uv, 1.0));

    // 背景色の設定
    vec3 lightDir = normalize(vec3(0.5, 1.0, -1.0));
    vec3 lightColor = vec3(1.0, 1.0, 1.0);

    vec3 backgroundColor = vec3(0.8, 0.8, 0.8);
    
    vec3 litBackgroundColor = backgroundColor * (0.5 + 0.5 * max(0.0, dot(normalize(-rd), lightDir)));

    
    vec3 hitPos;
    int objID;
    float dist = rayMarch(ro, rd, RAY_LENGTH_MAX, RAY_STEP_MAX, hitPos, objID);

    vec3 finalColor;

    if (dist < RAY_LENGTH_MAX) {
        vec3 normal = calcNormal(hitPos);
        
        
        vec3 animatedFaceColor = vec3(0.0);
        
        if (abs(normal.x) > abs(normal.y) && abs(normal.x) > abs(normal.z)) {
           
            animatedFaceColor = vec3(sin(iTime * 1.0) * 0.5 + 0.5, cos(iTime * 0.7) * 0.5 + 0.5, 0.2);
        }
        else if (abs(normal.y) > abs(normal.x) && abs(normal.y) > abs(normal.z)) {
            
            animatedFaceColor = vec3(0.2, sin(iTime * 0.8) * 0.5 + 0.5, cos(iTime * 1.2) * 0.5 + 0.5);
        }
        else if (abs(normal.z) > abs(normal.x) && abs(normal.z) > abs(normal.y)) {
            
            animatedFaceColor = vec3(cos(iTime * 0.9) * 0.5 + 0.5, 0.2, sin(iTime * 1.1) * 0.5 + 0.5);
        }
        else {
            
            animatedFaceColor = vec3(1.0);
        }

        finalColor = animatedFaceColor * lightColor * (AMBIENT_LIGHT_FACTOR + DIFFUSE_LIGHT_FACTOR * max(0.0, dot(normal, lightDir))); 
        
    } else {
        finalColor = litBackgroundColor;
    }

    gl_FragColor = vec4(finalColor, 1.0);
}
