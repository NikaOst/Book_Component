import { useMemo } from "react";

export default function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => {
        // alternate between blue and yellow hues
        const colors = [
          'rgba(30,144,255,0.6)', // dodge blue
          'rgba(255,223,0,0.6)',   // Ukrainian yellow
        ];
        return {
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          delay: `${Math.random() * 5}s`,
          duration: `${3 + Math.random() * 4}s`,
          size: `${2 + Math.random() * 3}px`,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      }),
    []
  );

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `float-particle ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
