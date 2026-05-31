/**
 * Galaxy Background — Raw WebGL Implementation (No dependencies)
 * Optimized for high brightness and density.
 */

(function (global) {
  'use strict';

  const vertexShaderSrc = `
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  const fragmentShaderSrc = `
    precision highp float;
    uniform float uTime;
    uniform vec3 uResolution;
    uniform vec2 uFocal;
    uniform vec2 uRotation;
    uniform float uStarSpeed;
    uniform float uDensity;
    uniform float uHueShift;
    uniform float uSpeed;
    uniform vec2 uMouse;
    uniform float uGlowIntensity;
    uniform float uSaturation;
    uniform bool uMouseRepulsion;
    uniform float uTwinkleIntensity;
    uniform float uRotationSpeed;
    uniform float uRepulsionStrength;
    uniform float uMouseActiveFactor;
    uniform float uAutoCenterRepulsion;
    uniform bool uTransparent;
    varying vec2 vUv;

    #define NUM_LAYER 4.0
    #define STAR_COLOR_CUTOFF 0.2
    #define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
    #define PERIOD 3.0

    float Hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }
    float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
    float tris(float x) {
      float t = fract(x);
      return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
    }
    float trisn(float x) {
      float t = fract(x);
      return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
    }
    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }
    float Star(vec2 uv, float flare) {
      float d = length(uv);
      float m = (0.05 * uGlowIntensity) / d;
      float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
      m += rays * flare * uGlowIntensity;
      uv *= MAT45;
      rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
      m += rays * 0.3 * flare * uGlowIntensity;
      m *= smoothstep(1.0, 0.2, d);
      return m;
    }
    vec3 StarLayer(vec2 uv, float uTime, float uStarSpeed, float uHueShift, float uSaturation, float uGlowIntensity, float uTwinkleIntensity, float uSpeed) {
      vec3 col = vec3(0.0);
      vec2 gv = fract(uv) - 0.5; 
      vec2 id = floor(uv);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 offset = vec2(float(x), float(y));
          vec2 si = id + offset;
          float seed = Hash21(si);
          float size = fract(seed * 345.32);
          float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
          float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
          float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
          float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
          float grn = min(red, blu) * seed;
          vec3 base = vec3(red, grn, blu);
          float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
          hue = fract(hue + uHueShift / 360.0);
          float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
          float val = max(max(base.r, base.g), base.b);
          base = hsv2rgb(vec3(hue, sat, val));
          vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
          float star = Star(gv - offset - pad, flareSize);
          float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
          twinkle = mix(1.0, twinkle, uTwinkleIntensity);
          star *= twinkle;
          col += star * size * base;
        }
      }
      return col;
    }
    void main() {
      vec2 focalPx = uFocal * uResolution.xy;
      vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
      vec2 mouseNorm = uMouse - vec2(0.5);
      if (uAutoCenterRepulsion > 0.0) {
        vec2 centerUV = vec2(0.0, 0.0);
        float centerDist = length(uv - centerUV);
        vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
        uv += repulsion * 0.05;
      } else if (uMouseRepulsion) {
        vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
        float mouseDist = length(uv - mousePosUV);
        vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
        uv += repulsion * 0.05 * uMouseActiveFactor;
      } else {
        vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
        uv += mouseOffset;
      }
      float autoRotAngle = uTime * uRotationSpeed;
      mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
      uv = autoRot * uv;
      uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
      vec3 col = vec3(0.0);
      for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
        float depth = fract(i + uStarSpeed * uSpeed);
        float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
        float fade = depth * smoothstep(1.0, 0.9, depth);
        col += StarLayer(uv * scale + i * 453.32, uTime, uStarSpeed, uHueShift, uSaturation, uGlowIntensity, uTwinkleIntensity, uSpeed) * fade;
      }

      // UIUXPROMAX: High-Fidelity Interaction Glow
      vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
      float mouseGlowDist = length(uv - mousePosUV);
      float mouseGlow = (0.015 * uGlowIntensity) / (mouseGlowDist + 0.04);
      vec3 interactionCol = hsv2rgb(vec3(fract(uHueShift / 360.0), 0.8, 0.6)) * mouseGlow * uMouseActiveFactor;
      col += interactionCol * 1.5;

      if (uTransparent) {
        float alpha = clamp(length(col) / 0.2, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      } else {
        gl_FragColor = vec4(col, 1.0);
      }
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function initGalaxy(container, opts) {
    opts = Object.assign({
      focal: [0.5, 0.5],
      rotation: [1.0, 0.0],
      starSpeed: 0.5,
      density: 2.0, // High density
      hueShift: 140,
      speed: 1.0,
      glowIntensity: 0.5, // High brightness
      saturation: 0.0,
      mouseRepulsion: true,
      repulsionStrength: 2,
      twinkleIntensity: 0.3,
      rotationSpeed: 0.1,
      autoCenterRepulsion: 0,
      transparent: true
    }, opts);

    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: opts.transparent, premultipliedAlpha: false });
    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 0, 0, 3, -1, 2, 0, -1, 3, 0, 2]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    const uvLoc = gl.getAttribLocation(program, 'uv');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8);

    const uniforms = {};
    const names = ['uTime', 'uResolution', 'uFocal', 'uRotation', 'uStarSpeed', 'uDensity', 'uHueShift', 'uSpeed', 'uMouse', 'uGlowIntensity', 'uSaturation', 'uMouseRepulsion', 'uTwinkleIntensity', 'uRotationSpeed', 'uRepulsionStrength', 'uMouseActiveFactor', 'uAutoCenterRepulsion', 'uTransparent'];
    names.forEach(name => uniforms[name] = gl.getUniformLocation(program, name));

    let targetMouse = { x: 0.5, y: 0.5 };
    let smoothMouse = { x: 0.5, y: 0.5 };
    let targetActive = 0, smoothActive = 0;

    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      canvas.width = w; canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
      const r = container.getBoundingClientRect();
      targetMouse.x = (e.clientX - r.left) / r.width;
      targetMouse.y = 1.0 - (e.clientY - r.top) / r.height;
      targetActive = 1.0;
    });
    window.addEventListener('mouseleave', () => targetActive = 0.0);
    resize();

    function render(t) {
      smoothMouse.x += (targetMouse.x - smoothMouse.x) * 0.1;
      smoothMouse.y += (targetMouse.y - smoothMouse.y) * 0.1;
      smoothActive += (targetActive - smoothActive) * 0.05;

      gl.clearColor(0, 0, 0, opts.transparent ? 0 : 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(uniforms.uTime, t * 0.001);
      gl.uniform3f(uniforms.uResolution, canvas.width, canvas.height, canvas.width / canvas.height);
      gl.uniform2fv(uniforms.uFocal, opts.focal);
      gl.uniform2fv(uniforms.uRotation, opts.rotation);
      gl.uniform1f(uniforms.uStarSpeed, opts.starSpeed);
      gl.uniform1f(uniforms.uDensity, opts.density);
      gl.uniform1f(uniforms.uHueShift, opts.hueShift);
      gl.uniform1f(uniforms.uSpeed, opts.speed);
      gl.uniform2f(uniforms.uMouse, smoothMouse.x, smoothMouse.y);
      gl.uniform1f(uniforms.uGlowIntensity, opts.glowIntensity);
      gl.uniform1f(uniforms.uSaturation, opts.saturation);
      gl.uniform1i(uniforms.uMouseRepulsion, opts.mouseRepulsion);
      gl.uniform1f(uniforms.uTwinkleIntensity, opts.twinkleIntensity);
      gl.uniform1f(uniforms.uRotationSpeed, opts.rotationSpeed);
      gl.uniform1f(uniforms.uRepulsionStrength, opts.repulsionStrength);
      gl.uniform1f(uniforms.uMouseActiveFactor, smoothActive);
      gl.uniform1f(uniforms.uAutoCenterRepulsion, opts.autoCenterRepulsion);
      gl.uniform1i(uniforms.uTransparent, opts.transparent);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // External Interface for UIUXPROMAX Phase Sync
    return {
      updateOptions: (newOpts) => {
        Object.assign(opts, newOpts);
      },
      canvas: canvas
    };
  }

  // Export for module usage
  global.initGalaxy = initGalaxy;
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = { initGalaxy };
  }
})(typeof window !== 'undefined' ? window : this);

export const initGalaxy = window.initGalaxy;
