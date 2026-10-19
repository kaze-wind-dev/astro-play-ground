/**
 * 全画面フラグメントシェーダーを動かすための最小ラッパー。
 * ライブラリは使わず、WebGL2 の API をそのまま呼んでいる。
 *
 * The Book of Shaders に合わせて GLSL ES 1.00（`gl_FragColor` を使う書き方）を
 * 前提にしている。WebGL2 のコンテキストは `#version 300 es` が無ければ
 * ES 1.00 として扱うので、本のコードをそのまま貼れる。
 *
 * uniform の名前と意味も本に揃えてある。
 * - `u_time`       : float / 開始からの経過秒
 * - `u_resolution` : vec2  / キャンバスの実ピクセルサイズ
 * - `u_mouse`      : vec2  / カーソル位置（左下原点の実ピクセル）
 */

type UniformValue = number | number[];

export type ShaderCanvasOptions = {
  canvas: HTMLCanvasElement;
  vertex: string;
  fragment: string;
};

export type ShaderCanvas = {
  start: () => void;
  stop: () => void;
  setUniform: (name: string, value: UniformValue) => void;
  destroy: () => void;
};

/**
 * 画面を覆う三角形。4頂点の矩形より1つ少ない頂点で同じ範囲を塗れる。
 * クリップ空間の -1〜1 をはみ出す分はラスタライズ時に捨てられる。
 */
const FULLSCREEN_TRIANGLE = new Float32Array([-1, -1, 3, -1, -1, 3]);

/** Retina で解像度が暴れるのを防ぐ上限 */
const MAX_DPR = 2;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('シェーダーオブジェクトを作成できませんでした');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(log ?? 'シェーダーのコンパイルに失敗しました');
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vertexSource: string,
  fragmentSource: string,
): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  const program = gl.createProgram();
  if (!program) throw new Error('プログラムを作成できませんでした');

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // リンク後は個々のシェーダーは不要
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(log ?? 'プログラムのリンクに失敗しました');
  }
  return program;
}

export function createShaderCanvas({
  canvas,
  vertex,
  fragment,
}: ShaderCanvasOptions): ShaderCanvas {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
  if (!gl) throw new Error('WebGL2 が利用できません');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, FULLSCREEN_TRIANGLE, gl.STATIC_DRAW);

  const program = createProgram(gl, vertex, fragment);
  gl.useProgram(program);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  if (aPosition < 0) {
    throw new Error('頂点シェーダーに attribute "aPosition" が見つかりません');
  }
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  // getUniformLocation は毎フレーム呼ぶには重いのでキャッシュする
  const locationCache = new Map<string, WebGLUniformLocation | null>();

  const setUniform = (name: string, value: UniformValue) => {
    if (!locationCache.has(name)) {
      locationCache.set(name, gl.getUniformLocation(program, name));
    }
    const location = locationCache.get(name) ?? null;
    // シェーダー側で使われていない uniform は最適化で消えるため、黙って無視する
    if (!location) return;

    if (typeof value === 'number') {
      gl.uniform1f(location, value);
      return;
    }
    switch (value.length) {
      case 2:
        gl.uniform2fv(location, value);
        break;
      case 3:
        gl.uniform3fv(location, value);
        break;
      case 4:
        gl.uniform4fv(location, value);
        break;
      default:
        throw new Error(
          `uniform "${name}" の要素数 ${value.length} は未対応です`,
        );
    }
  };

  /** 累積の経過秒 */
  let elapsed = 0;

  const draw = () => {
    setUniform('u_time', elapsed);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    setUniform('u_resolution', [canvas.width, canvas.height]);
  };

  const handlePointerMove = (event: PointerEvent) => {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    // gl_FragCoord と向きを揃えるため、左下原点の実ピクセルに変換する
    setUniform('u_mouse', [
      ((event.clientX - left) / width) * canvas.width,
      (1 - (event.clientY - top) / height) * canvas.height,
    ]);
  };

  let rafId = 0;
  let lastNow: number | null = null;

  const loop = (now: number) => {
    // 差分で足すので stop/start を挟んでも時間が飛ばない
    if (lastNow !== null) elapsed += (now - lastNow) / 1000;
    lastNow = now;
    draw();
    rafId = requestAnimationFrame(loop);
  };

  const start = () => {
    if (rafId !== 0) return;
    lastNow = null; // 再開直後の差分をゼロにする
    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    if (rafId === 0) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    // 停止中でもサイズ変更は反映したいので1フレームだけ描く
    if (rafId === 0) draw();
  });

  canvas.addEventListener('pointermove', handlePointerMove);

  resize();
  setUniform('u_mouse', [canvas.width / 2, canvas.height / 2]);
  draw();
  resizeObserver.observe(canvas);

  const destroy = () => {
    stop();
    resizeObserver.disconnect();
    canvas.removeEventListener('pointermove', handlePointerMove);
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
  };

  return { start, stop, setUniform, destroy };
}
