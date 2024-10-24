precision highp float;
varying vec2 vUv;
varying vec3 vNormal;
varying vec2 vScreenUV;
uniform vec2 uResolution;
uniform float uMouseSize;
uniform vec2 uMouse;
uniform float uTime;
uniform vec3 uBackground;

uniform vec3 c0;
uniform vec3 c1;
uniform vec3 c2;
uniform vec3 c3;

uniform float uProgress;
uniform vec2 uAspect;
uniform float uVisibility;

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}
  
float luma(vec4 color) {
  return dot(color.rgb, vec3(0.299, 0.587, 0.114));
}
  

float dither8x8(vec2 position, float brightness) {
  int x = int(mod(position.x, 8.0));
  int y = int(mod(position.y, 8.0));
  int index = x + y * 8;
  float limit = 0.0;

  if (x < 8) {
    if (index == 0) limit = 0.015625;
    if (index == 1) limit = 0.515625;
    if (index == 2) limit = 0.140625;
    if (index == 3) limit = 0.640625;
    if (index == 4) limit = 0.046875;
    if (index == 5) limit = 0.546875;
    if (index == 6) limit = 0.171875;
    if (index == 7) limit = 0.671875;
    if (index == 8) limit = 0.765625;
    if (index == 9) limit = 0.265625;
    if (index == 10) limit = 0.890625;
    if (index == 11) limit = 0.390625;
    if (index == 12) limit = 0.796875;
    if (index == 13) limit = 0.296875;
    if (index == 14) limit = 0.921875;
    if (index == 15) limit = 0.421875;
    if (index == 16) limit = 0.203125;
    if (index == 17) limit = 0.703125;
    if (index == 18) limit = 0.078125;
    if (index == 19) limit = 0.578125;
    if (index == 20) limit = 0.234375;
    if (index == 21) limit = 0.734375;
    if (index == 22) limit = 0.109375;
    if (index == 23) limit = 0.609375;
    if (index == 24) limit = 0.953125;
    if (index == 25) limit = 0.453125;
    if (index == 26) limit = 0.828125;
    if (index == 27) limit = 0.328125;
    if (index == 28) limit = 0.984375;
    if (index == 29) limit = 0.484375;
    if (index == 30) limit = 0.859375;
    if (index == 31) limit = 0.359375;
    if (index == 32) limit = 0.0625;
    if (index == 33) limit = 0.5625;
    if (index == 34) limit = 0.1875;
    if (index == 35) limit = 0.6875;
    if (index == 36) limit = 0.03125;
    if (index == 37) limit = 0.53125;
    if (index == 38) limit = 0.15625;
    if (index == 39) limit = 0.65625;
    if (index == 40) limit = 0.8125;
    if (index == 41) limit = 0.3125;
    if (index == 42) limit = 0.9375;
    if (index == 43) limit = 0.4375;
    if (index == 44) limit = 0.78125;
    if (index == 45) limit = 0.28125;
    if (index == 46) limit = 0.90625;
    if (index == 47) limit = 0.40625;
    if (index == 48) limit = 0.25;
    if (index == 49) limit = 0.75;
    if (index == 50) limit = 0.125;
    if (index == 51) limit = 0.625;
    if (index == 52) limit = 0.21875;
    if (index == 53) limit = 0.71875;
    if (index == 54) limit = 0.09375;
    if (index == 55) limit = 0.59375;
    if (index == 56) limit = 1.0;
    if (index == 57) limit = 0.5;
    if (index == 58) limit = 0.875;
    if (index == 59) limit = 0.375;
    if (index == 60) limit = 0.96875;
    if (index == 61) limit = 0.46875;
    if (index == 62) limit = 0.84375;
    if (index == 63) limit = 0.34375;
  }

  return brightness < limit ? 0.0 : 1.0;
}

vec3 dither8x8(vec2 position, vec3 color) {
  return color * dither8x8(position, luma(color));
}

vec4 dither8x8(vec2 position, vec4 color) {
  return vec4(color.rgb * dither8x8(position, luma(color)), 1.0);
}
  
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
  return a + b * cos(6.28318 * (c * t + d));
}
  
void main() {

  float angle = sin(uTime * 0.000025) * 3.14;
  vec3 lightPos = vec3(cos(angle), sin(uTime * (0.001)) , sin(angle));

  // vec3 lightPos = normalize(vec3(1.,1.,0.));

  float diffuse = dot(lightPos, vNormal);
  diffuse += (vScreenUV.y * 5.5);
  diffuse = smoothstep(-0.8, 2.3, diffuse);
  
  float ditherSize = 256.0;
  vec2 uv = (gl_FragCoord.xy / uResolution.xy) * (1./uAspect);

  float mouseCircle  = smoothstep(uMouseSize, uMouseSize + 0.13, 
    distance(uMouse * (1.0 / uAspect) - (1.0 / uAspect) * 0.5 + 0.5, uv)
  );

  diffuse = mix((1.0 - diffuse) * 0.8, diffuse, mouseCircle);

  diffuse = dither8x8(uv * ditherSize, diffuse * uVisibility);
  
  float colorFreq = (vScreenUV.y * 4.0 + 0.0 + uTime * 0.001  );
  colorFreq = mix(1.0, -vScreenUV.y * 4.0 + 0.0 + uTime * 0.001 , mouseCircle);
  vec3 paletteCurrent = palette(colorFreq, c0,c1,c2,c3);
  vec3 paletteColor = paletteCurrent;

  vec3 color = vec3(diffuse);
  color = mix(uBackground, paletteColor, diffuse);
  gl_FragColor = vec4(color, 1.0);
}