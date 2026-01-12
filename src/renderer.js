export function drawSimulation(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const scale = 10;
  const margin = 50;

  const x = margin + state.x * scale;
  const y = ctx.canvas.height - margin - state.y * scale;

  // Draw sky background
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height - margin);

  // Draw ground with gradient
  const groundGradient = ctx.createLinearGradient(
    0,
    ctx.canvas.height - margin,
    0,
    ctx.canvas.height
  );
  groundGradient.addColorStop(0, "#8B4513");
  groundGradient.addColorStop(1, "#654321");
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, ctx.canvas.height - margin, ctx.canvas.width, margin);

  // Draw ground line
  ctx.beginPath();
  ctx.moveTo(0, ctx.canvas.height - margin);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height - margin);
  ctx.strokeStyle = "#654321";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw projectile with gradient
  const projectileGradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
  projectileGradient.addColorStop(0, "#FFD700");
  projectileGradient.addColorStop(1, "#FF8C00");

  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.fillStyle = projectileGradient;
  ctx.fill();

  // Add a subtle shadow to the projectile
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

export function drawGraph(ctx, points) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const margin = 50;
  const scale = 10;

  // Draw graph background
  ctx.fillStyle = "#F8F9FA";
  ctx.fillRect(
    margin,
    margin,
    ctx.canvas.width - margin * 2,
    ctx.canvas.height - margin * 2
  );

  // Draw grid
  ctx.strokeStyle = "#E9ECEF";
  ctx.lineWidth = 0.5;
  ctx.font = "12px Arial";

  for (let x = 0; x <= ctx.canvas.width - margin * 2; x += 50) {
    const px = margin + x;
    ctx.beginPath();
    ctx.moveTo(px, margin);
    ctx.lineTo(px, ctx.canvas.height - margin);
    ctx.stroke();
    ctx.fillStyle = "#6C757D";
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
    ctx.fillStyle = "#6C757D";
    ctx.fillText((y / scale).toFixed(0), margin - 30, py + 4);
  }

  // Draw axes
  ctx.strokeStyle = "#495057";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(margin, margin);
  ctx.lineTo(margin, ctx.canvas.height - margin);
  ctx.lineTo(ctx.canvas.width - margin, ctx.canvas.height - margin);
  ctx.stroke();

  // Draw trajectory line
  ctx.beginPath();
  ctx.strokeStyle = "#4A90E2";
  ctx.lineWidth = 2;
  points.forEach((p, i) => {
    const cx = margin + p.x * scale;
    const cy = ctx.canvas.height - margin - p.y * scale;
    if (i === 0) ctx.moveTo(cx, cy);
    else ctx.lineTo(cx, cy);
  });
  ctx.stroke();

  // Calculate peak and range
  const peak = points.reduce((a, b) => (b.y > a.y ? b : a));
  const range = points[points.length - 1];

  // Draw peak point and label
  const peakX = margin + peak.x * scale;
  const peakY = ctx.canvas.height - margin - peak.y * scale;

  ctx.fillStyle = "#DC3545";
  ctx.beginPath();
  ctx.arc(peakX, peakY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Peak label
  ctx.fillStyle = "#DC3545";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`Peak: ${peak.y.toFixed(1)}m`, peakX + 10, peakY - 10);

  // Draw range point and label
  const rangeX = margin + range.x * scale;
  const rangeY = ctx.canvas.height - margin;

  ctx.fillStyle = "#28A745";
  ctx.beginPath();
  ctx.arc(rangeX, rangeY, 6, 0, Math.PI * 2);
  ctx.fill();

  // Range label
  ctx.fillStyle = "#28A745";
  ctx.font = "bold 14px Arial";
  ctx.fillText(`Range: ${range.x.toFixed(1)}m`, rangeX + 10, rangeY - 10);

  // Add title
  ctx.fillStyle = "#212529";
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Projectile Trajectory", ctx.canvas.width / 2, 30);

  // Reset text alignment
  ctx.textAlign = "start";
}
