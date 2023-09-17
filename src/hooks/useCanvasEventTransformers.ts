import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import getProngNumber from '../utils/getProngNumber';
import useAutoSolver from './useAutoSolver';

const useCanvasEventTransformers = (
  canvasRef: RefObject<HTMLCanvasElement>,
  // eslint-disable-next-line @typescript-eslint/default-param-last
  edit: boolean = false,
  onPick: (prong: number, layer: number) => void,
  onPicking: (prong: number, layer: number) => void,
  onCancel: () => void
) => {
  // prong:layer
  const [prong, setProng] = useState('-1:-1');
  const { activeLayer, mobileOffset } = useAutoSolver();
  const prongRef = useRef(prong);
  prongRef.current = prong;

  useEffect(() => {
    const [p, l] = prong.split(':').map(n => Number(n));
    if (p === -1 || l === -1) {
      return;
    }

    onPicking(p, l);
  }, [onPicking, prong]);

  const onCommit = useCallback(() => {
    const [p, l] = prongRef.current.split(':').map(n => Number(n));
    onPick(p, l);
  }, [onPick]);

  const onStart = useCallback(
    (x: number, y: number, touch: boolean = false) => {
      if (!canvasRef.current) {
        return;
      }
      const center = canvasRef.current.width / 2 / devicePixelRatio;
      setProng(() => getProngNumber(x, y, center, activeLayer, touch));
    },
    [activeLayer, canvasRef]
  );

  const onMove = useCallback(
    (x: number, y: number, touch: boolean = false) => {
      if (!canvasRef.current) {
        return;
      }
      const center = canvasRef.current.width / 2 / devicePixelRatio;
      setProng(() => getProngNumber(x, y, center, activeLayer, touch));
    },
    [activeLayer, canvasRef]
  );

  const onAbort = useCallback(() => {
    setProng('-1:-1');
    onCancel();
  }, [onCancel]);

  const onRelease = useCallback(() => {
    onCommit();
  }, [onCommit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !edit) {
      return;
    }

    const onMouseDown = (e: MouseEvent) => {
      onStart(e.offsetX, e.offsetY);
    };
    const onMouseMove = (e: MouseEvent) => {
      const { offsetX, offsetY } = e;
      requestAnimationFrame(() => {
        onMove(offsetX, offsetY);
      });
    };
    const onMouseLeave = () => {
      onAbort();
    };
    const onMouseUp = () => {
      onRelease();
    };
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseup', onMouseUp);

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const canvasEl = e.target as HTMLCanvasElement;
      const rect = canvasEl.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.x;
      const y = e.touches[0].clientY - rect.y;

      onStart(x, y, mobileOffset);
    };
    const onTouchMove = (e: TouchEvent) => {
      const canvasEl = e.target as HTMLCanvasElement;
      const rect = canvasEl.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.x;
      const y = e.touches[0].clientY - rect.y;

      requestAnimationFrame(() => {
        onMove(x, y, mobileOffset);
      });
    };
    const onTouchEnd = () => {
      onCommit();
    };
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove);
    canvas.addEventListener('touchend', onTouchEnd);

    // eslint-disable-next-line consistent-return
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [edit, onStart, onAbort, onRelease, mobileOffset, canvasRef, onMove, onCommit]);
};

export default useCanvasEventTransformers;
