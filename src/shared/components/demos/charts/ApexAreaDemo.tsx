import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import "@/styles/_main.scss"
type PropsChart = {
  advertisementCountMonthly: number[] | undefined,
  studentCountMonthly: number[] | undefined,
}

export default function AreaDemo({ advertisementCountMonthly, studentCountMonthly }: PropsChart) {
  const theme = useTheme();

  const chartOptions = useMemo<ApexOptions>(() => ({
    chart: {
      type: 'area',
      height: 350,
      id: 'basic-area',
      background: 'transparent',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    },
    yaxis: {
      min: 0,
      max: 1000,
    },
    tooltip: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth',
    },
    theme: {
      mode: theme.palette.mode,
    },
    grid: {
      borderColor: theme.palette.divider,
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      theme.palette.warning.main,
      theme.palette.info.main
    ],
    series: [
      {
        name: 'عدد الطلاب شهريا',
        data: studentCountMonthly ?? [],
      },

      {
        name: 'عدد الإعلانات شهريا',
        data: advertisementCountMonthly ?? [],
      },
    ],
  }), [studentCountMonthly, advertisementCountMonthly, theme]);

  return (
    <Chart options={chartOptions} series={chartOptions.series} type="area" height={350} />
  );
}
