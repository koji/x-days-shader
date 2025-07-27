uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

void main()
{
    // Use mouse position instead of audio input
    vec2 mouse = iMouse.xy / iResolution.xy;
    
    // Create audio-like values from mouse position
    float bass   = mouse.x * 0.5 + 0.5; // Use mouse X for bass
    float mids   = mouse.y * 0.5 + 0.5; // Use mouse Y for mids
    float treble = length(mouse) * 0.5 + 0.5; // Use mouse distance for treble

    
    vec2 p = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
    
    // Apply mouse offset when mouse is clicked
    if (iMouse.z > 0.0) {
        vec2 m = (iMouse.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
        p -= m * 0.5;
    }
    
    
    int iterations = clamp(8 + int(treble * 7.0), 8, 14);
    float angle = bass * 3.14159;
    
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

    
    for(int i = 0; i < iterations; ++i) {
        //p = abs(p * sin(iTime*0.654) + 0.5) / dot(p, p*abs(sin(iTime * 0.15))) - vec2(0.9 + cos(iTime * 0.2) * 0.4);
        p = abs(p) - dot(p, p);
        p -= rot * vec2(0.529 + mids * 0.4);
        //p = abs(p * (bass + 0.85)) / dot(p, p) - vec2(0.9 + mids * 0.5);
    }
    
    vec3 audioTint = vec3(0.45 + treble, 0.5 + mids, 0.35 + bass);
    
    gl_FragColor = vec4(p.yxy * audioTint, 1.0);
   }
