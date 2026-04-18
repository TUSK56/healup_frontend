import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Percent, Activity } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  key?: React.Key;
}

function StatCard({ title, value, change, icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change >= 0;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="flex justify-between items-start mb-8">
        <p className="text-gray-500 text-sm font-medium pt-1">{title}</p>
        <div className={`p-4 rounded-xl ${iconBg} ${iconColor} shadow-sm`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <span>{isPositive ? '+' : ''}{change}%</span>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </div>
      </div>
    </motion.div>
  );
}

export default function StatsGrid() {
  const stats = [
    {
      title: "إجمالي المبيعات",
      value: "450,750",
      change: 12.5,
      icon: <ShoppingCart className="w-6 h-6" />,
      iconBg: "bg-[#E5EEF7]",
      iconColor: "text-[--color-brand-secondary]"
    },
    {
      title: "صافي الأرباح",
      value: "85,400",
      change: 5.2,
      icon: <DollarSign className="w-6 h-6" />,
      iconBg: "bg-[#ECFDF5]",
      iconColor: "text-green-600"
    },
    {
      title: "رسوم المنصة",
      value: "12,630",
      change: -1.8,
      icon: <Percent className="w-6 h-6" />,
      iconBg: "bg-[#FFFBEB]",
      iconColor: "text-orange-600"
    },
    {
      title: "عدد المعاملات",
      value: "1,240",
      change: 8.0,
      icon: <Activity className="w-6 h-6" />,
      iconBg: "bg-[#EEF2FF]",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard 
          key={index} 
          title={stat.title}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
        />
      ))}
    </div>
  );
}
