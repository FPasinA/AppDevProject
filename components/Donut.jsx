import { useEffect, useRef } from "react";

function DonutChart({ percentages = [0.33,0.33,0.33], colors=["#FF5733", "#33FF57", "#3357FF"], width = 400, height = 300 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const centerX = width / 2;
    const centerY = height / 2;
    const outerRadiusX = 150;
    const outerRadiusY = 100;
    const innerRadiusX = 100;
    const innerRadiusY = 60;

    ctx.clearRect(0, 0, width, height);

    let startAngle = 0;

    for (let i = 0; i < percentages.length; i++) {
      const angle = percentages[i] * 2 * Math.PI;
      const endAngle = startAngle + angle;

      ctx.beginPath();

      // Outer ellipse arc (clockwise)
      ctx.ellipse(centerX, centerY, outerRadiusX, outerRadiusY, 0, startAngle, endAngle);

      // Inner ellipse arc (counter-clockwise)
      ctx.ellipse(centerX, centerY, innerRadiusX, innerRadiusY, 0, endAngle, startAngle, true);

      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();

      startAngle = endAngle;
    }
  }, [percentages, colors, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default DonutChart;
