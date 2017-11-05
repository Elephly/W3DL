// jshint esversion: 6

let colorVertexShaderText =
`#version 400

uniform mat4 transform;
uniform mat4 view;
uniform mat4 projection;

layout(location = 0) attribute vec4 vtxPosition;
layout(location = 1) attribute vec4 vtxNormal;
layout(location = 2) attribute vec4 vtxColor;
layout(location = 3) attribute vec2 vtxTextureCoord;

varying vec4 vColor;

void main(void)

{
  gl_Position = projection * view * transform * vtxPosition;
  vColor = vtxColor;
}`;
