import { useEffect, useRef } from 'react';

interface TesseractAnimationProps {
  className?: string;
}

const TesseractAnimation = ({ className = "" }: TesseractAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGPU support
    if (!navigator.gpu) {
      console.warn("WebGPU not supported, showing static background");
      return;
    }

    let device: GPUDevice | null = null;
    let context: GPUCanvasContext | null = null;
    let pipeline: GPURenderPipeline | null = null;
    let vertexBuffer: GPUBuffer | null = null;
    let uniformBuffer: GPUBuffer | null = null;
    let bindGroup: GPUBindGroup | null = null;
    let lineVertexData: Float32Array | null = null;

    const initWebGPU = async () => {
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          console.warn("No appropriate GPUAdapter found");
          return;
        }

        device = await adapter.requestDevice();
        context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
        const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
        
        const resizeCanvas = () => {
          const rect = canvas.getBoundingClientRect();
          const devicePixelRatio = window.devicePixelRatio || 1;
          canvas.width = rect.width * devicePixelRatio;
          canvas.height = rect.height * devicePixelRatio;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        context.configure({
          device,
          format: presentationFormat,
          alphaMode: 'premultiplied',
        });

        // Tesseract Geometry (4D)
        const vertices4D = [];
        for (let i = 0; i < 16; i++) {
          vertices4D.push([
            (i & 1) ? 1 : -1,
            (i & 2) ? 1 : -1,
            (i & 4) ? 1 : -1,
            (i & 8) ? 1 : -1
          ]);
        }

        const edges = [
          0,1, 0,2, 0,4, 0,8, 1,3, 1,5, 1,9, 2,3, 2,6, 2,10, 3,7, 3,11,
          4,5, 4,6, 4,12, 5,7, 5,13, 6,7, 6,14, 7,15, 8,9, 8,10, 8,12,
          9,11, 9,13, 10,11, 10,14, 11,15, 12,13, 12,14, 13,15, 14,15
        ];

        lineVertexData = new Float32Array(edges.length * 2 * 3);

        // Shader
        const shaderModule = device.createShaderModule({
          code: `
            struct Uniforms {
              mvpMatrix: mat4x4<f32>,
            };
            @binding(0) @group(0) var<uniform> uniforms: Uniforms;

            struct VertexOutput {
              @builtin(position) position: vec4<f32>,
            };

            @vertex
            fn vertex_main(@location(0) position: vec3<f32>) -> VertexOutput {
              var output: VertexOutput;
              output.position = uniforms.mvpMatrix * vec4<f32>(position, 1.0);
              return output;
            }

            @fragment
            fn fragment_main() -> @location(0) vec4<f32> {
              return vec4<f32>(0.75, 0.5, 1.0, 1.0);
            }
          `,
        });

        // Render Pipeline
        pipeline = device.createRenderPipeline({
          layout: 'auto',
          vertex: {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [{
              arrayStride: 3 * 4,
              attributes: [{
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3',
              }],
            }],
          },
          fragment: {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{
              format: presentationFormat,
            }],
          },
          primitive: {
            topology: 'line-list',
          },
        });

        // Buffers
        vertexBuffer = device.createBuffer({
          size: lineVertexData.byteLength,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        const uniformBufferSize = 4 * 4 * 4;
        uniformBuffer = device.createBuffer({
          size: uniformBufferSize,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{
            binding: 0,
            resource: {
              buffer: uniformBuffer,
            },
          }],
        });

        // Matrix math helpers
        const mat4 = {
          create: () => new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
          ]),
          multiply: (out: Float32Array, a: Float32Array, b: Float32Array) => {
            let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
            let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
            let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
            let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

            let b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
            let b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
            let b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
            let b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

            out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
            out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
            out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
            out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
            out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
            out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
            out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
            out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
            out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
            out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
            out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
            out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
            out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
            out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
            out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
            out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
            return out;
          },
          perspective: (out: Float32Array, fovy: number, aspect: number, near: number, far: number) => {
            const f = 1.0 / Math.tan(fovy / 2);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[11] = -1;
            out[15] = 0;
            if (far != null && far !== Infinity) {
              const nf = 1 / (near - far);
              out[10] = (far + near) * nf;
              out[14] = 2 * far * near * nf;
            } else {
              out[10] = -1;
              out[14] = -2 * near;
            }
          }
        };

        // Animation loop
        let angle = 0;
        const frame = () => {
          if (!device || !context || !pipeline || !vertexBuffer || !uniformBuffer || !bindGroup || !lineVertexData) {
            return;
          }

          angle += 0.005;
          
          // Rotation in the XW plane
          const rotXW = [
            Math.cos(angle), 0, 0, -Math.sin(angle),
            0, 1, 0, 0,
            0, 0, 1, 0,
            Math.sin(angle), 0, 0, Math.cos(angle)
          ];

          // Rotation in the YZ plane
          const rotYZ = [
            1, 0, 0, 0,
            0, Math.cos(angle * 0.7), -Math.sin(angle * 0.7), 0,
            0, Math.sin(angle * 0.7), Math.cos(angle * 0.7), 0,
            0, 0, 0, 1
          ];

          const rotatedVertices = vertices4D.map(v => {
            let v1 = [
              v[0] * rotXW[0] + v[3] * rotXW[3],
              v[1],
              v[2],
              v[0] * rotXW[12] + v[3] * rotXW[15]
            ];
            let v2 = [
              v1[0],
              v1[1] * rotYZ[5] + v1[2] * rotYZ[6],
              v1[1] * rotYZ[9] + v1[2] * rotYZ[10],
              v1[3]
            ];
            return v2;
          });
          
          // Project 4D points to 3D
          const distance = 4;
          const projectedVertices3D = rotatedVertices.map(v => {
            const w = 1 / (distance - v[3]);
            return [v[0] * w, v[1] * w, v[2] * w];
          });

          // Update vertex data
          for (let i = 0; i < edges.length; i += 2) {
            const p1 = projectedVertices3D[edges[i]];
            const p2 = projectedVertices3D[edges[i+1]];
            const baseIndex = i * 3;
            lineVertexData[baseIndex] = p1[0];
            lineVertexData[baseIndex + 1] = p1[1];
            lineVertexData[baseIndex + 2] = p1[2];
            lineVertexData[baseIndex + 3] = p2[0];
            lineVertexData[baseIndex + 4] = p2[1];
            lineVertexData[baseIndex + 5] = p2[2];
          }
          device.queue.writeBuffer(vertexBuffer, 0, lineVertexData);

          // MVP Matrix
          const aspect = canvas.width / canvas.height;
          const projectionMatrix = mat4.create();
          mat4.perspective(projectionMatrix, (2 * Math.PI) / 5, aspect, 0.1, 100.0); // Reduced near plane from 1 to 0.1

          const viewMatrix = mat4.create();
          viewMatrix[14] = -1.7; // Moved closer to make it appear larger (was -2.5)
          
          const mvpMatrix = mat4.create();
          mat4.multiply(mvpMatrix, projectionMatrix, viewMatrix);
          device.queue.writeBuffer(uniformBuffer, 0, mvpMatrix);

          // Render
          const commandEncoder = (device as any).createCommandEncoder();
          const textureView = context.getCurrentTexture().createView();
          const renderPassDescriptor = {
            colorAttachments: [{
              view: textureView,
              clearValue: { r: 0.05, g: 0.05, b: 0.07, a: 1.0 },
              loadOp: 'clear',
              storeOp: 'store',
            }],
          };

          const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
          passEncoder.setPipeline(pipeline);
          passEncoder.setBindGroup(0, bindGroup);
          passEncoder.setVertexBuffer(0, vertexBuffer);
          passEncoder.draw(edges.length * 2, 1, 0, 0);
          passEncoder.end();

          device.queue.submit([commandEncoder.finish()]);
          animationRef.current = requestAnimationFrame(frame);
        };

        animationRef.current = requestAnimationFrame(frame);

        return () => {
          window.removeEventListener('resize', resizeCanvas);
        };

      } catch (error) {
        console.error('Failed to initialize WebGPU:', error);
      }
    };

    initWebGPU();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'linear-gradient(to bottom right, #000000, #111111, #000000)' }}
    />
  );
};

export default TesseractAnimation; 