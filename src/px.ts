const canvasSize = Math.min(innerHeight, innerWidth, 600);

export const canvasScale = canvasSize / 600;

export const px = (n: number) => {
  return canvasSize * n;
};
