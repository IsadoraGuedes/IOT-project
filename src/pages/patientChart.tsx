"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  BarElement,
  plugins
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import prisma from "./database/db";
import { title } from "process";
// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip
);

interface LineProps {
  data: [{
    id: string,
    value: number,
    session: string,
  }];
}

const PatientChart: React.FC<any> = ({ data }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uniqueSessions = [...new Set(data.map(item => item.session))];

        const sessionData = uniqueSessions.map(session => {
            const items = data.filter(item => item.session === session); // Filter items for the session
            const sum = items.reduce((acc, curr) => acc + curr.value, 0); // Sum values
            const count = items.length; // Count items
            const average = sum / count; // Calculate average
            return { session, average };
          });

        console.log("session status: ", sessionData)
        setChartData(sessionData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [data]);

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-12 w-12"></div>
      </div>
    );
  }

  const dataChart = {
    labels: chartData.map((entry: any) => entry.session),
    datasets: [
      {
        label: "Pressão aplicada",
        data: chartData.map((entry: any) => entry.average.toFixed(2)),
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 4,
      },
    ],
    
  };

  return (
    <div>
      <Bar data={dataChart} />
    </div>
  );
};
export default PatientChart;
