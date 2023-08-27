"use client";
import { useDraw } from "@/hooks/useDraw";
import { drawLine } from "@/utils/drawLine";
import { FC, useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001/");

interface pageProps {}

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  eraserMode: boolean;
};

const page: FC<pageProps> = ({}) => {
  const [eraserMode, setEraserMode] = useState<boolean>(false);
  // const [shape, setShape] = useState<string | null>(null);
  const [color, setColor] = useState<string>("#000");

  const { canvasRef, mouseDown, downloadCanvas } = useDraw(createLine);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      alert("i got the image");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color, eraserMode }: DrawLine) => {
        if (!ctx) {
          return;
        }
        drawLine({ prevPoint, currentPoint, ctx, color, eraserMode });
      }
    );
    // socket.on("clear",clear)
    return () => {
      socket.off("get-canvas-state");
      socket.off("canvas-state-from-server");
      socket.off("canvas-state-from-server");
      socket.off("draw-line");
      // socket.off()
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      ctx,
      color,
      eraserMode,
    });

    drawLine({ prevPoint, currentPoint, ctx, color, eraserMode });
  }

  const togglePenMode = () => {
    setEraserMode((prev) => !prev);
  };
  // const toggleRect = () => {
  //   setShape((prev) => (prev === "rectangle" ? null : "rectangle"));
  // };
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

        {/* <button
          onClick={toggleRect}
          className="p-2 bg-slate-400 rounded-md text-white"
        >
          {shape ? "❌" : "▭"}
        </button> */}
        
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
