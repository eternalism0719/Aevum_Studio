/**
 * Galaxy Background — Vanilla JS implementation
 * Shader ported from reactbits.dev/backgrounds/galaxy (exact GLSL match)
 *
 * Usage:
 *   const galaxy = initGalaxy(containerElement, options);
 *   galaxy.destroy(); // cleanup
 */

(function (global) {
  'use strict';

  // ─── EXACT shaders from reactbits.dev ──────────────────────────────────────

  const VERT = `
    attribute vec2 uv;
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0, 1);
    }
  `;

  const FRAG = `
    precision highp float;

    uniform float uTime;
    uniform vec2  uResolution;
    uniform vec2  uMouse;
    uniform float uDensity;
    uniform float uGlowIntensity;
    uniform float uSaturation;
    uniform float uHueShift;
    uniform float uTwinkleIntensity;
    uniform float uRotationSpeed;
    uniform float uRepulsionStrength;
    uniform float uAutoCenterRepulsion;
    uniform float uStarSpeed;
    uniform float uSpeed;

    varying vec2 vUv;

    #define PI 3.14159265359

    mat2 rot(float a) {
      float s = sin(a), c = cos(a);
      return mat2(c, -s, s, c);
    }

    float hash12(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    vec3 hsv2rgb(vec3 c) {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void main() {
      vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.y, uResolution.x);
      float t = uTime * uSpeed;

      // Mouse / center repulsion
      vec2 repulsionCenter = mix(uMouse, vec2(0.0), uAutoCenterRepulsion);
      float distToMouse = length(uv - repulsionCenter);
      float mouseRep = exp(-distToMouse * 3.0) * uRepulsionStrength;
      uv += normalize(uv - repulsionCenter) * mouseRep;

      uv *= rot(t * uRotationSpeed);

      vec3 finalColor = vec3(0.0);

      for (float i = 0.0; i < 4.0; i++) {
        float z     = fract(0.25 * (i + t * uStarSpeed * 0.1));
        float scale = mix(20.0, 0.1, z);
        float fade  = smoothstep(0.0, 0.2, z) * smoothstep(1.0, 0.8, z);

        vec2 uv2 = uv * scale;
        vec2 id  = floor(uv2);
        vec2 gv  = fract(uv2) - 0.5;

        float h       = hash12(id);
        float twinkle = sin(t * uTwinkleIntensity + h * PI * 2.0) * 0.5 + 0.5;
        float d       = length(gv);
        float star    = 0.005 / d * fade * twinkle;

        float hue = fract(h + uHueShift / 360.0);
        vec3 col  = hsv2rgb(vec3(hue, uSaturation, 1.0));

        finalColor += star * col * uDensity;

        float glow = exp(-d * 5.0) * 0.2 * uGlowIntensity;
        finalColor += glow * col * fade;
      }

      // Galactic core / nebulosity
      float m    = 0.0;
      vec2  uv3  = uv * 2.0;
      for (float i = 0.0; i < 3.0; i++) {
        float rays  = max(0.0, 1.0 - abs(uv3.x * uv3.y * 100.0));
        float flare = max(0.0, 1.0 - length(uv3) * 0.5);
        m += rays * flare * uGlowIntensity;
        uv3 *= rot(PI / 3.0);
      }

      vec3 coreCol = hsv2rgb(vec3(uHueShift / 360.0, uSaturation * 0.5, 1.0));
      finalColor  += m * coreCol * 0.2;
      finalColor  *= smoothstep(1.5, 0.5, length(uv));

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // ─── Raw WebGL helpers ──────────────────────────────────────────────────────

  function compileShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('[Galaxy] Shader compile error:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl) {
    const vs   = compileShader(gl, gl.VERTEX_SHADER,   VERT);
    const fs   = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[Galaxy] Program link error:', gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  /**
   * Full-screen triangle: covers clip-space [-1,1]² with a single triangle.
   * Interleaved layout: [posX, posY, uvX, uvY] × 3 vertices
   */
  function createTriangleBuffer(gl) {
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  0, 0,
       3, -1,  2, 0,
      -1,  3,  0, 2,
    ]), gl.STATIC_DRAW);
    return buf;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  function initGalaxy(container, opts) {
    opts = Object.assign({
      mouseRepulsion:      true,
      mouseInteraction:    true,
      density:             1.0,
      glowIntensity:       0.3,
      saturation:          0.0,
      hueShift:            140.0,
      twinkleIntensity:    0.3,
      rotationSpeed:       0.1,
      repulsionStrength:   2.0,
      autoCenterRepulsion: 0.0,
      starSpeed:           0.5,
      speed:               1.0,
    }, opts);

    // ── Canvas setup ──
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:block;';
    container.style.position = container.style.position || 'relative';
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false, antialias: false });
    if (!gl) { console.error('[Galaxy] WebGL not supported'); return { destroy: () => {} }; }

    // ── Compile shaders ──
    const prog = createProgram(gl);
    if (!prog) return { destroy: () => {} };

    const buf      = createTriangleBuffer(gl);
    const aPosLoc  = gl.getAttribLocation(prog, 'position');
    const aUvLoc   = gl.getAttribLocation(prog, 'uv');

    const uLocs = {};
    ['uTime','uResolution','uMouse','uDensity','uGlowIntensity','uSaturation',
     'uHueShift','uTwinkleIntensity','uRotationSpeed','uRepulsionStrength',
     'uAutoCenterRepulsion','uStarSpeed','uSpeed'].forEach(n => {
       uLocs[n] = gl.getUniformLocation(prog, n);
     });

    // ── State ──
    let mouseX = 0, mouseY = 0, animId;

    // ── Resize ──
    function resize() {
      const w = container.offsetWidth  || window.innerWidth;
      const h = container.offsetHeight || window.innerHeight;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }

    // ── Mouse tracking (matches React component's coordinate mapping) ──
    function onMouseMove(e) {
      if (!opts.mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const rw   = rect.width;
      const rh   = rect.height;
      const mn   = Math.min(rw, rh);
      mouseX = ((e.clientX - rect.left) / rw - 0.5) * (rw / mn);
      mouseY = (0.5 - (e.clientY - rect.top)  / rh) * (rh / mn);
    }

    // ── Render loop ──
    function render(t) {
      const time = t * 0.001;

      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);

      const stride = 4 * Float32Array.BYTES_PER_ELEMENT;
      gl.enableVertexAttribArray(aPosLoc);
      gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(aUvLoc);
      gl.vertexAttribPointer(aUvLoc,  2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

      gl.uniform1f(uLocs.uTime,               time);
      gl.uniform2f(uLocs.uResolution,          canvas.width, canvas.height);
      gl.uniform2f(uLocs.uMouse,               mouseX, mouseY);
      gl.uniform1f(uLocs.uDensity,             opts.density);
      gl.uniform1f(uLocs.uGlowIntensity,       opts.glowIntensity);
      gl.uniform1f(uLocs.uSaturation,          opts.saturation);
      gl.uniform1f(uLocs.uHueShift,            opts.hueShift);
      gl.uniform1f(uLocs.uTwinkleIntensity,    opts.twinkleIntensity);
      gl.uniform1f(uLocs.uRotationSpeed,       opts.rotationSpeed);
      gl.uniform1f(uLocs.uRepulsionStrength,   opts.mouseRepulsion ? opts.repulsionStrength : 0.0);
      gl.uniform1f(uLocs.uAutoCenterRepulsion, opts.autoCenterRepulsion);
      gl.uniform1f(uLocs.uStarSpeed,           opts.starSpeed);
      gl.uniform1f(uLocs.uSpeed,               opts.speed);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      animId = requestAnimationFrame(render);
    }

    // ── Wire up events ──
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    resize();
    animId = requestAnimationFrame(render);

    return {
      destroy() {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) ext.loseContext();
      }
    };
  }

  global.initGalaxy = initGalaxy;

})(window);
