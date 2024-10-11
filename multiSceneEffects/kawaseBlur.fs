in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);
uniform float kwsScale;


void main()
{

	vec2 res = vec2(2048, 2048);
    vec3 col = texture( texture0, texCoord + vec2( kwsScale, kwsScale ) / res ).rgb;
    col += texture( texture0, texCoord + vec2( kwsScale, -kwsScale ) / res ).rgb;
    col += texture( texture0, texCoord + vec2( -kwsScale, kwsScale ) / res ).rgb;
    col += texture( texture0, texCoord + vec2( -kwsScale, -kwsScale ) / res ).rgb;
    col /= 4.0;

    fragColor = vec4( col, 1.0 );
}