import {
  AfterViewInit, Component, ElementRef, inject, Input, NgZone,
  OnDestroy, PLATFORM_ID, ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const VS = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FSH = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
`;

const FS_SPLAT = FSH + `
  uniform sampler2D uVel;
  uniform vec2 uPoint, uForce;
  uniform float uRadius, uAspect;
  void main() {
    vec2 d = vUv - uPoint;
    d.x *= uAspect;
    float g = exp(-dot(d, d) / uRadius);
    o = vec4(texture(uVel, vUv).xy + uForce * g, 0.0, 1.0);
  }`;

const FS_ADV_VEL = FSH + `
  uniform sampler2D uVel;
  uniform float uDt, uDiss;
  void main() {
    vec2 v = texture(uVel, vUv).xy;
    vec2 c = vUv - v * uDt;
    o = vec4(texture(uVel, c).xy * uDiss, 0.0, 1.0);
  }`;

const FS_ADV_DYE = FSH + `
  uniform sampler2D uDye, uVel, uOrig;
  uniform vec2 uTexel, uRes, uImgRes;
  uniform float uDt, uRelax;
  vec2 coverUV(vec2 uv) {
    float ca = uRes.x / uRes.y, ia = uImgRes.x / uImgRes.y;
    vec2 s = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
    return (uv - 0.5) * s + 0.5;
  }
  void main() {
    vec2 v = texture(uVel, vUv).xy;
    vec2 c = vUv - v * uDt;
    vec3 a = texture(uDye, c).rgb * 0.4;
    a += texture(uDye, c + vec2(uTexel.x, 0.0)).rgb * 0.15;
    a += texture(uDye, c - vec2(uTexel.x, 0.0)).rgb * 0.15;
    a += texture(uDye, c + vec2(0.0, uTexel.y)).rgb * 0.15;
    a += texture(uDye, c - vec2(0.0, uTexel.y)).rgb * 0.15;
    vec3 target = texture(uOrig, coverUV(vUv)).rgb;
    o = vec4(mix(a, target, uRelax), 1.0);
  }`;

const FS_DISPLAY = FSH + `
  uniform sampler2D uDye, uVel;
  void main() {
    vec2 v = texture(uVel, vUv).xy;
    float s = length(v);
    vec3 col = texture(uDye, vUv - v * 0.35).rgb;
    float motion = smoothstep(0.0, 0.04, s);
    vec2 dir = v / (s + 1e-5);
    float light = dot(dir, normalize(vec2(-0.6, 0.8)));
    col += vec3(1.0, 0.95, 0.92) * motion * (0.5 + 0.5 * light) * 0.05;
    o = vec4(clamp(col, 0.0, 1.0), 1.0);
  }`;

type Target = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };
type Program = { prog: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };

@Component({
  selector: 'app-liquid-background',
  standalone: true,
  templateUrl: './liquid-background.component.html',
  styleUrls: ['./liquid-background.component.scss'],
})
export class LiquidBackgroundComponent implements AfterViewInit, OnDestroy {
  @Input() src = '';

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private gl: WebGL2RenderingContext | null = null;
  private programs!: { splat: Program; advVel: Program; advDye: Program; display: Program };
  private velPair: Target[] = [];
  private dyePair: Target[] = [];
  private origTex: WebGLTexture | null = null;
  private imgW = 1;
  private imgH = 1;
  private W = 1;
  private H = 1;
  private ready = false;
  private rafId = 0;
  private pointer = { x: 0.5, y: 0.5, fx: 0, fy: 0, moved: false };

  private readonly onResize = () => this.resize();
  private readonly onPointer = (e: PointerEvent) => this.onPoint(e.clientX, e.clientY);

 private readonly zone = inject(NgZone);
private readonly platformId = inject(PLATFORM_ID);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.zone.runOutsideAngular(() => this.init());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('pointerdown', this.onPointer);
    this.gl?.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private init(): void {
    const canvas = this.canvasRef.nativeElement;
    const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
    if (!gl || !gl.getExtension('EXT_color_buffer_float')) return;
    this.gl = gl;

    this.programs = {
      splat: this.makeProgram(FS_SPLAT),
      advVel: this.makeProgram(FS_ADV_VEL),
      advDye: this.makeProgram(FS_ADV_DYE),
      display: this.makeProgram(FS_DISPLAY),
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    this.resize();
    window.addEventListener('resize', this.onResize);
    window.addEventListener('pointermove', this.onPointer);
    window.addEventListener('pointerdown', this.onPointer);
    this.loadImage();

    const loop = () => {
      this.frame();
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private loadImage(): void {
    const gl = this.gl!;
    const img = new Image();
    img.onload = () => {
      this.imgW = img.naturalWidth;
      this.imgH = img.naturalHeight;
      this.origTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.origTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      this.ready = true;
      this.initDye();
    };
    img.src = this.src;
  }

  private makeProgram(fs: string): Program {
    const gl = this.gl!;
    const compile = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? '');
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? '');

    const u: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return { prog, u };
  }

  private makeTarget(w: number, h: number): Target {
    const gl = this.gl!;
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
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fbo, w, h };
  }

  private run(
    p: Program,
    out: Target | null,
    texs: Record<string, WebGLTexture | null>,
    uni: Record<string, number | number[]>,
  ): void {
    const gl = this.gl!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fbo : null);
    gl.viewport(0, 0, out ? out.w : this.W, out ? out.h : this.H);
    gl.useProgram(p.prog);

    let unit = 0;
    for (const name in texs) {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texs[name]);
      gl.uniform1i(p.u[name], unit++);
    }
    for (const name in uni) {
      const v = uni[name];
      if (Array.isArray(v)) gl.uniform2fv(p.u[name], v);
      else gl.uniform1f(p.u[name], v);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private swap(pair: Target[]): void {
    [pair[0], pair[1]] = [pair[1], pair[0]];
  }

  private initDye(): void {
    this.run(
      this.programs.advDye,
      this.dyePair[1],
      { uDye: this.dyePair[0].tex, uVel: this.velPair[0].tex, uOrig: this.origTex },
      {
        uTexel: [1 / this.W, 1 / this.H],
        uRes: [this.W, this.H],
        uImgRes: [this.imgW, this.imgH],
        uDt: 0,
        uRelax: 1,
      },
    );
    this.swap(this.dyePair);
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.W = Math.floor(window.innerWidth * dpr);
    this.H = Math.floor(window.innerHeight * dpr);
    canvas.width = this.W;
    canvas.height = this.H;

    this.velPair = [
      this.makeTarget(this.W >> 1, this.H >> 1),
      this.makeTarget(this.W >> 1, this.H >> 1),
    ];
    this.dyePair = [this.makeTarget(this.W, this.H), this.makeTarget(this.W, this.H)];
    if (this.ready) this.initDye();
  }

  private onPoint(clientX: number, clientY: number): void {
    const nx = clientX / window.innerWidth;
    const ny = 1 - clientY / window.innerHeight;
    this.pointer.fx += (nx - this.pointer.x) * 2.5;
    this.pointer.fy += (ny - this.pointer.y) * 2.5;
    this.pointer.x = nx;
    this.pointer.y = ny;
    this.pointer.moved = true;
  }

  private frame(): void {
    if (!this.ready) return;
    const P = this.programs;

    if (this.pointer.moved) {
      this.run(P.splat, this.velPair[1], { uVel: this.velPair[0].tex }, {
        uPoint: [this.pointer.x, this.pointer.y],
        uForce: [this.pointer.fx, this.pointer.fy],
        uRadius: 0.0012,
        uAspect: this.W / this.H,
      });
      this.swap(this.velPair);
      this.pointer.fx = 0;
      this.pointer.fy = 0;
      this.pointer.moved = false;
    }

    this.run(P.advVel, this.velPair[1], { uVel: this.velPair[0].tex }, { uDt: 0.9, uDiss: 0.985 });
    this.swap(this.velPair);

    this.run(P.advDye, this.dyePair[1], {
      uDye: this.dyePair[0].tex,
      uVel: this.velPair[0].tex,
      uOrig: this.origTex,
    }, {
      uTexel: [1 / this.W, 1 / this.H],
      uRes: [this.W, this.H],
      uImgRes: [this.imgW, this.imgH],
      uDt: 0.9,
      uRelax: 0.006,
    });
    this.swap(this.dyePair);

    this.run(P.display, null, { uDye: this.dyePair[0].tex, uVel: this.velPair[0].tex }, {});
  }
}
