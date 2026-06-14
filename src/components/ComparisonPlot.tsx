import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { SessionData } from '../types';

export default function ComparisonPlot({ sessions }: { sessions: SessionData[] }) {
  const formattedData = sessions[0].data.map((p, i) => {
    const obj: any = { name: p.name };
    sessions.forEach((s, idx) => {
      obj[`value${idx}`] = s.data[i]?.value;
    });
    return obj;
  });

  return (
    <div className="h-64 w-full">
       <ResponsiveContainer width="100%" height="100%">
         <LineChart data={formattedData}>
           <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <Tooltip contentStyle={{ backgroundColor: '#050508', borderColor: '#1E293B', fontSize: '12px' }} />
           <Legend wrapperStyle={{ fontSize: '10px' }} />
           {sessions.map((s, idx) => (
             <Line key={s.id} type="monotone" dataKey={`value${idx}`} name={s.name} stroke={s.color} strokeWidth={2.5} dot={false} />
           ))}
         </LineChart>
       </ResponsiveContainer>
    </div>
  );
}
