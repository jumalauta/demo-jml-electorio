in vec2 texCoord;
in vec3 rayDirection;

out vec4 fragColor;

uniform sampler2D texture0;
uniform sampler2D texture2;
uniform float time;

uniform float timeMultiplier;
uniform float invert;
uniform float rotation;
uniform float rotation2;
uniform float rotation3;
uniform float speed;
uniform float MAX_STEPS;
uniform float mengerdivisor;

uniform vec3 camPos;
uniform float camFov;
uniform vec3 camDirection;
uniform float camNear;
uniform float camFar;

uniform float carrotPosZ;

#define MAX_DIST 250.0
#define PI 3.14159265359

mat2 Rot(float angle)
{
	float s = sin(angle);
	float c = cos(angle);
	return mat2(c, -s, s, c);
}

float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5*(a-b)/k, 0.0, 1.0);
    return mix(a, b, h) - k*h*(1.0-h);
}

float Cone( vec3 pos, vec3 rot, vec2 c, float h )
{
  vec3 p = pos;
  float q = length(p.xz);
  return max(dot(c.xy,vec2(q,p.y)),-h-p.y);
}

float Capsule( vec3 pos, vec3 rot, float h, float r )
{
  pos.y -= clamp( pos.y, 0.0, h );
  return length( pos ) - r;
}



float Carrot( vec3 pos, vec3 rot, float r1, float r2, float h )
{
  // sampling independent computations (only depend on shape)

  pos.yz *= Rot(1.5*PI);
  float b = (r1-r2)/h;
  float a = sqrt(1.0-b*b);

  // sampling dependant computations
  vec2 q = vec2( length(pos.xz), pos.y );
  float k = dot(q,vec2(-b,a));
  if( k<0.0 ) return length(q) - r1;
  if( k>a*h ) return length(q-vec2(0.0,h)) - r2;
  return dot(q, vec2(a,b) ) - r1;
}

float Sphere(vec3 point, vec3 pos, float scale)
{ 
	return length(point - pos)-scale;
}


float GetDist(vec3 point)
{
    float distObjects;
    vec3 carrotPos = vec3(0.0,0.0,carrotPosZ);
    vec3 objPos = (point-carrotPos); //0.,0.0,0.5
    vec3 objRot = vec3(0.0,0.5,0.0);
    //distObjects = Sphere(point, objPos, .725);
    distObjects = Carrot(objPos, objRot, 0.1, .3, 1.5);

	

    //distObjects = min(sphere1,distPlane);
	//distObjects = min (distObjects, sphere2);



    return distObjects;
}


float RayMarch(vec3 rayOrigin, vec3 rayDir)
{
    float distOrigin = camNear;

	float SURFACE_DIST = 0.05; // this should be uniform calculated using camera fov

    for(float i=0.; i<MAX_STEPS;i++)
    {
        vec3 pointOnRay = rayOrigin+rayDir*distOrigin;
        float distScene = GetDist(pointOnRay);
        distOrigin += distScene;
        if(distOrigin>=MAX_DIST) discard;
        if(distScene<SURFACE_DIST) break;
    }
    
    return distOrigin;
}

vec3 GetNormal(vec3 point)
{
    float dist = GetDist(point);
    vec2 e = vec2(.05,0.);
    vec3 normal = dist - vec3(
        GetDist(point-e.xyy), //e.xyy = 0.1,0,0
        GetDist(point-e.yxy),
        GetDist(point-e.yyx)); 
        
    return normalize(normal);
}

float GetLight(vec3 point)
{
    
    vec3 lightPos = camPos;
    //lightPos.xz-=vec2(sin(time),cos(time))*11.;
    vec3 light = normalize(lightPos-point);

    vec3 normal = GetNormal(point);
    float diffuse = clamp(dot(normal, light),0.0,1.0);
    diffuse +=0.3;
    

    return diffuse;
}




 
void main()
{
    vec3 col = vec3(0.);
    
    float dist = RayMarch(camPos, rayDirection); 

    vec3 point = camPos + rayDirection * dist;
    
    float diffuse = GetLight(point);

 
	

    float z =  (dist * dot(camDirection, rayDirection));


        float ndcDepth = -((camFar + camNear) / (camNear - camFar)) + ((2.0 * (camFar) * camNear) / (camNear - camFar)) / z;
        gl_FragDepth = ((gl_DepthRange.diff * ndcDepth) + gl_DepthRange.near + gl_DepthRange.far) / 2.;
       col = vec3(diffuse);


        //fragColor = vec4(col,1.0);
        fragColor = vec4(col.r,col.g*.45,col.b*.1,1.0);
}