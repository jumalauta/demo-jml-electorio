in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;
uniform float time;
uniform float fakeTime;
uniform float sScrollScale;
uniform float tiling;
uniform float kolor;
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main()
{
    vec2 coord=texCoord*2.0;
    
    coord.s=coord.s+fakeTime*sScrollScale;
    coord.t=coord.t+fakeTime;
    fragColor = texture2D(texture0, coord);
    vec3 hsv = rgb2hsv(fragColor.rgb)*255.;
    hsv.x = mod(hsv.x + time*255.0 , 256.0);
 
      hsv /= 255.0;
    fragColor.rgb = hsv2rgb(hsv);
}
