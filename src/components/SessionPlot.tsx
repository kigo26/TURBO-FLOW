import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: '10:00', value: 5000 },
  { name: '10:15', value: 5150 },
  { name: '10:30', value: 4800 },
  { name: '10:45', value: 5200 },
];

export default function SessionPlot() {
  return (
    <div className="h-64 w-full">
       <ResponsiveContainer width="100%" height="100%">
         <LineChart data={data}>
           <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <Tooltip contentStyle={{ backgroundColor: '#050508', borderColor: '#1E293B', fontSize: '12px' }} />
           <Line type="monotone" dataKey="value" stroke="#00D1FF" strokeWidth={2.5} dot={false} />
         </LineChart>
       </ResponsiveContainer>
    </div>
  );
}
