uniform float iTime;
uniform vec3 iResolution;

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p)-b;
    return length(max(q ,0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)),
              dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}


mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float calcPattern(vec2 uv) {
    float o = 0.0;
    for (float i = 1.0; i <= 20.0; i++) {
        float d;
        vec2 p = uv * i * 3.0;
        p.y += iTime;
        p *= rotate2D(i * 2.4);
        p.x += iTime * sin(ceil(p.y / 8.0) * 2.4) * 5.0;
        p.y = mod(p.y, 8.0) - 4.0;
        p.x = fract(p.x) - 0.5;
        p = p.y < 0.0 ? -p : p;
        p.x -= 0.5;
        d = abs(length(p) - 0.7);
        p.x += 1.0;
        if (d > 0.2) {
            d = abs(length(p) - 0.7);
        }
        if (d < 0.2) {
            o += step(d, 0.15) * exp(-i * i * 0.01);
            break;
        }
    }
    return o;
}

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h); // k*h*(1.0-h) for the joint section
}

float map(vec3 p) {
    float res = 1e9;
    
    for (int i = 0; i < 8; i++) {
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
        p_local.xy *= mat2(cos(rot_angle*0.7), -sin(rot_angle*0.7), sin(rot_angle*0.7), cos(rot_angle*0.7));

        float torus = sdBox(p_local, vec3(0.7));
        res = opSmoothUnion(res, torus, 0.75);
    }
    
    return res;
}

vec3 pattern(vec2 p)
{
    vec4 o = vec4(0.0);
    vec2 U = p.xy * 0.01;
    vec2 I = floor(U);
    float v = 2.0;
    float w = 2.0;
    
    for (int k = 0; k < 9; k++) {
        vec2 neighbor_offset = vec2(k % 3, k / 3) - 1.0;
        vec2 point_pos = 0.5 + 0.5 * sin(iTime + 3.0 * hash(I + neighbor_offset) * vec2(1.0, 5.0));
        vec2 vec_to_point = (I + neighbor_offset + point_pos) - U;
        float d = abs(vec_to_point.x) + abs(vec_to_point.y);

        if (d < v) {
            w = v;
            v = d;
        } else if (d < w) {
            w = d;
        }
    }
    float cell_border = 1.0 - smoothstep(0.02, 0.04, w - v);
    o.yz += cell_border;
    
    return o.xyz;
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
    vec3 col = vec3(0.2);
    
    for (int i=0; i<100; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        
        if(d<0.001) {            
            vec3 materialColor = pattern(gl_FragCoord.xy * 6.4);   
            col = materialColor;

            
            break;
        }
        
        if(t>100.0) {
            break;
        }
        
        t+= d;
    }
        
    
    gl_FragColor = vec4(col, 1.0);
}
