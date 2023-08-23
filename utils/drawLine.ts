type DrawLine = Draw & {
  color: string;
  eraserMode: boolean;
};

export const drawLine = ({
  prevPoint,
  currentPoint,
  ctx,
  color,
  eraserMode,
}: DrawLine) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = eraserMode ? "rgba(255,255,255,1)" : color;
  const lineWidth = eraserMode ? 50 : 5;
  let startPoint = prevPoint ?? currentPoint;

  if (eraserMode) {
    // Set globalCompositeOperation to "destination-out" for erasing
    ctx.globalCompositeOperation = "destination-out";
  } else {
    // Reset to default "source-over" mode for drawing
    ctx.globalCompositeOperation = "source-over";
  }

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
  ctx.fill();

  ctx.globalCompositeOperation = "source-over";
};
