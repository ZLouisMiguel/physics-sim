export function drawSimulation(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const scale = 10;
  const margin = 50;

  const x = margin + state.x * scale;
  const y = ctx.canvas.height - margin - state.y * scale;

  // ground
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height - margin);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height - margin);
  ctx.stroke();

  // projectile
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fill();
}

export function drawGraph(ctx, points) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const margin = 50;
  const scale = 10;

  // grid + numbers
  ctx.strokeStyle = "#ddd";
  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";

  for (let x = 0; x <= ctx.canvas.width - margin * 2; x += 50) {
    const px = margin + x;
    ctx.beginPath();
    ctx.moveTo(px, margin);
    ctx.lineTo(px, ctx.canvas.height - margin);
    ctx.stroke();
    ctx.fillText(
      (x / scale).toFixed(0),
      px - 10,
      ctx.canvas.height - margin + 15
    );
  }

  for (let y = 0; y <= ctx.canvas.height - margin * 2; y += 50) {
    const py = ctx.canvas.height - margin - y;
    ctx.beginPath();
    ctx.moveTo(margin, py);
    ctx.lineTo(ctx.canvas.width - margin, py);
    ctx.stroke();
    ctx.fillText((y / scale).toFixed(0), margin - 30, py + 4);
  }

  // axes
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, ctx.canvas.height - margin);
  ctx.lineTo(ctx.canvas.width - margin, ctx.canvas.height - margin);
  ctx.stroke();

  // trajectory
  ctx.beginPath();
  points.forEach((p, i) => {
    const cx = margin + p.x * scale;
    const cy = ctx.canvas.height - margin - p.y * scale;
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();

  // peak & range
  const peak = points.reduce((a, b) => (b.y > a.y ? b : a));
  const range = points[points.length - 1];

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    margin + peak.x * scale,
    ctx.canvas.height - margin - peak.y * scale,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(
    margin + range.x * scale,
    ctx.canvas.height - margin,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();
}
