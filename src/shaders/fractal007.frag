uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

void main()
{
    vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    vec2 m = (iMouse.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    if (iMouse.z <= 0.0) {
        m = vec2(0.0);
    }
    p -= m;

    for(int i = 0; i < 8; ++i) {
        p = abs(p * sin(iTime*0.654) + 0.5) / dot(p, p*abs(sin(iTime * 0.15))) - vec2(0.9 + cos(iTime * 0.2) * 0.4);
    }

    
    gl_FragColor = vec4(p.xyx, 1.0);
   }
