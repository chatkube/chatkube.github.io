// WebGPU TypeScript declarations
declare global {
  interface Navigator {
    gpu: GPU | undefined;
  }

  interface GPU {
    requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
    getPreferredCanvasFormat(): GPUTextureFormat;
  }

  interface GPURequestAdapterOptions {
    powerPreference?: 'low-power' | 'high-performance';
    forceFallbackAdapter?: boolean;
  }

  interface GPUAdapter {
    requestDevice(descriptor?: GPUDeviceDescriptor): Promise<GPUDevice>;
  }

  interface GPUDeviceDescriptor {
    requiredFeatures?: GPUFeatureName[];
    requiredLimits?: Record<string, number>;
  }

  interface GPUDevice {
    createShaderModule(descriptor: GPUShaderModuleDescriptor): GPUShaderModule;
    createRenderPipeline(descriptor: GPURenderPipelineDescriptor): GPURenderPipeline;
    createBuffer(descriptor: GPUBufferDescriptor): GPUBuffer;
    createBindGroup(descriptor: GPUBindGroupDescriptor): GPUBindGroup;
    queue: GPUQueue;
  }

  interface GPUShaderModuleDescriptor {
    code: string;
  }

  interface GPUShaderModule {
    // Add methods as needed
  }

  interface GPURenderPipelineDescriptor {
    layout: GPUPipelineLayout | 'auto';
    vertex: GPUVertexState;
    fragment?: GPUFragmentState;
    primitive?: GPUPrimitiveState;
  }

  interface GPUVertexState {
    module: GPUShaderModule;
    entryPoint: string;
    buffers?: GPUVertexBufferLayout[];
  }

  interface GPUVertexBufferLayout {
    arrayStride: number;
    attributes: GPUVertexAttribute[];
  }

  interface GPUVertexAttribute {
    shaderLocation: number;
    offset: number;
    format: GPUVertexFormat;
  }

  type GPUVertexFormat = 'float32x3' | 'float32x4';

  interface GPUFragmentState {
    module: GPUShaderModule;
    entryPoint: string;
    targets: GPUColorTargetState[];
  }

  interface GPUColorTargetState {
    format: GPUTextureFormat;
  }

  interface GPUPrimitiveState {
    topology: GPUPrimitiveTopology;
  }

  type GPUPrimitiveTopology = 'line-list' | 'triangle-list';

  interface GPUBufferDescriptor {
    size: number;
    usage: GPUBufferUsageFlags;
  }

  type GPUBufferUsageFlags = number;
  const GPUBufferUsage: {
    VERTEX: number;
    COPY_DST: number;
    UNIFORM: number;
  };

  interface GPUBuffer {
    // Add methods as needed
  }

  interface GPUBindGroupDescriptor {
    layout: GPUBindGroupLayout;
    entries: GPUBindGroupEntry[];
  }

  interface GPUBindGroupEntry {
    binding: number;
    resource: GPUBindingResource;
  }

  interface GPUBindingResource {
    buffer: GPUBuffer;
  }

  interface GPUBindGroup {
    // Add methods as needed
  }

  interface GPUBindGroupLayout {
    // Add methods as needed
  }

  interface GPURenderPipeline {
    getBindGroupLayout(index: number): GPUBindGroupLayout;
  }

  interface GPUQueue {
    writeBuffer(buffer: GPUBuffer, offset: number, data: BufferSource): void;
    submit(commandBuffers: GPUCommandBuffer[]): void;
  }

  interface GPUCommandBuffer {
    // Add methods as needed
  }

  interface GPUCommandEncoder {
    beginRenderPass(descriptor: GPURenderPassDescriptor): GPURenderPassEncoder;
    finish(): GPUCommandBuffer;
  }

  interface GPURenderPassDescriptor {
    colorAttachments: GPURenderPassColorAttachment[];
  }

  interface GPURenderPassColorAttachment {
    view: GPUTextureView;
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
  }

  interface GPUColor {
    r: number;
    g: number;
    b: number;
    a: number;
  }

  type GPULoadOp = 'clear' | 'load';
  type GPUStoreOp = 'store' | 'discard';

  interface GPURenderPassEncoder {
    setPipeline(pipeline: GPURenderPipeline): void;
    setBindGroup(index: number, bindGroup: GPUBindGroup): void;
    setVertexBuffer(slot: number, buffer: GPUBuffer): void;
    draw(vertexCount: number, instanceCount?: number, firstVertex?: number, firstInstance?: number): void;
    end(): void;
  }

  interface GPUCanvasContext {
    configure(configuration: GPUCanvasConfiguration): void;
    getCurrentTexture(): GPUTexture;
  }

  interface GPUCanvasConfiguration {
    device: GPUDevice;
    format: GPUTextureFormat;
    alphaMode?: GPUCanvasAlphaMode;
  }

  type GPUCanvasAlphaMode = 'premultiplied' | 'unpremultiplied' | 'opaque';

  interface GPUTexture {
    createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
  }

  interface GPUTextureViewDescriptor {
    // Add properties as needed
  }

  interface GPUTextureView {
    // Add methods as needed
  }

  type GPUTextureFormat = 'bgra8unorm' | 'rgba8unorm';

  type GPUFeatureName = string;
}

export {}; 