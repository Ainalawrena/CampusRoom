import {useEffect,useState} from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {getStatistiques} from "../../api/admin";
import "./Statistiques.css";

import{
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend
}from "recharts";

const COLORS=[
    "#52796F",
    "#84A98C",
    "#CAD2C5",
    "#354F52",
    "#2F3E46"
];

export default function Statistiques(){

    const[data,setData]=useState(null);
    const[loading,setLoading]=useState(true);

    useEffect(()=>{

        async function load(){

            try{

                const{data}=await getStatistiques();

                setData(data);

            }catch(error){

                console.error(error);

            }finally{

                setLoading(false);

            }

        }

        load();

    },[]);

    if(loading){

        return(

            <DashboardLayout>

                <h2>Chargement...</h2>

            </DashboardLayout>

        );

    }

    const{kpis}=data;

    return(

        <DashboardLayout>

            <h1 className="stats-title">
                Statistiques
            </h1>

            <div className="stats-cards">

                <div className="stat-card">

                    <h3>Utilisateurs</h3>

                    <span>
                        {kpis.utilisateurs}
                    </span>

                </div>

                <div className="stat-card">

                    <h3>Salles</h3>

                    <span>
                        {kpis.salles}
                    </span>

                </div>

                <div className="stat-card">

                    <h3>Réservations</h3>

                    <span>
                        {kpis.reservations}
                    </span>

                </div>

                <div className="stat-card">

                    <h3>Taux d'occupation</h3>

                    <span>
                        {kpis.occupation}%
                    </span>

                </div>

            </div>

            <div className="chart-card">

                <h2>
                    Réservations par mois
                </h2>

                <ResponsiveContainer
                    width="100%"
                    height={350}
                >

                    <BarChart
                        data={data.reservations_par_mois}
                    >

                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="mois"/>

                        <YAxis/>

                        <Tooltip/>

                        <Legend/>

                        <Bar
                            dataKey="total"
                            fill="#52796F"
                            radius={[8,8,0,0]}
                        />

                    </BarChart>

                </ResponsiveContainer>

            </div>

                        <div className="charts-grid">

                <div className="chart-card">

                    <h2>
                        Utilisateurs par rôle
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <PieChart>

                            <Pie
                                data={data.utilisateurs_par_role}
                                dataKey="total"
                                nameKey="role"
                                outerRadius={110}
                                label
                            >

                                {data.utilisateurs_par_role.map((entry,index)=>(

                                    <Cell
                                        key={index}
                                        fill={COLORS[index%COLORS.length]}
                                    />

                                ))}

                            </Pie>

                            <Tooltip/>

                            <Legend/>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div className="chart-card">

                    <h2>
                        Réservations par statut
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <PieChart>

                            <Pie
                                data={data.reservations_par_statut}
                                dataKey="total"
                                nameKey="statut"
                                outerRadius={110}
                                label
                            >

                                {data.reservations_par_statut.map((entry,index)=>(

                                    <Cell
                                        key={index}
                                        fill={COLORS[index%COLORS.length]}
                                    />

                                ))}

                            </Pie>

                            <Tooltip/>

                            <Legend/>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

            <div className="charts-grid">

                <div className="chart-card">

                    <h2>
                        Salles les plus réservées
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <BarChart
                            data={data.top_salles}
                        >

                            <CartesianGrid strokeDasharray="3 3"/>

                            <XAxis dataKey="nom"/>

                            <YAxis/>

                            <Tooltip/>

                            <Bar
                                dataKey="total"
                                fill="#84A98C"
                                radius={[8,8,0,0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                <div className="chart-card">

                    <h2>
                        Réservations par bâtiment
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <BarChart
                            data={data.reservations_par_batiment}
                        >

                            <CartesianGrid strokeDasharray="3 3"/>

                            <XAxis dataKey="batiment"/>

                            <YAxis/>

                            <Tooltip/>

                            <Bar
                                dataKey="total"
                                fill="#354F52"
                                radius={[8,8,0,0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </DashboardLayout>

    );

}