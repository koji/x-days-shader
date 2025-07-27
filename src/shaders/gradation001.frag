uniform float iTime;
uniform vec3 iResolution;

void main() {
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    float d = length(uv);
    
    
    vec3 colors[8];
    colors[0] = vec3(1.0, 0.0, 0.0); // 0: red
    colors[1] = vec3(1.0, 0.5, 0.0); // 1: orange
    colors[2] = vec3(1.0, 1.0, 0.0); // 2: yellow
    colors[3] = vec3(0.0, 1.0, 0.0); // 3: green
    colors[4] = vec3(0.0, 0.0, 1.0); // 4: blue
    colors[5] = vec3(0.2, 0.0, 0.5); // 5: indigo
    colors[6] = vec3(0.5, 0.0, 1.0); // 6: purple
    colors[7] = vec3(0.0, 0.0, 0.0); // 7: black
    
    float max_dist = 0.5;
    
    float pal_idx_f = clamp(d/max_dist, 0.0 , 1.0) * 7.0;
    
    int index0 = int(floor(pal_idx_f));
    int index1 = min(index0 + 1, 6);
    
    float t = fract(pal_idx_f) * abs(sin(iTime * 0.5));
    
    vec3 colorA = colors[index0];
    vec3 colorB = colors[index1];
    
    vec3 col = mix(colorA, colorB, t);

    gl_FragColor = vec4(col,1.0);
}
