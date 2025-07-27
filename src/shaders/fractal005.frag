uniform float iTime;
uniform vec3 iResolution;


#define MAX_ITERATIONS 100
#define LOOP_DURATION 10.0

void main() {
    float time = mod(iTime, LOOP_DURATION);
    
    vec2 zoomCenter = vec2(-0.745, -.186);
    //float zoom = pow(0.5, iTime);
    
    float pathRadius = 0.015 * sin(iTime * 0.1);
    zoomCenter += vec2(cos(iTime * 0.2), sin(iTime * 0.23)) * pathRadius;
    float zoom = pow(0.5, time * 0.75);
    
    //vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    
    vec2 uv = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y * zoom + zoomCenter;
    
    //vec2 c = vec2(-0.5, 0.0) + uv * 1.0;
    vec2 c = uv;
    vec2 z = vec2(0.0);
    
    float color = 0.0;

    for(int i = 0; i < MAX_ITERATIONS; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        
        
        if(dot(z, z) > 4.0) {
            
            //color = 1.0; 
            color = float(i)-log2(log2(dot(z,z))) + 4.0;
            break;
        }
    }
    color = 0.01 * color;
    //fragColor = vec4(vec3(color), 1.0);
    gl_FragColor = vec4(0.5 + 0.5 * cos(3.0 + color*vec3(0,3,6)), 1.0);
}
