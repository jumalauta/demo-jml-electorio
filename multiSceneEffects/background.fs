in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
#define M_PI 3.1415926535897932384626433832795
uniform float kaleidoscopeXangle;
uniform vec2 coordBias;
uniform float time;
uniform float speed;
uniform vec4 color;
uniform vec2 scale;// = vec2(5.,5.);
uniform vec2 coordBias2;
uniform float angle; // = 0.46;
uniform float zoom; // = 2.0;
uniform vec2 mirrorSpeed;
uniform float chainEffect0;
uniform float chainEffect1;
uniform float chainEffect2;
uniform float chainEffect3;
uniform float chainEffect4;
uniform float chainEffect5;
uniform float chainEffect6;
uniform float chainEffect7;
uniform float chainEffect8;
uniform float chainEffect9;

vec2 centerize(vec2 coord) {
    return (2.0 * coord - 1.0);
}

vec2 kaleidoscope(vec2 coord) {
    coord.x = mod(coord.x, 1.0);
    coord.y = mod(coord.y, 1.0);
    coord = centerize(coord);
    float angle = M_PI / kaleidoscopeXangle;

    float a = abs(mod(atan(coord.s,coord.t),angle*2.0)-angle);
    float dist = length(coord);
    coord.s = sin(a)*dist;
    coord.t = cos(a)*dist;
    return coord;
}

vec2 deform(vec2 coord) {
    coord = centerize(coord);
	float x = coord.x;
	float y = coord.y;
	float u = sqrt( x*x + y*y );
	float v = atan( y, x );

	coord.x = 0.02*y+0.03*cos(v*3.)/u;
	coord.y = 0.02*x+0.03*sin(v*3.)/u;

    return coord;
}

vec2 coordinateBias(vec2 coord, vec2 bias) {
    coord += bias;
    coord.x = mod(coord.x, 1.0);
    coord.y = mod(coord.y, 1.0);
    return coord;
}


vec2 rotozoom(vec2 coord)
{
    coord = centerize(coord);
	float x = coord.x;
	float y = coord.y;
	float dist = sqrt(x*x + y*y);

	coord.x = (x*cos(angle) - y*sin(angle)) * zoom;
	coord.y = (y*cos(angle) + x*sin(angle)) * zoom;

	return coord;
}

vec2 tunnel(vec2 coord)
{
	coord.x += sin(time*speed)*0.2;
	coord.y += cos(time*speed*0.8)*0.2;
    coord = centerize(coord);
	float x = coord.x;
	float y = coord.y;
	float u = sqrt(x*x + y*y);
	float v = atan(y, x);

	coord.x = cos(v+time*speed)/u+sin(time*speed)*0.2;
	coord.y = sin(v+time*speed)/u+cos(time*speed)*0.2;

    return coord;
}

#define M_PI 3.1415926535897932384626433832795

vec2 plasmaDeform(vec2 coord)
{
    coord *= scale;
    coord+=sin(coord.x+time*speed)*0.3;
    coord+=cos(coord.y+time*speed)*0.8;
    coord-=sin(coord.x+coord.y+time*speed);
    coord += vec2(sin(coord.x+time*speed*2.), cos(coord.y+time*speed*3.));
    coord -= sin(sqrt(coord.x*10.+coord.x*coord.x+coord.y*coord.y)+time*speed);
    coord *= cos(M_PI*1.4);

    coord.x = mod(coord.x, 1.0);
    coord.y = mod(coord.y, 1.0);

    return coord;
}

vec2 mirrorScroll(vec2 coord)
{
	vec2 uv = coord*vec2(2.0,2.0)-vec2(0.5,0.5);
    uv.x += step(uv.x, 0.5) * (0.5-uv.x) * 2.0;
    uv.y += step(uv.y, 0.5) * (0.5-uv.y) * 2.0;
    
	float t = time;
    uv.x -= t * mirrorSpeed.x;
    uv.y -= t * mirrorSpeed.y;
    
    uv.x = mod(uv.x, 1.0);
    uv.y = mod(uv.y, 1.0);

    return uv;
}


vec2 processEffect(vec2 coord, float value) {
    if (value >= 1.) {
        float effect = floor(value);
        float mixValue = 1.0 - fract(value);
        vec2 coord2 = vec2(0.);
        if (effect == 1.) {
            coord2 = coordinateBias(coord, coordBias);
        } else if (effect == 2.) {
            coord2 = coordinateBias(coord, coordBias2);
        } else if (effect == 3.) {
            coord2 = kaleidoscope(coord);
        } else if (effect == 4.) {
            coord2 = deform(coord);
        } else if (effect == 5.) {
            coord2 = rotozoom(coord);
        } else if (effect == 6.) {
            coord2 = tunnel(coord);
        } else if (effect == 7.) {
            coord2 = plasmaDeform(coord);
        } else if (effect == 8.) {
            coord2 = mirrorScroll(coord);
        }

        coord = mix(coord, coord2, mixValue);
    }

    return coord;
}

void main()
{
    vec2 coord = texCoord;

    coord = processEffect(coord, chainEffect0);
    coord = processEffect(coord, chainEffect1);
    coord = processEffect(coord, chainEffect2);
    coord = processEffect(coord, chainEffect3);
    coord = processEffect(coord, chainEffect4);
    coord = processEffect(coord, chainEffect5);
    coord = processEffect(coord, chainEffect6);
    coord = processEffect(coord, chainEffect7);
    coord = processEffect(coord, chainEffect8);
    coord = processEffect(coord, chainEffect9);

    fragColor = texture(texture0, coord) * color;
}
