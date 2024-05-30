#version 300 es

precision highp float;

in vec2 texcoord;

out vec4 fragColor;

uniform sampler2D prevTex;
uniform sampler2D currTex;

void main() {
    fragColor = 
        texture(prevTex, texcoord)
        + texture(currTex, texcoord);
}