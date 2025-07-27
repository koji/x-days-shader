/******************************************************************************
 * Simplified moving points shader
 * 
 ******************************************************************************/
uniform float iTime;
uniform vec3 iResolution;

void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 canvas_size = iResolution.xy;
    float t = iTime * 0.8;

    vec3 color = vec3(0.0);

    // Simplified point generation - fewer points, simpler math
    for (float i = 0.0; i < 100.0; i += 1.0) {
        // Simple circular motion for each point
        float angle = i * 0.1 + t * 2.0;
        float radius = 0.3 + 0.1 * sin(i * 0.5 + t);
        
        vec2 point_pos = vec2(0.5 + radius * cos(angle), 0.5 + radius * sin(angle));
        point_pos *= canvas_size; // Scale to canvas coordinates
        
        float dist = length(gl_FragCoord.xy - point_pos);
        float point_radius = 20.0; // Fixed radius in pixels
        float intensity = smoothstep(point_radius, 0.0, dist);
        
        // Color variation based on point index and time
        vec3 point_color = vec3(
            0.5 + 0.5 * sin(i * 0.1 + t),
            0.5 + 0.5 * sin(i * 0.1 + t + 2.0),
            0.5 + 0.5 * sin(i * 0.1 + t + 4.0)
        );
        
        color += point_color * intensity * 0.5;
    }

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
} 
