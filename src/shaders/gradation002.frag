uniform float iTime;
uniform vec3 iResolution;

void main() {
    //vec2 uv = fragCoord/iResolution.xy;
    
    vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / iResolution.y;
    
    //float d = length(uv);
    
    // black to red (left-> righ)
    vec3 col = vec3(uv.x, 0.0, 0.0);
    
    //vec3 colA = vec3(1.0, 0.0, 0.0);
    //vec3 colB = vec3(0.0, 0.0, 1.0);
    
    vec3 colorA = vec3(1.0, 0.0, 0.0);
    vec3 colorB = vec3(1.0, 1.0 * abs(cos(iTime * 0.4567)), 1.0);
    
    
    float t = (uv.y - uv.x + 1.0) / 2.0;
    t += (uv.y + uv.x) / 2.0;
    col += mix(colorA, colorB, 1.0-t*abs(sin(iTime)));
    //vec3 col = mix(colA, colB, t);
    
    //vec3 col = vec3(1.0 -d);
    
    //float t = smoothstep(0.0, 0.4, d);

    //vec3 col = mix(colorA, colorB, t);

    gl_FragColor = vec4(col,1.0);
}
