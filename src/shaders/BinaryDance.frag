uniform float iTime;
uniform vec3 iResolution;

#define FONT_SIZE 30.0;

float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
    vec3 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h ) - r;
}



float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h); // k*h*(1.0-h) for the joint section
}

float map(vec3 p) {
    // --- red pill ---
    vec3 pos1 = vec3(sin(iTime * 0.8) * 1.5, cos(iTime * 0.6), cos(iTime * 0.8) * 1.5);
    float rot_angle1 = iTime * 1.2;
    mat2 rot1 = mat2(cos(rot_angle1), -sin(rot_angle1), sin(rot_angle1), cos(rot_angle1));
    vec3 p_local1 = p - pos1;
    p_local1.xz *= rot1;
    p_local1.xy *= rot1;
    
    float d1 = sdCapsule(p_local1, vec3(-0.5, 0.0, 0.0), vec3(0.5, 0.0, 0.0), 0.25);

    // --- blue pill ---
    vec3 pos2 = vec3(sin(-iTime * 0.7) * 1.5, cos(-iTime * 0.9), cos(-iTime * 0.7) * 1.5);
    float rot_angle2 = iTime * 1.0;
    mat2 rot2 = mat2(cos(rot_angle2), -sin(rot_angle2), sin(rot_angle2), cos(rot_angle2));
    vec3 p_local2 = p - pos2;
    p_local2.yz *= rot2;
    p_local2.yx *= rot2;
    
    float d2 = sdCapsule(p_local2, vec3(0.0, -0.5, 0.0), vec3(0.0, 0.5, 0.0), 0.25);

    return min(d1, d2);
}

float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}


vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}


vec3 color_rain(vec2 ipos) {
    float col_hash = hash(vec3(ipos.x, 0.0, 0.0));
    float speed = 2.0 + col_hash * 18.0;
    float offset = col_hash * 100.0;
    float hue = hash(vec3(ipos.x, 10.0, 0.0));

    float cycle_length = 20.0 + hash(vec3(ipos.x, 1.0, 0.0)) * 30.0;
    float trail_length = 5.0 + hash(vec3(ipos.x, 2.0, 0.0)) * 15.0;

    float y_flow = iTime * speed + offset;
        
    float cycle_pos = mod(ipos.y + y_flow, cycle_length);

    vec3 rain_col = vec3(0.0);

    if (cycle_pos < trail_length) {
        float pos_in_trail = cycle_pos / trail_length;
            
        float cycle_id = floor((ipos.y + y_flow) / cycle_length);
        float char_hash = hash(vec3(ipos.x, cycle_id + ipos.y, 0.0));
        float char_val = fract(char_hash * 314.15);

        float brightness = pow(pos_in_trail, 3.0);
            
        float head_glow = smoothstep(0.9, 1.0, pos_in_trail);
            
        float final_brightness = char_val * brightness;

        vec3 base_color = hsv2rgb(vec3(hue, 1.8, 1.0));
        rain_col = base_color * final_brightness;
        rain_col += vec3(1.0) * head_glow * char_val;
    }
    
    return rain_col;

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

    vec2 st = uv * FONT_SIZE; 
    vec2 ipos = floor(st);
    vec3 rain_col = color_rain(ipos);
    vec3 col =rain_col;
    
    if (t < 20.0) {
        vec3 p = ro + rd * t;
        vec3 n = getNormal(p);

        vec3 pos1 = vec3(sin(iTime * 0.8) * 1.5, cos(iTime * 0.6), cos(iTime * 0.8) * 1.5);
        float rot_angle1 = iTime * 1.2;
        mat2 rot1 = mat2(cos(rot_angle1), -sin(rot_angle1), sin(rot_angle1), cos(rot_angle1));
        vec3 p_local1 = p - pos1;
        p_local1.xz *= rot1;
        p_local1.xy *= rot1;
        float d1 = sdCapsule(p_local1, vec3(-0.5, 0.0, 0.0), vec3(0.5, 0.0, 0.0), 0.25);

        vec3 baseColor;
        if (d1 < 0.002) {
            baseColor = vec3(1.0, 0.1, 0.1);
        } else {
            baseColor = vec3(0.1, 0.4, 1.0);
        }

        // --- lighting ---
        vec3 lightPos = ro;
        vec3 lightDir = normalize(lightPos - p);
        float diffuse = max(0.0, dot(n, lightDir)); 
        
        col = vec3(0.1) + baseColor * diffuse * 0.9; 

        float fresnel = pow(1.0 + dot(rd, n), 4.0);
        col += vec3(1.0) * fresnel * 0.5;
        
        gl_FragColor = vec4(col, 1.0);
        return;
    }
    
    gl_FragColor = vec4(col, 1.0);
}
