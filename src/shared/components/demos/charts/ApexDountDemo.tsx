import React from 'react'
import Chart, { Props } from "react-apexcharts";
import { useTheme } from '@mui/material/styles';
export default function areaDemo() {

    const theme = useTheme()

    const chartOptions: Props = {

        height:125,
        type: 'donut',

        options: {
            dataLabels:{
                enabled:false
                
            },
            theme: {
                mode: theme.palette.mode,
            },

            chart: {
                id: "basic-bar",
                background: 'transparent',
                type: 'donut',
                height:100

            },


            // responsive: [{
            //     breakpoint: 480,
            //     options: {
            //         chart: {
            //             width: 200
            //         },
            //         legend: {
            //             position: 'bottom'
            //         }
            //     }
            // }],



        },

        series: [44, 55, 41, 17, 15],



    }
    return (
        <Chart {...chartOptions}>
        </Chart>
    )
}
