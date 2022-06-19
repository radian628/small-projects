#version 300 es

precision highp float;

in vec2 in_position;
out vec2 position;

uniform vec2 corner1;
uniform vec2 corner2;

void main(void) {
    position = in_position * (corner2 - corner1) + corner1;
    gl_Position = vec4(in_position * 2.0 - 1.0, 0.5, 1.0);
}