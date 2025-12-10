import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ReviewData } from '../types';

interface Props {
  data: ReviewData[];
}

// Swat.io Brand Colors: Blue (#2B9CDA), Dark Blue (#0C3146), Green (#17AA5A)
const COLORS = ['#2B9CDA', '#0C3146', '#17AA5A'];

export const ReviewChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            dataKey="platform" 
            type="category" 
            tick={{ fill: '#405063', fontSize: 12, fontWeight: 500 }} 
            width={100}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #DAE0E7', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', color: '#0C3146' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
             {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};