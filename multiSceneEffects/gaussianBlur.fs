in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);
uniform float kwsScale;
uniform float directions; // 16.0
uniform float quality; // 3.0
uniform float size; // 16.0

#define tau 6.28318530718
void main()
{
    vec2 radius = size/vec2(1920., 1080.);
    
    vec4 outColor = texture(texture0, texCoord);
    
    for( float d=0.0; d<tau; d+=tau/directions)
    {
		for(float i=1.0/quality; i<=1.0; i+=1.0/quality)
        {
			outColor += texture( texture0, texCoord+vec2(cos(d),sin(d))*radius*i);		
        }
    }
    // Output to screen
    outColor /= quality * directions - 15.0;
    fragColor =  outColor;
}