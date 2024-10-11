precision highp float;

in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D texture0;
uniform sampler2D texture1; // LUT
uniform float exposure; // = 1.0
uniform float exposureBoom; // = 0.0
uniform float postContrast; // = 1.0
uniform float fadeToBlack; // = 0.0
uniform float fadeToWhite; // = 0.0
uniform float lensEffect; // 1.0

vec4 sampleAs3DTexture(sampler2D tex, vec3 uv, float width) {
    uv.y = 1.0 - uv.y; // flip Y

    float innerWidth = width - 1.0;
	float sliceSize = 1.0 / width;              // space of 1 slice
    float slicePixelSize = sliceSize / width;           // space of 1 pixel
    float sliceInnerSize = slicePixelSize * (innerWidth);  // space of width pixels
    float zSlice0 = min(floor(uv.z * width), innerWidth);
    float zSlice1 = min(zSlice0 + 1.0, innerWidth);

    float xOffset = slicePixelSize * 0.5 + uv.x * sliceInnerSize;

    float s0 = xOffset + (zSlice0 * sliceSize);
    float s1 = xOffset + (zSlice1 * sliceSize);

	float yPixelSize = sliceSize;
	float yOffset = yPixelSize * 0.5 + uv.y * (1.0 - yPixelSize);

    vec4 slice0Color = texture2D(tex, vec2(s0, yOffset));
    vec4 slice1Color = texture2D(tex, vec2(s1, yOffset));
    float zOffset = mod(uv.z * width, 1.0);
    vec4 result = mix(slice0Color, slice1Color, zOffset);
    return result;
}

void vignette() {
  float fadeStart = 0.35;
  float fadeEnd = 1.3;
  float fade = smoothstep(fadeStart, fadeEnd, distance(texCoord,vec2(0.5, 0.5)));
  fragColor.a = 1.0 - fade;
}


// ref. https://github.com/mrdoob/three.js/blob/a65145fc9cb9aa46966274e014ed4eeebf6db51c/examples/jsm/shaders/ACESFilmicToneMappingShader.js
/**
 * ACES Filmic Tone Mapping Shader by Stephen Hill
 * source: https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs
 *
 * this implementation of ACES is modified to accommodate a brighter viewing environment.
 * the scale factor of 1/0.6 is subjective. see discussion in #19621.
 */

#define saturate(a) clamp( a, 0.0, 1.0 )

vec3 RRTAndODTFit( vec3 v ) {

  vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
  vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
  return a / b;

}

vec3 ACESFilmicToneMapping( vec3 color ) {

// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT
  const mat3 ACESInputMat = mat3(
    vec3( 0.59719, 0.07600, 0.02840 ), // transposed from source
    vec3( 0.35458, 0.90834, 0.13383 ),
    vec3( 0.04823, 0.01566, 0.83777 )
  );

// ODT_SAT => XYZ => D60_2_D65 => sRGB
  const mat3 ACESOutputMat = mat3(
    vec3(  1.60475, -0.10208, -0.00327 ), // transposed from source
    vec3( -0.53108,  1.10813, -0.07276 ),
    vec3( -0.07367, -0.00605,  1.07602 )
  );

  color = ACESInputMat * color;

// Apply RRT and ODT
  color = RRTAndODTFit( color );

  color = ACESOutputMat * color;

// Clamp to [0, 1]
  return saturate( color );

}
// ref. https://github.com/mrdoob/three.js/blob/a65145fc9cb9aa46966274e014ed4eeebf6db51c/examples/jsm/shaders/FXAAShader.js
/**
 * NVIDIA FXAA by Timothy Lottes
 * https://developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
 * - WebGL port by @supereggbert
 * http://www.glge.org/demos/fxaa/
 * Further improved by Daniel Sturk
 */

// FXAA 3.11 implementation by NVIDIA, ported to WebGL by Agost Biro (biro@archilogic.com)

//----------------------------------------------------------------------------------
// File:        es3-kepler\FXAA\assets\shaders/FXAA_DefaultES.frag
// SDK Version: v3.00
// Email:       gameworks@nvidia.com
// Site:        http://developer.nvidia.com/
//
// Copyright (c) 2014-2015, NVIDIA CORPORATION. All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  * Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer.
//  * Redistributions in binary form must reproduce the above copyright
//    notice, this list of conditions and the following disclaimer in the
//    documentation and/or other materials provided with the distribution.
//  * Neither the name of NVIDIA CORPORATION nor the names of its
//    contributors may be used to endorse or promote products derived
//    from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS ''AS IS'' AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
// EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
// PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//----------------------------------------------------------------------------------

