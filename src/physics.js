const g = 9.81;

export function trajectory(v0, angle, dt = 0.02) {
  const points = [];
  let t = 0;

  const vx = v0 * Math.cos(angle);
  const vy = v0 * Math.sin(angle);

  while (true) {
    const x = vx * t;
    const y = (vy * t) - (0.5 * g * t * t);

    if (y < 0) break;

    points.push({ x, y });
    t += dt;
  }

  return points;
}
