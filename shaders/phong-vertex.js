// jshint esversion: 6

let phongVertexShaderText =
`#version 400

uniform mat4 transform;
uniform mat4 view;
uniform mat4 projection;
uniform vec4 lightPosition;

layout(location = 0) attribute vec4 vtxPosition;
layout(location = 1) attribute vec4 vtxNormal;
layout(location = 2) attribute vec4 vtxColor;
layout(location = 3) attribute vec2 vtxTextureCoord;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying vec3 light;

void main(void)
{
  gl_Position = projection * view * transform * vtxPosition;
  vPosition = vec3(view * transform * vtxPosition);
  vNormal = vec3(transpose(inverse(view * transform)) * vtxNormal);
  vColor = vtxColor;
  vTextureCoord = vtxTextureCoord;
  light = vec3(view * lightPosition);
}`;
