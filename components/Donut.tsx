// components/Donut.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Text } from 'react-native-svg';

interface DonutChartProps {
  ratio: number;
  size?: number; // Make size optional
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
}

const DonutChart = ({ 
  ratio, 
  size = 150, // Default size
  strokeWidth = 20,
  color = '#3f51b5', // Default color
  backgroundColor = '#e0e0e0' // Default background
}: DonutChartProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * ratio);
  
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${size/2}, ${size/2}`}>
          {/* Background circle */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="transparent"
            fill="transparent"
            strokeWidth={strokeWidth}
          />
          
          {/* Progress circle */}
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
        
        {/* Center text */}
        <Text
          x="50%"
          y="45%"
          textAnchor="middle"
          dy=".3em"
          fontSize={size * 0.16} // Responsive text size
          fill="#D3D3D3"
        >
          {`${Math.round(ratio * 100)}%`}
        </Text>
        <Text
          x="50%"
          y="55%"
          textAnchor="middle"
          dy="1.5em"
          fontSize={size * 0.08} // Responsive text size
          fill="#D3D3D3"
        >
            "Eaten"
        </Text>
      </Svg>
    </View>
  );
};

export default DonutChart;