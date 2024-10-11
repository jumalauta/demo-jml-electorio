in vec2 texCoord;
out vec4 fragColor;
uniform vec4 color;
uniform float timePercent;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform float fftShift;
uniform float mixShift;
uniform float time;
uniform float timeMultiplier;
uniform float noiseWaveSpeed;
uniform float noiseWaveSize;
uniform float noiseLuminance;
uniform float noiseAlpha;
uniform vec4 colorComponentDistortionX;
uniform vec4 colorComponentDistortionY;
uniform vec2 pixelSize;

vec2 pixelate(vec2 coord)
{
	vec2 canvasSize = vec2(1920.,1080.);
	vec2 d = vec2(1.0,1.0)/(canvasSize*pixelSize);
	coord.s = floor(coord.s/d.s)*d.s;
	coord.t = floor(coord.t/d.t)*d.t;
	return coord;	
}


float rand(vec2 coord)
{
	return fract(sin(dot(coord.st,vec2(12.9898,78.233)+time*timeMultiplier)) * 43758.5453);
}

vec2 coordDistortion(vec2 coord, vec2 strength)
{
	vec2 randCoord = pixelate(coord);

	coord.s += rand(vec2(randCoord.t,0.))*strength.s-strength.s/2.;
	coord.t += rand(vec2(0.,randCoord.s))*strength.t-strength.t/2.;
	return coord;	
}

vec4 rgbaDistortion(sampler2D texture0, vec2 texCoord, vec4 colorComponentDistortionX, vec4 colorComponentDistortionY)
{
	vec2 texCoordR = coordDistortion(texCoord, vec2(colorComponentDistortionX.r, colorComponentDistortionY.r));
	vec2 texCoordG = coordDistortion(texCoord, vec2(colorComponentDistortionX.g, colorComponentDistortionY.g));
	vec2 texCoordB = coordDistortion(texCoord, vec2(colorComponentDistortionX.b, colorComponentDistortionY.b));
	vec2 texCoordA = coordDistortion(texCoord, vec2(colorComponentDistortionX.a, colorComponentDistortionY.a));

	return vec4(texture(texture0, texCoordR).r, texture(texture0, texCoordG).g, texture(texture0, texCoordB).b, texture(texture0, texCoordA).a);
}

void main()
{
	vec2 texCoord = texCoord.st;

  vec2 fftCoord = texCoord.xy;
  fftCoord.x = timePercent;

	vec4 fftColor = mix(clamp(vec4(1.0-texture(texture1, fftCoord).r) * 4.0, vec4(0.0), vec4(1.0)), vec4(1.0), vec4(fftShift));
	fragColor = fftColor;

	float noiseWave = ((sin(noiseWaveSpeed*time+texCoord.t*noiseWaveSize)+1.)/2.);
	float n = (rand(texCoord)*(noiseAlpha*noiseWave))*noiseLuminance;
	vec4 noise = vec4(n,n,n,1.);

	vec4 uv = rgbaDistortion(texture0, texCoord, colorComponentDistortionX, colorComponentDistortionY);
	vec4 finalColor = uv * color * fftColor + noise;	

	fragColor = mix(finalColor, texture(texture0,texCoord.st), vec4(mixShift));
	if (mixShift >= 1.0) {
		fragColor = texture(texture0,texCoord.st);
	}
}

