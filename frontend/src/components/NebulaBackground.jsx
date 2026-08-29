import { useEffect, useRef } from "react";

function NebulaBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let animationFrame;
    let particles = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createParticles();
    }

    function createParticles() {
      const count = Math.min(
        90,
        Math.floor((window.innerWidth * window.innerHeight) / 14000)
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.25 + 0.05,
        opacity: Math.random() * 0.5 + 0.15,
        drift: (Math.random() - 0.5) * 0.15,
      }));
    }

    function draw() {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -5) {
          particle.y = window.innerHeight + 5;
          particle.x = Math.random() * window.innerWidth;
        }

        if (particle.x < -5) {
          particle.x = window.innerWidth + 5;
        }

        if (particle.x > window.innerWidth + 5) {
          particle.x = -5;
        }

        ctx.beginPath();

        ctx.arc(
          particle.x,
          particle.y,
          particle.size,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = `rgba(167, 139, 250, ${particle.opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="nebula-background"
      aria-hidden="true"
    />
  );
}

export default NebulaBackground;