import React, { useEffect, useRef, useState } from "react";

import cl from "./erasableImage.module.scss";

interface ErasableImageProps {
  height: number;
  width: number;
  imageSource: string;
  backgroundImageSource?: string;
  radius?: number;
}

const ErasableImage: React.FC<ErasableImageProps> = ({
  height,
  width,
  imageSource,
  backgroundImageSource,
  radius = 20,
}) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null | undefined>(null),
    pi2 = Math.PI * 2;
  const img = useRef(new Image());
  const [loadedImage, setLoadedImage] = useState(false);
  const [loadedBackground, setLoadedBackground] = useState(false);

  useEffect(() => {
    ctx.current = canvas.current?.getContext("2d");
    img.current.src = imageSource;
    img.current.onload = () => setLoadedImage(true);
    const back = new Image();
    if (backgroundImageSource) back.src = backgroundImageSource;
    back.onload = () => setLoadedBackground(true);
    img.current.onload = () => setLoadedImage(true);
  }, [width]);

  function start() {
    if (!canvas.current || !ctx.current) return;
    canvas.current.width = width;
    canvas.current.height = height;
    if (canvas.current) {
      canvas.current.style.backgroundImage = `url(${backgroundImageSource})`;
      canvas.current.style.backgroundSize = `${width}px ${height}px`;
    }
    if (canvas.current.width && canvas.current.height)
      ctx.current?.drawImage(
        img.current,
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
    ctx.current.globalCompositeOperation = "destination-out";
    canvas.current.onmousemove = handleMouseMove;
  }

  useEffect(() => {
    if (!loadedImage || !loadedBackground) return;
    start();
  }, [loadedImage, loadedBackground, width]);
  function handleMouseMove(e: MouseEvent) {
    const pos = getXY(e);
    if (pos) erase(pos.x, pos.y);
  }

  function getXY(e: MouseEvent) {
    const rect = canvas.current?.getBoundingClientRect();

    if (!rect || !canvas.current) return;

    return {
      x: e.pageX - rect.left - window.scrollX,
      y: e.pageY - rect.top - window.scrollY,
    };
  }
  function erase(x: number, y: number) {
    if (!ctx.current || !canvas.current) return;

    ctx.current.beginPath();
    ctx.current.arc(x, y, radius, 0, pi2);
    ctx.current.fill();
  }
  return <canvas ref={canvas} className={cl.canvas} />;
};

export default ErasableImage;
