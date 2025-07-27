uniform float iTime;
uniform vec3 iResolution; 


float sdTorus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q)-t.y;
}


float map(vec3 p) {
    //return sdSphere(p, 1.0);
    // rotate
    float angle = iTime;
    float s = sin(angle);
    float c = cos(angle);
    
    mat2 rotationMatrix = mat2(c, -s ,s ,c);
    p.xz = rotationMatrix * p.xz;
    //p.xy = rotationMatrix * p.xy;
    
    return sdTorus(p, vec2(1.0, 0.4));
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

float calcAO(vec3 p, vec3 n) {
    float total_occlusion = 0.0;
    float step_dist = 0.1;
    for (int i =1; i<=5; i++) {
        vec3 ao_pos = p + n * float(i) * step_dist;
        float dist_from_surface = map(ao_pos);
        float occlusion = max(0.0, (float(i) * step_dist - dist_from_surface));
        total_occlusion += occlusion;
    }
    return clamp(1.0 - total_occlusion * 0.1, 0.0, 1.0);
}

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    
    vec3 ro = vec3 (0.0, 0.0, 3.0);
    vec3 rd = normalize(vec3(uv, -1.5));
    
    float t = 0.0;
    vec3 col = vec3(0.0);
    
    for (int i=0; i<100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d<0.001) {
            vec3 normal = calcNormal(p);
            vec3 lightPos = vec3(2.0, 3.0, 4.0);
            //vec3 lightPos = vec3(3.0, 0.0, 3.0);
            vec3 lightDir = normalize(lightPos - p);
            
            float diff = max(0.0, dot(normal, lightDir));
            
            // ambient light
            float ambient = 0.2;
            //vec3 materialColor = vec3(1.0, 0.0, 0.0);
            //vec3 pureRed = vec3(1.0, 0.0, 0.0);
            //vec3 white = vec3(1.0, 1.0, 1.0);

            //vec3 materialColor = mix(pureRed, white, 0.4);
            
            
            float angle_for_color = atan(p.y, p.x);

            vec3 color1 = vec3(1.0, 0.8, 0.5);
            vec3 color2 = vec3(0.5, 0.8, 1.0);

            vec3 materialColor = mix(color1, color2, sin(angle_for_color * 3.0) * 0.5 + 0.5);
            
            float ao = calcAO(p, normal);
            
            col = materialColor * (diff + ambient) * ao;
            break;
        }
        
        if(t>100.0) {
            break;
        }
        
        t+= d;
    }
    
    gl_FragColor = vec4 (col, 1.0);
    
    
}
