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

uniform float numberOfSamples;

//$FRACTAL_LIB

vec2 iteration(vec2 z, vec2 p) {
  vec2 temp = vec2(z.x, abs(z.y)) + p;
  return vec2(log(length(temp)), atan(temp.y, temp.x));
}

void main(void) {
    vec3 color = vec3(0.0);
    for (float sampleCount = 0.0; sampleCount < numberOfSamples; sampleCount++) {
        vec2 z = 
            vec2(
                rand(position + sampleCount), 
                rand(100.0 + position + sampleCount)
            ) * (corner2 - corner1) / winSize + position;
        for (uint i = 0u; i < iterations; i++) {
            z = iteration(z, c);
        }
        color += getColor(atan(z.y, z.x) / 6.28318531 + 0.5) * length(z);
    }
    pixelColor = vec4(color / numberOfSamples, 1.0);
}