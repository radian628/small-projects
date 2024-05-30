#version 300 es

precision highp float;

in vec2 position;

out vec2 texcoord;

void main() {
    gl_Position = vec4(position, 0.5, 1.0);
    texcoord = position * 0.5 + 0.5;
}