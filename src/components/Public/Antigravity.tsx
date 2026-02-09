import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

type ParticleShape = "circle" | "square" | "capsule";

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: ParticleShape;
  fieldStrength?: number;
  className?: string;
  style?: CSSProperties;
}

interface Particle {
  angle: number;
  radius: number;
  offset: number;
  depth: number;
  x: number;
  y: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  if (Number.isNaN(bigint)) return `rgba(82,39,255,${alpha})`;
  const r =
    normalized.length === 3
      ? parseInt(normalized[0] + normalized[0], 16)
      : (bigint >> 16) & 255;
  const g =
    normalized.length === 3
      ? parseInt(normalized[1] + normalized[1], 16)
      : (bigint >> 8) & 255;
  const b =
    normalized.length === 3
      ? parseInt(normalized[2] + normalized[2], 16)
      : bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const drawCapsule = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) => {
  const radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(-width / 2 + radius, -height / 2);
  ctx.lineTo(width / 2 - radius, -height / 2);
  ctx.arc(width / 2 - radius, 0, radius, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(-width / 2 + radius, height / 2);
  ctx.arc(-width / 2 + radius, 0, radius, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
  ctx.fill();
};

const Antigravity = ({
  count = 300,
  magnetRadius = 6,
  ringRadius = 7,
  waveSpeed = 0.4,
  waveAmplitude = 1,
  particleSize = 1.5,
  lerpSpeed = 0.05,
  color = "#5227FF",
  autoAnimate = true,
  particleVariance = 1,
  rotationSpeed = 0,
  depthFactor = 1,
  pulseSpeed = 3,
  particleShape = "capsule",
  fieldStrength = 10,
  className,
  style,
}: AntigravityProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let centerX = 0;
    let centerY = 0;
    const particles: Particle[] = [];

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius =
          ringRadius * scale +
          (Math.random() - 0.5) * particleVariance * scale;
        particles.push({
          angle,
          radius,
          offset: Math.random() * Math.PI * 2,
          depth: Math.random(),
          x: centerX,
          y: centerY,
        });
      }
    };

    const resize = () => {
      const { width: w, height: h } = canvas.getBoundingClientRect();
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = w;
      height = h;
      scale = Math.min(width, height) / 20;
      centerX = width / 2;
      centerY = height / 2;
      createParticles();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const draw = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = hexToRgba(color, 0.15);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius * scale, 0, Math.PI * 2);
      ctx.stroke();

      particles.forEach((p) => {
        const wave = Math.sin(t * waveSpeed + p.offset) * waveAmplitude * scale;
        const spin = rotationSpeed * t;
        const targetAngle = p.angle + spin;
        const targetRadius = ringRadius * scale + wave + p.radius * 0.08;

        let tx = centerX + Math.cos(targetAngle) * targetRadius;
        let ty = centerY + Math.sin(targetAngle) * targetRadius;

        const attraction = Math.min(0.12, fieldStrength * 0.004);
        const distance = Math.hypot(tx - centerX, ty - centerY);
        const magnetZone = magnetRadius * scale;
        const pull =
          distance > magnetZone ? attraction : Math.max(0.02, attraction * 0.4);
        tx = lerp(tx, centerX, pull);
        ty = lerp(ty, centerY, pull);

        p.x = lerp(p.x, tx, lerpSpeed);
        p.y = lerp(p.y, ty, lerpSpeed);

        const depth =
          (Math.sin(t * waveSpeed + p.angle) * 0.5 + 0.5) * depthFactor;
        const pulse =
          1 + Math.sin(t * pulseSpeed + p.offset) * 0.15 * depthFactor;
        const size = particleSize * scale * 0.04 * pulse * (0.7 + depth);

        ctx.fillStyle = hexToRgba(color, 0.2 + depth * 0.5);

        if (particleShape === "square") {
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
          return;
        }

        if (particleShape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
          ctx.fill();
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(targetAngle + Math.PI / 2);
        drawCapsule(ctx, size * 2.4, size);
        ctx.restore();
      });

      if (autoAnimate) {
        frameId = requestAnimationFrame(draw);
      }
    };

    draw(0);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [
    autoAnimate,
    color,
    count,
    depthFactor,
    fieldStrength,
    lerpSpeed,
    magnetRadius,
    particleShape,
    particleSize,
    particleVariance,
    pulseSpeed,
    ringRadius,
    rotationSpeed,
    waveAmplitude,
    waveSpeed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden
    />
  );
};

export default Antigravity;
