in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform vec4 color;// = vec4(1.0, 1.0, 1.0, 1.0);

uniform vec2 direction; // = vec2(1.,0.);
uniform int samples; // = 20;
uniform float spread; // = 0.104;
uniform float intensity; // = 0.08;

vec4 glow()
{
  int showOnlyGlow = 0;
  float alpha = 1.0;

	vec3 sum = vec3(0.,0.,0.);
	vec2 coord = texCoord.st;

	for (int i = 0; i < samples; i++)
	{
    float decay = (1.0-abs(float(i))/float(samples));
    vec2 position = float(i) * direction * spread;
		vec4 tex1 = texture2D(texture0, coord + position);
		vec4 tex2 = texture2D(texture0, coord - position);
    sum += tex1.rgb * tex1.a * decay;
    sum += tex2.rgb * tex2.a * decay;
	}

	if (showOnlyGlow == 0)
	{
		sum += texture2D(texture0, coord).rgb;
	}

	sum *= intensity;
	
	return vec4(sum, alpha);
}

void main()
{
    fragColor = glow();
}
