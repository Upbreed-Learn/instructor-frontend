import { useState } from 'react';

const ViewerGrowth = () => {
  return (
    <div className="basis-full rounded-lg px-4 py-3 shadow-[0px_2.04px_2.04px_0px_#0000000A]">
      <div className="flex flex-col gap-1.5">
        <p className="text-xs/[100%] font-bold text-[#464255]">Chart Order</p>
        <p className="text-[8.17px]/[100%] text-[#B9BBBD]">Viewers</p>
      </div>
      <ViewerGrowthChart />
    </div>
  );
};

export default ViewerGrowth;

interface DataPoint {
  month: string;
  value: number;
  x: number;
  y: number;
}

function ViewerGrowthChart() {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const dataPoints: DataPoint[] = [
    { month: 'January', value: 7500000, x: 50, y: 100 },
    { month: 'February', value: 8200000, x: 120, y: 80 },
    { month: 'March', value: 10000000, x: 190, y: 40 },
    { month: 'April', value: 8800000, x: 260, y: 70 },
    { month: 'May', value: 9500000, x: 330, y: 95 },
    { month: 'June', value: 9200000, x: 400, y: 85 },
    { month: 'July', value: 11000000, x: 470, y: 30 },
  ];

  const createSmoothPath = (): string => {
    let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;

    for (let i = 0; i < dataPoints.length - 1; i++) {
      const current = dataPoints[i];
      const next = dataPoints[i + 1];
      const controlX = (current.x + next.x) / 2;

      path += ` Q ${controlX} ${current.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  const createGradientPath = (): string => {
    const linePath = createSmoothPath();
    return `${linePath} L ${dataPoints[dataPoints.length - 1].x} 150 L ${dataPoints[0].x} 150 Z`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className="w-full rounded-lg bg-white">
      <div className="relative">
        <svg
          viewBox="0 0 520 180"
          className="w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7BA89A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7BA89A" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Gradient area under the curve */}
          <path d={createGradientPath()} fill="url(#areaGradient)" />

          {/* Main line */}
          <path
            d={createSmoothPath()}
            fill="none"
            stroke="#4A7C6B"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data points - only visible on hover */}
          {dataPoints.map((point: DataPoint, index: number) => (
            <g key={index}>
              {hoveredPoint === index && (
                <>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={8}
                    fill="#FFFFFF"
                    stroke="#4A7C6B"
                    strokeWidth="3"
                    className="transition-all"
                  />
                  <circle cx={point.x} cy={point.y} r="4" fill="#10B981" />
                </>
              )}
              {/* Invisible hover area */}
              <circle
                cx={point.x}
                cy={point.y}
                r={12}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            </g>
          ))}

          {/* Month labels */}
          {dataPoints.map((point: DataPoint, index: number) => (
            <text
              key={`label-${index}`}
              x={point.x}
              y="170"
              textAnchor="middle"
              className="cursor-pointer fill-gray-600 text-xs"
              style={{ fontSize: '12px' }}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {point.month}
            </text>
          ))}
        </svg>

        {/* Hover tooltip */}
        {hoveredPoint !== null && (
          <div
            className="pointer-events-none absolute rounded-lg bg-white px-2.5 py-2 shadow-[0px_2.04px_4.08px_0px_#0000001F] transition-all"
            style={{
              left: `${(dataPoints[hoveredPoint].x / 520) * 100}%`,
              top: `${(dataPoints[hoveredPoint].y / 180) * 100}%`,
              transform: 'translate(20px, -50%)',
            }}
          >
            <span className="absolute bottom-2 -left-1 block size-2.5 -rotate-45 rounded-[2px] bg-white"></span>
            <div className="flex items-start gap-1">
              <div>
                <p className="text-[8px]/[100%] font-bold text-[#464255]">
                  {formatNumber(dataPoints[hoveredPoint].value)}
                </p>
                <p className="text-[6px]/[10.72px] text-[#B9BBBD]">
                  {dataPoints[hoveredPoint].month === 'March'
                    ? 'Sept 16th, 2024'
                    : `${dataPoints[hoveredPoint].month} 2024`}
                </p>
              </div>
              <p className="text-[6px]/[100%] font-semibold text-[#464255]">
                Viewers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
