import { useState } from "react";
import Chart from "react-apexcharts";
import Button from "../elements/Button";

function ChartResponse({labels, series}) {
  const [chartType, setChartType] = useState("bar");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-3">
        <Button isActive={chartType == "bar"} onClick={() => setChartType("bar")}>Bar Chart</Button>
        <Button isActive={chartType == "pie"} onClick={() => setChartType("pie")}>Pie Chart</Button>
      </div>
      {chartType == 'bar' && (
        <Chart
          options={{
            xaxis: {
              categories: labels,
            },
          }}
          series={[{
            name: 'Responses',
            data: series
          }]}
          type="bar"
          height={350}
        />
      )}
      {chartType == 'pie' && (
        <Chart 
          options={{
            labels: labels,
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          }}
          series={series}
          type="pie"
          height={350}
        />
      )}
    </div>
  );
}

export default ChartResponse;