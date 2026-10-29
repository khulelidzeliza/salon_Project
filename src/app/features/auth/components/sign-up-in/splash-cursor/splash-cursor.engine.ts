export interface SplashOptions {
  colors: string[];
  size: number;
  force: number;
  swirl: number;
  trail: number;
  clickSplash: boolean;
}

export function hexToRgb(hex: string): number[] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const SIM = 128;           // short side of the velocity grid
const INK_MAX = 900;       // short side cap of the ink grid
const PRESSURE_ITERATIONS = 20;

const VERTEX = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const HEADER = `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 outColor;
`;

const PASSES: Record<string, string> = {
  splat: `
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec2 point;
uniform vec3 color;
uniform float radius;
void main() {
  vec2 p = (vUv - point) * vec2(aspectRatio, 1.0);
  outColor = vec4(texture(uTarget, vUv).xyz + exp(-dot(p, p) / radius) * color, 1.0);
}`,
  curl: `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  outColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: `
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * dt;
  outColor = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  divergence: `
uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  outColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  clear: `
uniform sampler2D uTexture;
uniform float value;
void main() {
  outColor = value * texture(uTexture, vUv);
}`,
  pressure: `
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float d = texture(uDivergence, vUv).x;
  outColor = vec4((L + R + B + T - d) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: `
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  outColor = vec4(v, 0.0, 1.0);
}`,
  advection: `
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float dt;
uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * vec2(vR.x - vUv.x, vT.y - vUv.y);
  outColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  display: `
uniform sampler2D uTexture;
void main() {
  vec3 c = max(texture(uTexture, vUv).rgb, 0.0);
  vec3 transmit = exp(-2.4 * c);
  float low = min(transmit.r, min(transmit.g, transmit.b));
  float alpha = clamp(1.0 - low, 0.0, 1.0);
  outColor = vec4(min(transmit - low, vec3(alpha)), alpha);
}`,
};

export function createSplashCursor(canvas: HTMLCanvasElement, o: SplashOptions): () => void {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false }) as WebGL2RenderingContext | null;
  if (!gl || !gl.getExtension('EXT_color_buffer_float')) return () => {};

  const palette = o.colors.map(hexToRgb);
  const trail = Math.max(0.05, o.trail);

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const progs: Record<string, { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> }> = {};
  for (const name in PASSES) {
    const p = gl.createProgram()!;
    gl.attachShader(p, vertex);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, HEADER + PASSES[name]));
    gl.bindAttribLocation(p, 0, 'aPosition');
    gl.linkProgram(p);
    const u: Record<string, WebGLUniformLocation | null> = {};
    const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < n; i++) {
      const info = gl.getActiveUniform(p, i)!;
      u[info.name] = gl.getUniformLocation(p, info.name);
    }
    progs[name] = { p, u };
  }

  // full-screen quad
  gl.bindVertexArray(gl.createVertexArray());
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
  type Pair = { r: Target; w: Target };
  let made: Target[] = [];

  const target = (w: number, h: number): Target => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const t = { tex, fbo, w, h };
    made.push(t);
    return t;
  };
  const pair = (w: number, h: number): Pair => ({ r: target(w, h), w: target(w, h) });
  const swap = (p: Pair) => { const t = p.r; p.r = p.w; p.w = t; };

  let vel!: Pair, ink!: Pair, pres!: Pair, div!: Target, curl!: Target;
  let sw = 1, sh = 1;

  const dims = (short: number) => {
    const a = canvas.width / canvas.height;
    return a >= 1 ? [Math.round(short * a), short] : [short, Math.round(short / a)];
  };

  const build = () => {
    made.forEach(t => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); });
    made = [];
    const [vw, vh] = dims(SIM);
    const [iw, ih] = dims(Math.min(INK_MAX, Math.min(canvas.width, canvas.height)));
    sw = vw; sh = vh;
    vel = pair(vw, vh);
    pres = pair(vw, vh);
    div = target(vw, vh);
    curl = target(vw, vh);
    ink = pair(iw, ih);
  };

  const fit = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    build();
  };
  fit();

  const use = (name: string) => {
    const { p, u } = progs[name];
    gl.useProgram(p);
    gl.uniform2f(u["texelSize"], 1 / sw, 1 / sh);
    return u;
  };
  const bind = (u: Record<string, WebGLUniformLocation | null>, texs: Record<string, Target>) => {
    let unit = 0;
    for (const k in texs) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texs[k].tex);
      gl.uniform1i(u[k], unit++);
    }
  };
  const blit = (t: Target | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t ? t.fbo : null);
    gl.viewport(0, 0, t ? t.w : canvas.width, t ? t.h : canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };
  const pass = (name: string, out: Target | null, texs: Record<string, Target>, nums: Record<string, number> = {}) => {
    const u = use(name);
    bind(u, texs);
    for (const k in nums) gl.uniform1f(u[k], nums[k]);
    blit(out);
  };

  const splat = (p: Pair, x: number, y: number, r: number, c: number[]) => {
    const u = use('splat');
    bind(u, { uTarget: p.r });
    gl.uniform1f(u["aspectRatio"], canvas.width / canvas.height);
    gl.uniform2f(u["point"], x, y);
    gl.uniform1f(u["radius"], r);
    gl.uniform3f(u["color"], c[0], c[1], c[2]);
    blit(p.w);
    swap(p);
  };

  // ink color: cycles the palette, light theme absorbs the complement
  const inkAt = (t: number, amount: number) => {
    const n = palette.length;
    const pos = ((t % n) + n) % n;
    const i = Math.floor(pos), f = pos - i;
    const a = palette[i], b = palette[(i + 1) % n];
    return a.map((v, k) => (1 - (v + (b[k] - v) * f)) * amount);
  };

  const step = (dt: number) => {
    pass('curl', curl, { uVelocity: vel.r });
    pass('vorticity', vel.w, { uVelocity: vel.r, uCurl: curl }, { curl: o.swirl, dt });
    swap(vel);
    pass('divergence', div, { uVelocity: vel.r });
    pass('clear', pres.w, { uTexture: pres.r }, { value: 0.1 });
    swap(pres);
    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      pass('pressure', pres.w, { uPressure: pres.r, uDivergence: div });
      swap(pres);
    }
    pass('gradient', vel.w, { uPressure: pres.r, uVelocity: vel.r });
    swap(vel);
    pass('advection', vel.w, { uVelocity: vel.r, uSource: vel.r }, { dt, dissipation: 2 });
    swap(vel);
    pass('advection', ink.w, { uVelocity: vel.r, uSource: ink.r }, { dt, dissipation: 3.5 / trail });
    swap(ink);
  };

  const pointer = { x: 0, y: 0, px: 0, py: 0, live: false, moved: false };
  const clicks: number[][] = [];
  let hue = 0;

  const toUv = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: 1 - (e.clientY - r.top) / r.height };
  };
  const inside = (p: { x: number; y: number }) => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;

  const onMove = (e: PointerEvent) => {
    const p = toUv(e);
    if (!inside(p)) { pointer.live = false; return; }
    if (!pointer.live) {
      Object.assign(pointer, { x: p.x, y: p.y, px: p.x, py: p.y, live: true });
      return;
    }
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.moved = true;
  };
  const onDown = (e: PointerEvent) => {
    if (!o.clickSplash) return;
    if ((e.target as HTMLElement).closest?.('input,button,a,label')) return;
    const p = toUv(e);
    if (inside(p)) clicks.push([p.x, p.y]);
  };

  const radius = () => 0.002 * o.size * Math.max(1, canvas.width / canvas.height);
  let last = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    const dt = Math.max(0, Math.min((now - last) / 1000, 1 / 30));
    last = now;
    fit();

    if (pointer.moved) {
      const k = 6000 * o.force;
      const dx = pointer.x - pointer.px, dy = pointer.y - pointer.py;
      splat(vel, pointer.x, pointer.y, radius(), [dx * k, dy * k, 0]);
      splat(ink, pointer.x, pointer.y, radius(), inkAt(hue, 0.25 * o.size));
      hue += 0.01;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.moved = false;
    }

    while (clicks.length) {
      const [x, y] = clicks.shift()!;
      splat(ink, x, y, radius() * 3, inkAt(hue, 1.2));
      hue += 0.1;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        splat(vel, x + dx * 0.02, y + dy * 0.02, radius() * 4, [dx * 800 * o.force, dy * 800 * o.force, 0]);
      }
    }

    step(dt);
    pass('display', null, { uTexture: ink.r });

    // shortcut: draws every frame even when idle, add an idle pause if battery matters
    raf = requestAnimationFrame(frame);
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerdown', onDown);
    made.forEach(t => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); });
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}