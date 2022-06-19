#version 300 es

precision highp float;

in vec2 position;
out vec4 pixelColor;

void main(void) {
    vec2 z = vec2(0.0);
    vec2 c = position;
    for (uint i = 0u; i < 128u; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if (dot(z,z) > 4.0) {
            float factor = float(i) / 128.0;
            pixelColor = vec4(factor * 4.0, factor * 2.0, factor, 1.0);
            return;
        }
    }
    pixelColor = vec4(0.0, 0.0, 0.0, 1.0);
}