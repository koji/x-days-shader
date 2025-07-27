/** the original shader
*   Tunnel of Lights
*   https://www.shadertoy.com/view/w3KGRK
*
**/
uniform float iTime;
uniform vec3 iResolution;

float sdf(in vec3 pos){
    pos = mod(pos, 10.);
    return length(pos - vec3(5.)) - 1.;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy * 2. - iResolution.xy)/max(iResolution.x, iResolution.y);

    vec3 origin = vec3(0.0, iTime * 1.75, 0.0);
    float angle = radians(iTime*3.);
    uv *= mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    
    vec3 ray_dir = vec3(sin(uv.x), cos(uv.x)*cos(uv.y), sin(uv.y));
    vec3 ray_pos = vec3(origin);
    
    float ray_length = 0.;
    
    for(float i = 0.; i < 8.; i++){
        float dist = sdf(ray_pos);
        ray_length += dist;
        ray_pos += ray_dir * dist;
        ray_dir = normalize(ray_dir + vec3(uv.x, 0., uv.y) * dist * 0.3);
    }
    
    
    vec3 o = vec3(sdf(ray_pos));
    o = cos(o + ray_pos * 0.25 + vec3(6.0,0.0,0.5));
    o *= smoothstep(50.0, 20.5, ray_length);

    gl_FragColor = vec4(o, 1.);
}
