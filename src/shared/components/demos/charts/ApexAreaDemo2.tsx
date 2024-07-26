import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import "@/styles/_main.scss"
type PropsChart = {
  lessonCountMonthly: number[] | undefined,
  languageCountMonthly: number[] | undefined
}

export default function ApexAreaDemo2({ languageCountMonthly, lessonCountMonthly }: PropsChart) {
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
      max: 100,
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
      theme.palette.primary.main,
      theme.palette.secondary.main,

    ],
    series: [

      {
        name: 'عدد اللغات شهريا',
        data: languageCountMonthly ?? [],
      },
      {
        name: 'عدد الدروس شهريا',
        data: lessonCountMonthly ?? [],
      },

    ],
  }), [lessonCountMonthly, languageCountMonthly, theme]);

  return (
    <Chart options={chartOptions} series={chartOptions.series} type="area" height={350} />
  );
}