#ifndef FXAA_DISCARD
  //
  // Only valid for PC OpenGL currently.
  // Probably will not work when FXAA_GREEN_AS_LUMA = 1.
  //
  // 1 = Use discard on pixels which don't need AA.
  //     For APIs which enable concurrent TEX+ROP from same surface.
  // 0 = Return unchanged color on pixels which don't need AA.
  //
  #define FXAA_DISCARD 0
#endif

/*--------------------------------------------------------------------------*/
#define FxaaTexTop(t, p) texture2D(t, p, -100.0)
#define FxaaTexOff(t, p, o, r) texture2D(t, p + (o * r), -100.0)
/*--------------------------------------------------------------------------*/

#define NUM_SAMPLES 5

// assumes colors have premultipliedAlpha, so that the calculated color contrast is scaled by alpha
float contrast( vec4 a, vec4 b ) {
  vec4 diff = abs( a - b );
  return max( max( max( diff.r, diff.g ), diff.b ), diff.a );
}

/*============================================================================

              FXAA3 QUALITY - PC

============================================================================*/

/*--------------------------------------------------------------------------*/
vec4 FxaaPixelShader(
  vec2 posM,
  sampler2D tex,
  vec2 fxaaQualityRcpFrame,
  float fxaaQualityEdgeThreshold,
  float fxaaQualityinvEdgeThreshold
) {
  vec4 rgbaM = FxaaTexTop(tex, posM);
  vec4 rgbaS = FxaaTexOff(tex, posM, vec2( 0.0, 1.0), fxaaQualityRcpFrame.xy);
  vec4 rgbaE = FxaaTexOff(tex, posM, vec2( 1.0, 0.0), fxaaQualityRcpFrame.xy);
  vec4 rgbaN = FxaaTexOff(tex, posM, vec2( 0.0,-1.0), fxaaQualityRcpFrame.xy);
  vec4 rgbaW = FxaaTexOff(tex, posM, vec2(-1.0, 0.0), fxaaQualityRcpFrame.xy);
  // . S .
  // W M E
  // . N .

  bool earlyExit = max( max( max(
      contrast( rgbaM, rgbaN ),
      contrast( rgbaM, rgbaS ) ),
      contrast( rgbaM, rgbaE ) ),
      contrast( rgbaM, rgbaW ) )
      < fxaaQualityEdgeThreshold;
  // . 0 .
  // 0 0 0
  // . 0 .

  #if (FXAA_DISCARD == 1)
    if(earlyExit) FxaaDiscard;
  #else
    if(earlyExit) return rgbaM;
  #endif

  float contrastN = contrast( rgbaM, rgbaN );
  float contrastS = contrast( rgbaM, rgbaS );
  float contrastE = contrast( rgbaM, rgbaE );
  float contrastW = contrast( rgbaM, rgbaW );

  float relativeVContrast = ( contrastN + contrastS ) - ( contrastE + contrastW );
  relativeVContrast *= fxaaQualityinvEdgeThreshold;

  bool horzSpan = relativeVContrast > 0.;
  // . 1 .
  // 0 0 0
  // . 1 .

  // 45 deg edge detection and corners of objects, aka V/H contrast is too similar
  if( abs( relativeVContrast ) < 2.5 ) {
    // locate the edge
    vec2 dirToEdge;
    dirToEdge.x = contrastE > contrastW ? 1. : -1.;
    dirToEdge.y = contrastS > contrastN ? 1. : -1.;
    // . 2 .      . 1 .
    // 1 0 2  ~=  0 0 1
    // . 1 .      . 0 .

    // tap 2 pixels and see which ones are "outside" the edge, to
    // determine if the edge is vertical or horizontal

    vec4 rgbaAlongH = FxaaTexOff(tex, posM, vec2( dirToEdge.x, -dirToEdge.y ), fxaaQualityRcpFrame.xy);
    float matchAlongH = contrast( rgbaM, rgbaAlongH );
    // . 1 .
    // 0 0 1
    // . 0 H

    vec4 rgbaAlongV = FxaaTexOff(tex, posM, vec2( -dirToEdge.x, dirToEdge.y ), fxaaQualityRcpFrame.xy);
    float matchAlongV = contrast( rgbaM, rgbaAlongV );
    // V 1 .
    // 0 0 1
    // . 0 .

    relativeVContrast = matchAlongV - matchAlongH;
    relativeVContrast *= fxaaQualityinvEdgeThreshold;

    if( abs( relativeVContrast ) < .3 ) { // 45 deg edge
      // 1 1 .
      // 0 0 1
      // . 0 1

      // do a simple blur
      return mix(
        rgbaM,
        (rgbaN + rgbaS + rgbaE + rgbaW) * .25,
        .4
      );
    }

    horzSpan = relativeVContrast > 0.;
  }

  if(!horzSpan) rgbaN = rgbaW;
  if(!horzSpan) rgbaS = rgbaE;
  // . 0 .      1
  // 1 0 1  ->  0
  // . 0 .      1

  bool pairN = contrast( rgbaM, rgbaN ) > contrast( rgbaM, rgbaS );
  if(!pairN) rgbaN = rgbaS;

  vec2 offNP;
  offNP.x = (!horzSpan) ? 0.0 : fxaaQualityRcpFrame.x;
  offNP.y = ( horzSpan) ? 0.0 : fxaaQualityRcpFrame.y;

  bool doneN = false;
  bool doneP = false;

  float nDist = 0.;
  float pDist = 0.;

  vec2 posN = posM;
  vec2 posP = posM;

  int iterationsUsed = 0;
  int iterationsUsedN = 0;
  int iterationsUsedP = 0;
  for( int i = 0; i < NUM_SAMPLES; i++ ) {
    iterationsUsed = i;

    float increment = float(i + 1);

    if(!doneN) {
      nDist += increment;
      posN = posM + offNP * nDist;
      vec4 rgbaEndN = FxaaTexTop(tex, posN.xy);
      doneN = contrast( rgbaEndN, rgbaM ) > contrast( rgbaEndN, rgbaN );
      iterationsUsedN = i;
    }

    if(!doneP) {
      pDist += increment;
      posP = posM - offNP * pDist;
      vec4 rgbaEndP = FxaaTexTop(tex, posP.xy);
      doneP = contrast( rgbaEndP, rgbaM ) > contrast( rgbaEndP, rgbaN );
      iterationsUsedP = i;
    }

    if(doneN || doneP) break;
  }


  if ( !doneP && !doneN ) return rgbaM; // failed to find end of edge

  float dist = min(
    doneN ? float( iterationsUsedN ) / float( NUM_SAMPLES - 1 ) : 1.,
    doneP ? float( iterationsUsedP ) / float( NUM_SAMPLES - 1 ) : 1.
  );

  // hacky way of reduces blurriness of mostly diagonal edges
  // but reduces AA quality
  dist = pow(dist, .5);

  dist = 1. - dist;

  return mix(
    rgbaM,
    rgbaN,
    dist * .5
  );
}

