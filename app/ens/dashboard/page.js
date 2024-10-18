/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import Link from 'next/link';
// import { Demo } from '../../types/types';
import { ChartData, ChartOptions } from 'chart.js';

import MlData from '../api/mldata';
import wwtData from '../api/wwtdata';

const textColor = '#495057';
const textColorSecondary = '#6c757d';
// const surfaceBorder = '#f8f8ff';
const surfaceBorder = 'rgba(230,251,250,0.4)';
const surfaceBorder1 = 'rgba(240,248,250,0.4)';

const grafColorDBlue = 'rgba(0, 48, 143, 0.6)';
const grafColorFBlue = 'rgba(93, 138, 168, 0.8)';
const grafColorMBlue = 'rgba(124, 185, 232, 0.8)';
const grafColorR = 'rgba(227, 38, 54, 0.7)';
const grafColorG = 'rgba(59, 122, 87, 0.8)';

const BarOptionsDefault = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        tooltips: {
            mode: 'index',
            intersect: false
        },
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        x: {
            stacked: true,
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        },
        y: {
            stacked: true,
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        }
    }
};

const LineOptionsDefault = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        }
    }
};

const MultiGrafOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder
            }
        }
    }
};

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const menu1 = useRef < Menu > (null);
    const menu2 = useRef < Menu > (null);
    const [lineOptions, setLineOptions] = useState({});
    const { layoutConfig } = useContext(LayoutContext);
    const [resultMlData, setResultMlData] = useState(MlData);
    const [resultwwtData, setResultwwtData] = useState(wwtData);

    const targetDate = '21/11/2023';
    const filteredData1 = resultMlData.filter((item) => item.mlDate === targetDate);
    const filteredData2 = resultwwtData.filter((item) => item.wwtDate === targetDate);
    // console.log('wwtDate1', filteredData1[0]);
    // console.log('wwtDate2', filteredData2[0]);

    const mlDate = resultMlData.map((item) => item.mlDate);
    const mlBoron = resultMlData.map((item) => item.mlBoron);

    const wwtDates = resultwwtData.map((item) => item.wwtDate);
    const wwtSGen = resultwwtData.map((item) => item.wwtSGen);
    const wwtSDis = resultwwtData.map((item) => item.wwtSDis);

    const wwtAT1p = resultwwtData.map((item) => item.wwtAT1p);
    const wwtMTp = resultwwtData.map((item) => item.wwtMTp);
    const wwtAT2p = resultwwtData.map((item) => item.wwtAT2p);
    const wwtAT11p = resultwwtData.map((item) => item.wwtAT11p);
    const wwtT12p = resultwwtData.map((item) => item.wwtT12p);
    const wwtCTp = resultwwtData.map((item) => item.wwtCTp);
    const wwtFp = resultwwtData.map((item) => item.wwtFp);
    // console.log('wwtSGen', wwtSGen);

    const MlParameter = [
        {
            mlType: 'Cod',
            mlSa: 80,
            mlSb: 200,
            mlCL: 140
        },
        {
            mlType: 'Pb',
            mlSa: 0.1,
            mlSb: 0.5,
            mlCL: 0.35
        },
        {
            mlType: 'Cu',
            mlSa: 0.2,
            mlSb: 1,
            mlCL: 0.7
        },
        {
            mlType: 'Mn',
            mlSa: 0.2,
            mlSb: 1,
            mlCL: 0.7
        },
        {
            mlType: 'Zn',
            mlSa: 1,
            mlSb: 2,
            mlCL: 1.4
        },
        {
            mlType: 'Boron',
            mlSa: 1,
            mlSb: 4,
            mlCL: 2.8
        },
        {
            mlType: 'Iron',
            mlSa: 1,
            mlSb: 5,
            mlCL: 3.5
        }
    ];

    const BoronParameter = MlParameter.find((item) => item.mlType === 'Boron');
    if (BoronParameter) {
        const { mlSa, mlSb, mlCL } = BoronParameter;
        const numericMLCL = mlCL;
    }

    const datamlCL = Array.from({ length: mlBoron.length }, () => BoronParameter?.mlCL);
    const datamlSb = Array.from({ length: mlBoron.length }, () => BoronParameter?.mlSb);
    const datamlSa = Array.from({ length: mlBoron.length }, () => BoronParameter?.mlSa);

    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const lineData1 = {
        labels: mlDate,
        datasets: [
            // {
            //     label: 'CL',
            //     data: datamlCL,
            //     fill: false,
            //     backgroundColor: '#008000',
            //     borderColor: '#008000',
            //     tension: 0.5
            // },
            {
                label: 'Std A',
                data: datamlSa,
                fill: false,
                borderDash: [2, 4],
                backgroundColor: grafColorG,
                borderColor: grafColorG,
                tension: 0.5
            },
            {
                label: 'Std B',
                data: datamlSb,
                fill: false,
                borderDash: [2, 4],
                backgroundColor: grafColorR,
                borderColor: grafColorR,
                tension: 0.1
            },
            {
                type: 'bar',
                label: 'Boron',
                data: mlBoron,
                fill: false,
                backgroundColor: grafColorDBlue,
                borderColor: grafColorDBlue,
                tension: 0.4
            }
        ]
    };

    const grafData2 = {
        labels: wwtDates,
        datasets: [
            {
                type: 'bar',
                label: 'Generate',
                data: wwtSGen,
                fill: false,
                backgroundColor: grafColorDBlue,
                borderColor: grafColorDBlue,
                tension: 0.4
            },
            {
                type: 'bar',
                label: 'Dispose',
                data: wwtSDis,
                fill: false,
                backgroundColor: grafColorR,
                borderColor: grafColorR,
                tension: 0.4
            }
        ]
    };

    const grafData3 = {
        labels: wwtDates,
        datasets: [
            {
                label: 'Adj Tank 1',
                data: wwtAT1p,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Mix Tank',
                data: wwtMTp,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Adj Tank 2',
                data: wwtAT2p,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Aeration Tank 11',
                data: wwtAT11p,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Tank 12',
                data: wwtT12p,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Clarifier Tank',
                data: wwtCTp,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Final Portable',
                data: wwtFp,
                fill: false,
                tension: 0.4
            }
        ]
    };

    useEffect(() => {
        // ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div>
            {/* CARD FOR TODAY MONITORING  */}
            <div className="grid">
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">COD (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlCod}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-blue-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">Pb (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlPb}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-orange-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">Cu (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlCu}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-cyan-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">Mn (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlMn}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-gray-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-gray-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">Zn (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlZn}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-purple-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 lg:col-4 xl:col-2">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-0">
                            <div>
                                <span className="block text-500 font-medium mb-1">Iron (mg/L)</span>
                                <div className="text-900 font-medium text-xl">{filteredData1[0].mlIron}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-indigo-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-box text-indigo-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* CARD FOR GRAF */}
            <div className="grid">
                <div className="col-6 xl:col-6">
                    <div className="card">
                        <h5>Mini Lab Reading : Boron (mg/L)</h5>
                        <Chart type="line" data={lineData1} options={LineOptionsDefault} />
                    </div>
                </div>
                <div className="col-6 xl:col-6">
                    <div className="card">
                        <h5>WWT Monitoring : Sludge (Bags)</h5>
                        <Chart type="bar" data={grafData2} options={BarOptionsDefault} />
                    </div>
                </div>
                <div className="col-12 xl:col-12">
                    <div className="card">
                        <h5>WWT Monitoring : pH reading</h5>
                        <Chart type="line" data={grafData3} options={MultiGrafOptions} />
                    </div>
                </div>
            </div>
            {/* CARD FOR NOTIFATION */}
            <div className="grid">
                <div className="col-12 xl:col-12">
                    <div className="card">
                        <div className="flex align-items-center justify-content-between mb-4">
                            <h5>Notifications</h5>
                            {/* <div>
                                <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain" onClick={(event) => menu2.current?.toggle(event)} />
                                <Menu
                                    ref={menu2}
                                    popup
                                    model={[
                                        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
                                        { label: 'Remove', icon: 'pi pi-fw pi-minus' }
                                    ]}
                                />
                            </div> */}
                        </div>

                        <ul className="p-0 mx-0 mt-0 mb-2 list-none">
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-info-circle text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    <Link href="/ens/minilab">
                                        <span className="text-blue-500">21/11/2023</span> Mini Lab Reading : Boron (mg/L) over <span className="text-red-500">Std B</span>
                                    </Link>
                                </span>
                            </li>
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-orange-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-info-circle text-xl text-orange-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    <Link href="/ens/minilab">
                                        <span className="text-blue-500">11/11/2023</span> Mini Lab Reading : Boron (mg/L) over <span className="text-red-500">Std B</span>
                                    </Link>
                                </span>
                            </li>
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-blue-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-info-circle text-xl text-blue-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    <Link href="/ens/minilab">
                                        <span className="text-blue-500">05/11/2023</span> Mini Lab Reading : Boron (mg/L) over <span className="text-red-500">Std B</span>
                                    </Link>
                                </span>
                            </li>
                            <li className="flex align-items-center py-2 border-bottom-1 surface-border">
                                <div className="w-3rem h-3rem flex align-items-center justify-content-center bg-pink-100 border-circle mr-3 flex-shrink-0">
                                    <i className="pi pi-info-circle text-xl text-pink-500" />
                                </div>
                                <span className="text-900 line-height-3">
                                    <Link href="/ens/minilab">
                                        <span className="text-blue-500">04/11/2023</span> Mini Lab Reading : Boron (mg/L) over <span className="text-red-500">Std B</span>
                                    </Link>
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
