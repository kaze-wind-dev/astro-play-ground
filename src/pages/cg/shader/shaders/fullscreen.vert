// 全章で共通の頂点シェーダー。
// 本のオンラインエディタでは隠れているが、自前で動かすには必要になる。
// 画面を覆う三角形をそのままクリップ空間に置くだけで、計算は何もしない。
// フラグメント側では uv の varying ではなく gl_FragCoord を使う（本と同じ流儀）。

attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
