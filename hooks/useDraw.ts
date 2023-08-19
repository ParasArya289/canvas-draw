import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void
) => {
  const [mousePressed, setMousePressed] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prevPoint = useRef<null | Point>(null);

  const mouseDown = () => setMousePressed(true);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!mousePressed) return;

      const currentPoint = getCordinates(e);
      const ctx = canvasRef.current?.getContext("2d");

      if (!currentPoint || !ctx) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };
    const getCordinates = (e: MouseEvent) => {
      const canvas = canvasRef.current;

      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      return { x, y };
    };

    const mouseUpHandler = () => {
      setMousePressed(false);
      prevPoint.current = null;
    };
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);
  return { canvasRef, mouseDown };
};
