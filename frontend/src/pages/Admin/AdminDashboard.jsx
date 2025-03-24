import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import { 
    useGetTotalOrdersQuery,
    useGetTotalSalesByDateQuery,
    useGetTotalSalesQuery, 
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
    const { data: sales, isLoading } = useGetTotalSalesQuery();
    const { data: customers, isLoading: loading } = useGetUsersQuery();
    const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
    const { data: salesDetail } = useGetTotalSalesByDateQuery();

    const [state, setState] = useState({
        options: {
            chart: {
                type: "line",
            },
            tooltip: {
                theme: "dark",
            },
            colors: ["#00E396"],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: "smooth",
            },
            title: {
                text: "Sales Trend",
                align: "left",
            },
            grid: {
                borderColor: "#ccc",
            },
            markers: {
                size: 1,
            },
            xaxis: {
                categories: [],
                title: {
                    text: "Date",
                },
            },
            yaxis: {
                title: {
                    text: "Sales",
                },
                min: 0,
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                floating: true,
                offsetY: -25,
                offsetX: -5,
            },
        },
        series: [{ name: "Sales", data: [] }],
    });

    useEffect(() => {
        if (salesDetail) {
            const formattedSalesDate = salesDetail.map((item) => ({
                x: item._id,
                y: Math.round(item.totalSales * 100) / 100,
            }));

            setState((prevState) => ({
                ...prevState,
                options: {
                    ...prevState.options,
                    xaxis: {
                        categories: formattedSalesDate.map((item) => item.x),
                    },
                },
                series: [
                    { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
                ],
            }));
        }
    }, [salesDetail]);

    return (
        <>
            <AdminMenu />
    
            <section className="ml-0 lg:ml-16 pt-20 px-4 pb-4 md:pt-24 md:px-8 md:pb-8 bg-black min-h-screen">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 min-w-0 mt-4">
                    <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 hover:border-pink-500/30 transition-all min-w-0">
                        <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                            <span className="text-pink-400 font-bold text-xl">$</span>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm font-medium">Total Sales</p>
                        <h1 className="text-2xl font-bold text-gray-100 mt-1">
                            {isLoading ? <Loader /> : `$${Math.round(sales.totalSales * 100) / 100}`}
                        </h1>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 hover:border-blue-500/30 transition-all min-w-0">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <span className="text-blue-400 text-xl">👥</span>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm font-medium">Customers</p>
                        <h1 className="text-2xl font-bold text-gray-100 mt-1">
                            {isLoading ? <Loader /> : customers?.length}
                        </h1>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 hover:border-green-500/30 transition-all min-w-0">
                        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                            <span className="text-green-400 text-xl">📦</span>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm font-medium">Total Orders</p>
                        <h1 className="text-2xl font-bold text-gray-100 mt-1">
                            {isLoading ? <Loader /> : orders?.totalOrders}
                        </h1>
                    </div>
                </div>

                <div className="mt-6 md:mt-8">
                    <div className="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800">
                        <Chart
                            options={{
                                ...state.options,
                                theme: {
                                    mode: 'dark',
                                    palette: 'palette1'
                                }
                            }}
                            series={state.series}
                            type="bar"
                            height={350}
                            width="100%"
                        />
                    </div>
                </div>

                <div className="mt-6 md:mt-8">
                    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                        <OrderList />
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminDashboard;