uniform float iTime;
uniform vec3 iResolution;

vec2 get_point_position(float i, float t, vec2 canvas_size) {
    float x = i;
    // float y = i / 235.0;
    float y = i * 0.00425532;

    float k = (4.0 + sin(x * 0.0909091 + t * 8.0)) * cos(x * 0.0714286); // 1/11, 1/14
    float e = y * 0.125 - 19.0;
    float d = length(vec2(k, e)) + sin(y * 0.111111 + t * 2.0); // 1/9
    float c = d * d * 0.0204082 - t; // 1/49
    float q = 2.0 * sin(k * 2.0) + sin(y * 0.0588235) * k * (9.0 + 2.0 * sin(y - d * 3.0)); // 1/17

    // Use normalized coordinates and scale to canvas
    float px = (q + 50.0 * cos(c) + 200.0) * (canvas_size.x * 0.0025); // /400
    float py = canvas_size.y - (q * sin(c) + d * 39.0 - 440.0) * (canvas_size.y * 0.0025);

    return vec2(px, py);
}

vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float h6 = h * 6.0;
    float x = c * (1.0 - abs(mod(h6, 2.0) - 1.0));
    float m = l - 0.5 * c;

    vec3 rgb = (h6 < 1.0) ? vec3(c, x, 0.0) :
               (h6 < 2.0) ? vec3(x, c, 0.0) :
               (h6 < 3.0) ? vec3(0.0, c, x) :
               (h6 < 4.0) ? vec3(0.0, x, c) :
               (h6 < 5.0) ? vec3(x, 0.0, c) :
                            vec3(c, 0.5, x);

    return rgb + vec3(m);
}


void main() {
    vec2 canvas_size = iResolution.xy;
    float t = iTime * 0.8;
    float point_radius = 2.0 * min(canvas_size.x, canvas_size.y) * 0.0025; // /400
    vec2 fragCoord = gl_FragCoord.xy;

    vec3 color = vec3(0.0352941); // 9 / 255
    float intensity_scale = 0.37647; // 96 / 255

    for (float i = 9999.0; i >= 0.0; i -= 2.0) {
        vec2 p = get_point_position(i, t, canvas_size);
        float dist = length(fragCoord - p);
        float intensity = intensity_scale * smoothstep(point_radius, 0.0, dist);
        color += intensity;
    }

    float timeMod = abs(cos(iTime * 0.2));
    float timeMod2 = abs(sin(iTime * 0.2));
    vec3 hslCol = hsl2rgb(color.r * timeMod, color.g, color.b * timeMod2);
    color += hslCol;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
