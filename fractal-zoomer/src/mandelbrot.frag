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

uniform float numberOfSamples;

//$FRACTAL_LIB

void main(void) {
    vec3 color = vec3(0.0);
    for (float sampleCount = 0.0; sampleCount < numberOfSamples; sampleCount++) {
        vec2 z = vec2(0.0);
        vec2 c = position + 
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
    pixelColor = vec4(color / numberOfSamples, 1.0);
}