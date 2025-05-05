import * as React from 'react';
import { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

export default function ChartByMonth({dataset=[]}) {
    const validDataset = Array.isArray(dataset) ? dataset : [];
    const scrollContainerRef = useRef(null);
    
    const formattedDataset = validDataset.map((item) => ({
        ...item,
        month: item.month || '',
        year: item.year || '',
        totalRevenue: item.totalRevenue || 0,
        label: item.month && item.year ? `${item.month}/${item.year}` : 'Unknown'
    }));
    
    const barWidth = 30;
    const chartWidth = Math.max(formattedDataset.length * barWidth, 300);
    
    if (formattedDataset.length === 0) {
        return <div>No data available</div>;
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
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                height={40}
                                label={{ value: 'Month', position: 'insideBottom', offset: -1 }}
                            >
                               
                            </XAxis>
                            <YAxis
                                width={120}
                                tickFormatter={valueFormatter}
                            >
                                <Label value="Total Revenue Per Month" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                            </YAxis>
                            <Tooltip
                                formatter={valueFormatter}
                                labelFormatter={(value) => `Month: ${value}`}
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
