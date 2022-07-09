vec3 getColor(float factor) {
    if (factor <= gradientFactor[0]) return gradient[0];
    if (factor >= gradientFactor[4]) return gradient[4];
    float factor2 = factor;
    uint index = 0u;
    factor -= gradientFactor[0];
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