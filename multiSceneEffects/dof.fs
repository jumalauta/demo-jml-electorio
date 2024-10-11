in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);
uniform float dofCenter; // 0.0
uniform float dofWidth; // 0.5
float cubicPulse( float c, float w, float x ) // from https://iquilezles.org/articles/functions/
{
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}


void main()
{

    float c = cubicPulse(dofCenter, dofWidth, 1.0-texture(texture2, texCoord).r);
    vec4 original = texture(texture0, texCoord);
    vec4 blurred = texture(texture1, texCoord);

    fragColor = mix(blurred,original , c);

    //fragColor = vec4(c,c,c,1.0);
}