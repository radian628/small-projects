// linear interpolation
export function lerp(a, b, fac) {
    return a * (1 - fac) + b * fac;
}