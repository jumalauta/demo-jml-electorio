in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);
uniform float threshold;

float rgbToLuminance(vec3 rgb)
{
    /*float c1 = min(rgb.r, min(rgb.g, rgb.b));
    float c2 = max(rgb.r, max(rgb.g, rgb.b));
    return (c2+c1)/2.0; // luminance*/

    return dot(rgb, vec3(0.299, 0.587, 0.114));
}


void main()
{
    vec4 pixel = texture(texture0, texCoord);
    pixel.rgb *= pixel.a;

    if (rgbToLuminance(pixel.rgb) < threshold) {
        pixel.rgba = vec4(0.0, 0.0, 0.0, 0.0);
    }

    fragColor = pixel*color;
}
