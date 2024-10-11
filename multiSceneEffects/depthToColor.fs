in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);

float cubicPulse( float c, float w, float x ) // from https://iquilezles.org/articles/functions/
{
    x = abs(x - c);
    if( x>w ) return 0.0;
    x /= w;
    return 1.0 - x*x*(3.0-2.0*x);
}

float depth(in vec2 uv)
{
    float zNear = 0.1 ;   
    float zFar  = 500.0;
    float depth = texture2D(texture0, uv).x;
    return (4. * zNear) / (zFar + zNear - depth * (zFar - zNear));
}

void main()
{
    float center = 0.4;
    float width = 0.2;
    float c = depth(texCoord);

    fragColor = vec4(1.0-c,1.0-c,1.0-c,1.0);
    
}