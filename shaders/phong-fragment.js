// jshint esversion: 6

let phongFragmentShaderText =
`#version 400

uniform vec4 lightColor;
uniform sampler2D textureSampler;
uniform vec4 ambient;
uniform vec4 diffuse;
uniform vec4 specular;
uniform float shine;
uniform float toon;
uniform float hasTexture;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 light;

vec4 threeTermReflectionLighting(vec3 normal, vec3 position, vec3 lightPos, float shininess,
  vec4 ambientFraction, vec4 diffuseFraction, vec4 specularFraction, vec4 objectColor, vec4 lightCol)
{
  vec3 N = normalize(normal);
  vec3 V = normalize(-position);
  vec3 L = normalize(lightPos - position);
  vec3 R = normalize(-L + 2 * (dot(L, N)) * N);

  float diffuseIntensity = max(dot(N, L), 0.0);

    float specularAngleCosine = max(dot(V, R), 0.0);
  float specularIntensity = pow(specularAngleCosine, shininess);

  vec4 ambi = ambientFraction * lightCol;
  vec4 diff = diffuseIntensity * diffuseFraction * lightCol;
  vec4 spec = specularIntensity * specularFraction * lightCol;

  return (objectColor * (ambi + diff)) + spec;
}

vec4 threeTermHalfwayLighting(vec3 normal, vec3 position, vec3 lightPos, float shininess,
  vec4 ambientFraction, vec4 diffuseFraction, vec4 specularFraction, vec4 objectColor, vec4 lightCol)
{
  vec3 N = normalize(normal);
  vec3 V = normalize(-position);
  vec3 L = normalize(lightPos - position);
  vec3 H = normalize(V + L);

  float diffuseIntensity = max(dot(N, L), 0.0);

    float specularAngleCosine = max(dot(N, H), 0.0);
  float specularIntensity = pow(specularAngleCosine, shininess);

  vec4 ambi = ambientFraction * lightCol;
  vec4 diff = diffuseIntensity * diffuseFraction * lightCol;
  vec4 spec = specularIntensity * specularFraction * lightCol;

  return (objectColor * (ambi + diff)) + spec;
}

vec4 toonify(vec3 normal, vec3 position, vec4 color)
{
  vec3 N = normalize(normal);
  vec3 V = normalize(-vPosition);
  vec4 C = color;

  float angleBetweenViewerAndNormal = dot(V, N);
  if (angleBetweenViewerAndNormal < cos(radians(70)))
  {
    C = vec4(0.0, 0.0, 0.0, 1.0);
  }
  else
  {
    float toonShades = 3.0;
    C.r = max(ambient.r * C.r, C.r - (mod(C.r, 1.0 / toonShades)));
    C.g = max(ambient.g * C.r, C.g - (mod(C.g, 1.0 / toonShades)));
    C.b = max(ambient.b * C.r, C.b - (mod(C.b, 1.0 / toonShades)));
    C.a = max(ambient.a * C.r, C.a - (mod(C.a, 1.0 / toonShades)));
  }

  return C;
}

void main(void)
{
  vec4 fragColor = vec4(1.0, 1.0, 1.0, 1.0);

  if (hasTexture > 0.5)
  {
    fragColor = texture2D(textureSampler, vTextureCoord);
  }

  fragColor = threeTermHalfwayLighting(vNormal, vPosition, light, shine, ambient, diffuse, specular, fragColor, lightColor);

  if (toon > 0.5)
  {
    fragColor = toonify(vNormal, vPosition, fragColor);
  }

    gl_FragColor = fragColor;
}`;
