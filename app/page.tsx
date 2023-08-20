"use client";
import { useDraw } from "@/hooks/useDraw";
import { FC, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [eraserMode, setEraserMode] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000");
  const { canvasRef, mouseDown, downloadCanvas } = useDraw(drawLine);

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const lineColor = eraserMode ? "rgba(255,255,255,1)" : color;
    const lineWidth = eraserMode ? 50 : 5;
    if (eraserMode) {
      // Set globalCompositeOperation to "destination-out" for erasing
      ctx.globalCompositeOperation = "destination-out";
    } else {
      // Reset to default "source-over" mode for drawing
      ctx.globalCompositeOperation = "source-over";
    }

    let startPoint = prevPoint ?? currentPoint;
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
  }
  const eraserModeHandler = () => {
    setEraserMode((prev) => !prev);
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
          onClick={eraserModeHandler}
          className="p-2 bg-slate-400 rounded-md text-white"
        >
          {eraserMode ? "✏️" : "🧽"}
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
