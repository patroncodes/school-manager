import Image from 'next/image'
import dynamic from 'next/dynamic';

const PerformanceChart = dynamic(() => import('./PerformanceChart'), {
    loading: () => <h1>Loading...</h1>,
});


const PerformanceChartContainer = () => {
    return (
        <div className="bg-white p-4 rounded-md h-80 relative">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Performance</h2>
                <Image src="/moreDark.svg" alt="" width={16} height={16} />
            </div>

            <PerformanceChart />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold">9.2</p>
                <p className="text-xs text-gray-300">of 10 max LTS</p>
            </div>

            <h3 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
                1st Semester - 2nd Semester
            </h3>
        </div>
    )
}

export default PerformanceChartContainer