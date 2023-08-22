"use client";
import { useDraw } from "@/hooks/useDraw";
import { FC, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [eraserMode, setEraserMode] = useState<boolean>(false);
  const [shape, setShape] = useState<string | null>(null);
  const [color, setColor] = useState<string>("#000");

  const { canvasRef, mouseDown, downloadCanvas } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = eraserMode ? "rgba(255,255,255,1)" : color;
    const lineWidth = eraserMode ? 50 : 5;
    let startPoint = prevPoint ?? currentPoint;
    if (!shape) {
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
    } else {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      const x = Math.min(0, currX);
      const y = Math.min(0, currY);
      const width = Math.abs(currX - 0);
      const height = Math.abs(currY - 0);

      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;

      // Draw the rectangle using the same operations you provided
      ctx.rect(x, y, width, height);
      ctx.stroke();

      ctx.globalCompositeOperation = "source-over";
    }
  }
  const togglePenMode = () => {
    setEraserMode((prev) => !prev);
  };
  const toggleRect = () => {
    setShape((prev) => (prev === "rectangle" ? null : "rectangle"));
  };
  return (
    <div className="w-screen h-screen bg-white flex flex-row justify-center items-center gap-5">
      <div className="flex gap-2">
        <button
          onClick={downloadCanvas}
          className="p-2 bg-slate-400 rounded-md text-white"
        >
          Download Drawing
        </button>
        <button
          onClick={togglePenMode}
          className="p-2 bg-slate-400 rounded-md text-white"
        >
          {eraserMode ? "✏️" : "🧽"}
        </button>
        <button
          onClick={toggleRect}
          className="p-2 bg-slate-400 rounded-md text-white"
        >
          {shape ? "❌" : "▭"}
        </button>
        <input
          type="color"
          onChange={(e) => setColor(e.target.value)}
          value={color}
        />
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={mouseDown}
        width={650}
        height={650}
        className="border border-black rounded-md"
      />
    </div>
  );
};
export default page;
