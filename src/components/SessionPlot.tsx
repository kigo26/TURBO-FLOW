import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: '10:00', value: 5000, change: 0 },
  { name: '10:15', value: 5150, change: 150 },
  { name: '10:30', value: 4800, change: -350 },
  { name: '10:45', value: 5200, change: 400 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const { value, change } = payload[0].payload;
    return (
      <div className="bg-[#050508] border border-[#1E293B] p-2 text-[12px] text-white rounded">
        <p className="font-bold">{`Time: ${label}`}</p>
        <p>{`Bankroll: $${value}`}</p>
        <p className={change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
          {`Change: ${change >= 0 ? '+' : ''}$${change}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function SessionPlot() {
  return (
    <div className="h-64 w-full">
       <ResponsiveContainer width="100%" height="100%">
         <LineChart data={data}>
           <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
           <Tooltip content={<CustomTooltip />} />
           <Line type="monotone" dataKey="value" stroke="#00D1FF" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
         </LineChart>
       </ResponsiveContainer>
    </div>
  );
}
