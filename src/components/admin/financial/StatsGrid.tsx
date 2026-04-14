"use client";

import React from "react";
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Percent, Activity } from "lucide-react";
import { motion } from "motion/react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, icon, iconBg, iconColor }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-8 flex items-start justify-between">
        <p className="pt-1 text-sm font-medium text-gray-500">{title}</p>
        <div className={`rounded-xl p-4 shadow-sm ${iconBg} ${iconColor}`}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: "h-6 w-6",
              })
            : icon}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1">
        <h3 className="text-3xl font-black tracking-tight text-gray-900">{value}</h3>
        <div
          className={`flex items-center gap-1 text-sm font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}
        >
          <span>
            {isPositive ? "+" : ""}
            {change}%
          </span>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
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
      icon: <ShoppingCart />,
      iconBg: "bg-blue-50",
      iconColor: "text-[--color-brand-secondary]",
    },
    {
      title: "صافي الأرباح",
      value: "85,400",
      change: 5.2,
      icon: <DollarSign />,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "رسوم المنصة",
      value: "12,630",
      change: -1.8,
      icon: <Percent />,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "عدد المعاملات",
      value: "1,240",
      change: 8.0,
      icon: <Activity />,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
