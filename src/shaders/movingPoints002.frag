uniform float iTime;
uniform vec3 iResolution;

vec2 get_point_position(float i, float t) {
    float x = i;
    float y = i / 235.0;

    float k = (4.0 + sin(x / 11.0 + t * 8.0)) * cos(x / 14.0);
    float e = y / 6.0 - 19.0;
    float d = length(vec2(k, e)) + sin(y / 9.0 + t * 2.0);
    float c = d * d / 49.0 - t;
    float q = 5.0 * sin(k * 2.0) + sin(y / 17.0) * k * (9.0 + 2.0 * sin(y - d * 3.0));
    
    float px = q + 100.0 * cos(c) + 200.0;
    float py = q * sin(c) + d * 39.0 - 400.0;
    
    return vec2(px, py) / 400.0;
}

vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0*l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h*6.0, 2.0) - 1.0));
    float m = l - c/2.0;
    vec3 rgb;

    if (h < 1.0/6.0) rgb = vec3(c, x, 0.0);
    else if (h < 2.0/6.0) rgb = vec3(x, c, 0.0);
    else if (h < 3.0/6.0) rgb = vec3(0.0, c, x);
    else if (h < 4.0/6.0) rgb = vec3(0.0, x, c);
    else if (h < 5.0/6.0) rgb = vec3(x, 0.0, c);
    else rgb = vec3(c, 0.5, x);

    return rgb + m;
}

void main() {
   
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    
    float t = iTime * 0.8;
    vec3 color = vec3(9.0 / 255.0);

    for (float i = 9999.0; i >= 0.0; i -= 2.0) {
        vec2 p = get_point_position(i, t);
        
        p.y = 1.0 - p.y;
        float point_radius = 0.01375;
        float dist_squared = dot(uv - p, uv - p);
        float radius_squared = point_radius * point_radius;
        float intensity = (96.0 / 255.0) * smoothstep(radius_squared, 0.0, dist_squared);
 
        color += intensity;
    }
    
    vec3 additionalCol = hsl2rgb(color.r * abs(cos(iTime * 0.2)), color.g, color.b * abs(sin(iTime * 0.2)));
    color += additionalCol;

    gl_FragColor = vec4(color, 1.0);
}
