import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { DrawOptions, useCanvasDraw } from './useCanvasDraw';
import { useCanvasEdit } from './useCanvasEdit';

export const useCanvasManager = (opts: DrawOptions) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { draw } = useCanvasDraw(canvasRef, opts);
  useCanvasEdit(canvasRef, opts.isPuzzle);

  const onResize = useCallback(() => {
    if (!wrapperRef.current || !canvasRef.current) return;

    canvasRef.current.width = 0;
    canvasRef.current.height = 0;

    const rect = wrapperRef.current.getBoundingClientRect();

    canvasRef.current.width = Math.floor(rect.width);
    canvasRef.current.height = Math.floor(rect.width);

    draw();
  }, [draw]);

  useLayoutEffect(() => {
    onResize();
  }, [onResize])

  useEffect(() => {
    const resize = () => requestAnimationFrame(onResize);
    window.addEventListener('resize', resize);
    () => window.removeEventListener('resize', resize);
  }, [onResize])

  return {
    canvasRef,
    wrapperRef
  }
}
