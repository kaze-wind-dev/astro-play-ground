// #ifdef GL_ES
// precision mediump float;

// #endif

// uniform float u_time;

// vec4 color = vec4(vec3(1.0,0.0,1.0),1.0);

// void main() {
// 	// gl_FragColor = vec4(1.0,0.0,1.0,1.0);
// 	gl_FragColor = red();   // ERROR
// }


#ifdef GL_ES
precision mediump float;
#endif

// uniform float u_time;
// uniform float u_mouse;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
	  vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 mouse = u_mouse / u_resolution;
	// gl_FragColor = vec4(abs(sin(u_time)), abs(cos(u_time)),1,0);
	float d = distance(st, mouse);
	float pulse = 0.5 + 0.5 * sin(u_time * 3.0 - d * 20.0);
	gl_FragColor = vec4(st.x * pulse, st.y * pulse, d, 1.0);
}