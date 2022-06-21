#version 300 es

precision highp float;

in vec2 position;
out vec4 pixelColor;

uniform vec2 corner1;
uniform vec2 corner2;

uniform vec2 winSize;

uniform vec3 gradient[5];
uniform float gradientFactor[5];

uniform uint iterations;

uniform vec2 c;

vec3 getColor(float factor) {
    float factor2 = factor;
    uint index = 0u;
    while (factor >= gradientFactor[index + 1u] - gradientFactor[index]) {
        index++;
        factor -= gradientFactor[index] - gradientFactor[index - 1u];
    }

    return mix(
        gradient[index],
        gradient[index + 1u],
        (factor2 - gradientFactor[index]) / (gradientFactor[index + 1u] - gradientFactor[index])
    );
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    vec3 color = vec3(0.0);
    for (float sampleCount = 0.0; sampleCount < 1.0; sampleCount++) {
        vec2 z = position + 
            vec2(
                rand(position + sampleCount), 
                rand(100.0 + position + sampleCount)
            ) * (corner2 - corner1) / winSize;
        for (uint i = 0u; i < iterations; i++) {
            z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
            if (dot(z,z) > 4.0) {
                float factor = float(i) / float(iterations);
                color += getColor(factor);
                break;
            }
        }
    }
    pixelColor = vec4(color / 1.0, 1.0);
}