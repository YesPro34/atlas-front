import { useRef, useEffect } from "react";

export default function SpiderNet() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId: number;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const points: { x: number; y: number; ox: number; oy: number }[] = [];
    const rows = 8, cols = 12;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        points.push({
          x: (x / (cols - 1)) * width,
          y: (y / (rows - 1)) * height,
          ox: (x / (cols - 1)) * width,
          oy: (y / (rows - 1)) * height,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Animate points
      for (let p of points) {
        // Move points slightly based on mouse
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 120 - dist) / 120;
        p.x = p.ox + (dx / dist) * force * 20;
        p.y = p.oy + (dy / dist) * force * 20;
      }
      // Draw lines
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          if (x < cols - 1) {
            const next = idx + 1;
            ctx.beginPath();
            ctx.moveTo(points[idx].x, points[idx].y);
            ctx.lineTo(points[next].x, points[next].y);
            ctx.strokeStyle = "rgba(6,184,157,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (y < rows - 1) {
            const next = idx + cols;
            ctx.beginPath();
            ctx.moveTo(points[idx].x, points[idx].y);
            ctx.lineTo(points[next].x, points[next].y);
            ctx.strokeStyle = "rgba(6,184,157,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    function handleMouseMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    }
    canvas.addEventListener("mousemove", handleMouseMove);

    // Handle resize
    function handleResize() {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      // Update original positions
      let i = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          points[i].ox = (x / (cols - 1)) * width;
          points[i].oy = (y / (rows - 1)) * height;
          i++;
        }
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}