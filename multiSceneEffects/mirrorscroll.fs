in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);
uniform float time;
uniform vec2 mirrorSpeed;

void main()
{
	vec2 uv = texCoord*vec2(2.0,2.0)-vec2(0.5,0.5);
    uv*=2.0;
    uv.x += step(uv.x, 1.0) * (1.0-uv.x) * 2.0;
    uv.y += step(uv.y, 1.0) * (1.0-uv.y) * 2.0;
    
	float t = time;
    uv.x -= t * mirrorSpeed.x;
    uv.y -= t * mirrorSpeed.y;
    
    uv.x = mod(uv.x, 1.0);
    uv.y = mod(uv.y, 1.0);
    
    fragColor = texture(texture0, uv) * color;
}