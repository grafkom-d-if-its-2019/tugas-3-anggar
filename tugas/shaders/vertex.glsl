attribute vec4 aPosition;

uniform float theta;
uniform float yscale;
uniform float offsetX;

void main() {
  mat4 translate = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		offsetX, 0.0, 0.0, 1.0
	);

  mat4 retranslate = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		-offsetX, 0.0, 0.0, 1.0
	);

  mat4 scale = mat4(
    yscale, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
  );

	mat4 rotate = mat4(
		cos(theta), sin(theta), 0.0, 0.0,
		-sin(theta), cos(theta), 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	);

  gl_Position = retranslate * scale * rotate * translate * aPosition;
  gl_PointSize = 10.0;
}