void fxaa() {
  const float edgeDetectionQuality = .05;
  const float invEdgeDetectionQuality = 1.0 / edgeDetectionQuality;

  const vec2 resolution = vec2(1. / (1920. * 0.7), 1. / (1080. * 0.7));

  fragColor = FxaaPixelShader(
    texCoord,
    texture0,
    resolution,
    edgeDetectionQuality, // [0,1] contrast needed, otherwise early discard
    invEdgeDetectionQuality
  );

}


vec2 computeUV( vec2 uv, float k, float kcube ){
    
    vec2 t = uv - .5;
    float r2 = t.x * t.x + t.y * t.y;
	  float f = 0.;
    
    if( kcube == 0.0){
        f = 1. + r2 * k;
    }else{
        f = 1. + r2 * ( k + kcube * sqrt( r2 ) );
    }
     
    vec2 nUv = f * t + .5;

 
    return nUv;
}


vec4 lensDistort()
{
    float k = -.25;
    float kcube = -0.2;
    float offset = -.2;
    
    float red = texture2D( texture0, computeUV( texCoord, k + offset, kcube ) ).r; 
    float green = texture2D( texture0, computeUV( texCoord, k, kcube ) ).g; 
    float blue = texture2D( texture0, computeUV( texCoord, k - offset, kcube ) ).b; 
    
    return vec4( red, green,blue, 1. );
}

void main()
{
    fragColor = texture(texture0, texCoord);
  
    // full screen anti-alias
    fxaa();

    fragColor = fragColor*(1.0-.2*lensEffect)+lensEffect*.3*lensDistort();

    // white fader. Used for demo transitions and sits here pretty well.
    fragColor.rgb += fadeToWhite;

    // tone mapping
    fragColor.rgb *= (exposure - exposureBoom) / 1.0; // pre-exposed, outside of the tone mapping function
    
    fragColor.rgb = ((fragColor.rgb - 0.5f) * max(postContrast, 0.0f)) + 0.5f; //post-exposure contrast

    //fragColor.rgb = ACESFilmicToneMapping(fragColor.rgb);
    fragColor = saturate(fragColor);
    // linear-sRGB to SRGB color space conversion
    //fragColor = sRGBTransferOETF(fragColor);
    fragColor.rgb -= fadeToBlack;
    // 3D LUT color grading
    float originalToColorGrade = 1.0;
    fragColor = mix(fragColor, sampleAs3DTexture(texture1,fragColor.rgb,32.), originalToColorGrade);

    vignette();

    float gamma = 1.1;
    fragColor.rgb = pow(fragColor.rgb, vec3(1.0/gamma));
}
