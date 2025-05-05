import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,Label } from 'recharts';

export default function ChartByDate({ dataset = [] }) {
  const scrollContainerRef = useRef(null);
  
  const formattedDataset = Array.isArray(dataset) ? dataset.map((item) => ({
    ...item,
    month: item.month || '',
    year: item.year || '',
    day: item.day || '',
    totalRevenue: item.totalRevenue || 0,
    label: item.day ? `${item.day}/${item.month}/${item.year}` : 'Unknown'
  })) : [];
  
  const barWidth = 30; 
  const chartWidth = Math.max(formattedDataset.length * barWidth, 300);
  
  if (formattedDataset.length === 0) {
    return <div className="p-4 text-center text-gray-500">No data available</div>;
  }
  
  const valueFormatter = (value) => `${value} million`;
  
  return (
    <div className="flex flex-col w-full">

      <div 
        ref={scrollContainerRef} 
        className="overflow-x-auto w-full" 
        style={{ paddingBottom: '10px' }}
      >
        <div style={{ width: `${chartWidth}px`, minWidth: '100%', height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedDataset}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                height={40}
                label={{ value: 'Day', position: 'insideBottom', offset: -1 }}
              />

              <YAxis 
                width={120}
                tickFormatter={valueFormatter}
                
              >
                <Label value="Total Revenue Per Date" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
              </YAxis>
          
              <Tooltip 
                formatter={valueFormatter}
                labelFormatter={(value) => `Day: ${value}`}
              />
              <Bar 
                dataKey="totalRevenue" 
                name="Total Revenue" 
                fill="#8884d8" 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}