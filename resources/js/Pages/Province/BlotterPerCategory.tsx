import getBarangayByBrgyCode from '@/utils/functions/getBarangayByBrgyCode';
import React from 'react'
import ReactApexChart from 'react-apexcharts'

const BlotterPerCategory = ({ barangays, selectedCity, limitBarangay }
    : { barangays: any, selectedCity: any, limitBarangay: any }) => {
    const series = [44, 55, 13, 43, 22];
    const options = {
        chart: {
            width: 380,
            type: 'pie',
        },
        labels: ['For Hearing', 'Amicably Settled', 'Pending', 'Referred to PNP', 'Others'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };

    const chartSeries = (barangay: any) => {
        return barangay
            ?.blotters
            ?.map((remark: any, key: number) => remark?.count);
    }

    console.log(barangays);

    return (
        <div className='bg-white rounded border border-slate-300 shadow-sm p-6'>
            <h3 className='font-bold mb-3'>Barangay Blotter Per Remarks</h3>
            <div className='grid grid-cols-2 gap-6'>
                {barangays
                    ?.filter((item: any) => item?.city_code == selectedCity)
                    ?.slice(limitBarangay[0], limitBarangay[1])
                    ?.map((barangay: any, key: number) => (
                        <div id="chart" className='grid place-items-center mb-2 border border-slate-300 py-10 shadow-sm'>
                            <h3 className='mb-4'>Barangay {getBarangayByBrgyCode(barangay.barangay_code)}</h3>
                            <ReactApexChart
                                options={options}
                                series={chartSeries(barangay)}
                                type="pie"
                                width={380}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default BlotterPerCategory