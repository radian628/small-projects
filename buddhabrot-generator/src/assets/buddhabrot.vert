#version 300 es

precision highp float;

in vec2 position;

void main() {

    vec2 pos = vec2(0.0);
    for (int i = 0; i < 64; i++) {
        pos = vec2(
            pos.x * pos.x - pos.y * pos.y,
            2.0 * pos.x * pos.y
        ) + position;
    }

    gl_PointSize = 1.0;
    gl_Position = vec4(pos, 0.5, 1.0);
}