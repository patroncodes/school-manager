"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface FinanceChartProps {
  data: {
    name: string;
    income: number;
    expense: number;
  }[]
}

const FinanceChart = ({ data }: FinanceChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 4" stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          tickMargin={20}
        />
        <Tooltip />
        <Legend
          align="center"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
        />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#C3EBFA"
          strokeWidth={5}
        />
        <Line
          type="monotone"
          dataKey="expense"
          stroke="#CFCEFF"
          strokeWidth={5}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinanceChart;
