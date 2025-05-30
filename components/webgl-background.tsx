"use client"

import { useEffect, useRef, useCallback } from "react"

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const programRef = useRef<WebGLProgram | null>(null)
  const positionLocationRef = useRef<number | null>(null)
  const texCoordLocationRef = useRef<number | null>(null)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)
  const bufferRef = useRef<WebGLBuffer | null>(null)

  const render = useCallback((time: number, gl: WebGLRenderingContext, canvas: HTMLCanvasElement) => {
    if (
      !canvas ||
      !programRef.current ||
      positionLocationRef.current === null ||
      texCoordLocationRef.current === null ||
      timeLocationRef.current === null ||
      resolutionLocationRef.current === null ||
      bufferRef.current === null
    )
      return

    time *= 0.001 // Convert to seconds

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(programRef.current)

    gl.enableVertexAttribArray(positionLocationRef.current)
    gl.enableVertexAttribArray(texCoordLocationRef.current)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current)
    gl.vertexAttribPointer(positionLocationRef.current, 2, gl.FLOAT, false, 16, 0)
    gl.vertexAttribPointer(texCoordLocationRef.current, 2, gl.FLOAT, false, 16, 8)

    gl.uniform1f(timeLocationRef.current, time)
    gl.uniform2f(resolutionLocationRef.current, canvas.width, canvas.height)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    animationRef.current = requestAnimationFrame((newTime) => render(newTime, gl, canvas))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `

    // Optimized fragment shader for better performance
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;
      
      vec3 aurora(vec2 uv, float time) {
        vec2 p = uv * 2.0 - 1.0;
        p.y += 0.2;
        
        // Simplified wave calculations for better performance
        float wave1 = sin(p.x * 2.0 + time * 0.3) * 0.08;
        float wave2 = sin(p.x * 3.0 + time * 0.5) * 0.04;
        
        float dist = abs(p.y - wave1 - wave2);
        float glow = 1.0 / (dist * 15.0 + 1.0);
        
        // Simplified color mixing
        vec3 color1 = vec3(0.4, 0.1, 0.7); // Deep purple
        vec3 color2 = vec3(0.1, 0.4, 0.8); // Deep blue
        vec3 color3 = vec3(0.2, 0.6, 0.5); // Teal
        
        vec3 finalColor = mix(color1, color2, sin(time * 0.2 + p.x) * 0.5 + 0.5);
        finalColor = mix(finalColor, color3, sin(time * 0.15 + p.x * 1.5) * 0.3 + 0.3);
        
        return finalColor * glow * 0.25;
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec3 color = aurora(uv, u_time);
        
        // Reduced star density for better performance
        vec2 starUv = uv * 30.0;
        vec2 starId = floor(starUv);
        vec2 starPos = fract(starUv) - 0.5;
        
        float starNoise = fract(sin(dot(starId, vec2(12.9898, 78.233))) * 43758.5453);
        if (starNoise > 0.99) {
          float starDist = length(starPos);
          float star = 1.0 / (starDist * 80.0 + 1.0);
          color += vec3(star * 0.3);
        }
        
        gl_FragColor = vec4(color, 1.0);
      }
    `

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type)
      if (!shader) return null

      gl.shaderSource(shader, source)
      gl.compileShader(shader)

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }

      return shader
    }

    function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()
      if (!program) return null

      gl.attachShader(program, vertexShader)
      gl.attachShader(program, fragmentShader)
      gl.linkProgram(program)

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program linking error:", gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
      }

      return program
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    programRef.current = program

    // Set up geometry
    const positions = new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1])

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    bufferRef.current = buffer

    const positionLocation = gl.getAttribLocation(program, "a_position")
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord")
    const timeLocation = gl.getUniformLocation(program, "u_time")
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution")

    positionLocationRef.current = positionLocation
    texCoordLocationRef.current = texCoordLocation
    timeLocationRef.current = timeLocation
    resolutionLocationRef.current = resolutionLocation

    function resize() {
      if (!canvas) return
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    resize()
    window.addEventListener("resize", resize)
    animationRef.current = requestAnimationFrame((time) => render(time, gl, canvas))

    return () => {
      window.removeEventListener("resize", resize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [render])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 opacity-20"
      style={{ background: "#000000" }}
    />
  )
}
