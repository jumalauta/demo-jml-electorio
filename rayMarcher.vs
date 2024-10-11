out vec3 rayDirection;
out vec2 texCoord;

uniform float camFov;


#define aspectRatio .5625



void main() {


  gl_Position = vec4(position.xy, 0, 1.0);

  vec2 uv = vec2(position.x, position.y * aspectRatio);
  float cameraDistance = (1.0 / tan(camFov / 2.0)) * aspectRatio;
  rayDirection = normalize(vec3(uv, -cameraDistance) * mat3(viewMatrix));
    
}