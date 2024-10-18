/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { InputMask } from 'primereact/inputmask';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';

import { isLogin, LoginInfo, minilab } from "../../../api/ens"

const MiniLabMonitor = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [resultDT, setResultDT] = useState([])
    const [YYMM, setYYMM] = useState()

    const [chartData1, setChartData1] = useState({});
    const [chartOptions1, setChartOptions1] = useState({});
    const [chartData2, setChartData2] = useState({});
    const [chartOptions2, setChartOptions2] = useState({});
    const [chartData3, setChartData3] = useState({});
    const [chartOption3, setChartOptions3] = useState({});
    const [chartData4, setChartData4] = useState({});
    const [chartOptions4, setChartOptions4] = useState({});

    const handleKeyPress = (e) => {
        // console.log('handleKeyPress', e);
        if (e.key === 'Enter') {
            actionSearch()
        }
    }

    const handleLoad = () => {
        const _userLogin = isLogin();

        if (!_userLogin) {
            router.push('/ens/login');
            return
        }

        // ~~~ check date 
        const _currentDate = new Date();
        const _currentYear = _currentDate.getFullYear();
        const _curentMonth = (_currentDate.getMonth() + 1).toString().padStart(2, '0');
        // const _adjustMonth = '11'
        const formattedDate = `${_currentYear}${_curentMonth}`;

        setYYMM(formattedDate)

        const _paramsDT = {
            "UserID": LoginInfo('ENS_UserID'),
            "GroupId": LoginInfo('ENS_GroupID'),
            "ToDate": formattedDate
        }
        handleFetchData(_paramsDT)

    }

    const handleGraf1 = (dataDT) => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');


        const label1 = []
        const _dset1 = []
        const dset1 = []
        const sa1 = []
        const sb1 = []
        const cl1 = []
        // console.log(dataDT)

        const Cod = []
        const CodSa = []
        const CodSb = []
        const CodCL = []

        const Pb = []
        const Cu = []
        const Mn = []
        const Zn = []
        const Iron = []

        dataDT.map(item => {

            // date (label)
            const _mlbDate = item.mlbDate;
            let year = _mlbDate.substring(0, 4);
            let month = _mlbDate.substring(4, 6);
            let day = _mlbDate.substring(6, 8);
            const mlbDateOK = `${day}/${month}`;
            label1.push(mlbDateOK)

            // boron dataset1
            let _mlbBoron = item.mlbBoron
            const mlbBoronOK = _mlbBoron === null || _mlbBoron === '' || _mlbBoron === 'NA' ? 0 : parseFloat(_mlbBoron);
            dset1.push(mlbBoronOK)

            // Sa boron dataset2
            let _mlbBoronSa = item.mlbBoronSa
            const mlbBoronSaOK = _mlbBoronSa === null || _mlbBoronSa === '' ? 0 : parseFloat(_mlbBoronSa);
            sa1.push(mlbBoronSaOK)

            // Sb boron dataset3
            let _mlbBoronSb = item.mlbBoronSb
            const mlbBoronSbOK = _mlbBoronSb === null || _mlbBoronSb === '' ? 0 : parseFloat(_mlbBoronSb);
            sb1.push(mlbBoronSbOK)

            // CL boron dataset4
            let _mlbBoronCL = item.mlbBoronCL
            const mlbBoronCLOK = _mlbBoronCL === null || _mlbBoronCL === '' ? 0 : parseFloat(_mlbBoronCL);
            cl1.push(mlbBoronCLOK)

            let _mlbCod = item.mlbCod
            const _mlbCodOK = _mlbCod === null || _mlbCod === '' || _mlbCod === 'NA' ? 0 : parseFloat(_mlbCod);
            Cod.push(_mlbCodOK)

            let _mlbCodSa = item.mlbCodSa
            const _mlbCodSaOK = _mlbCodSa === null || _mlbCodSa === '' ? 0 : parseFloat(_mlbCodSa);
            CodSa.push(_mlbCodSaOK)

            let _mlbCodSb = item.mlbCodSb
            const _mlbCodSbOK = _mlbCodSb === null || _mlbCodSb === '' ? 0 : parseFloat(_mlbCodSb);
            CodSb.push(_mlbCodSbOK)

            let _mlbCodCL = item.mlbCodCL
            const _mlbCodCLOK = _mlbCodCL === null || _mlbCodCL === '' ? 0 : parseFloat(_mlbCodCL);
            CodCL.push(_mlbCodCLOK)

            let _mlbPb = item.mlbPb
            const _mlbPbOK = _mlbPb === null || _mlbPb === '' || _mlbPb === 'NA' ? 0 : parseFloat(_mlbPb);
            Pb.push(_mlbPbOK)

            let _mlbCu = item.mlbCu
            const _mlbCuOK = _mlbCu === null || _mlbCu === '' || _mlbCu === 'NA' ? 0 : parseFloat(_mlbCu);
            Cu.push(_mlbCuOK)

            let _mlbMn = item.mlbMn
            const _mlbMnOK = _mlbMn === null || _mlbMn === '' || _mlbMn === 'NA' ? 0 : parseFloat(_mlbMn);
            Mn.push(_mlbMnOK)

            let _mlbZn = item.mlbZn
            const _mlbZnOK = _mlbZn === null || _mlbZn === '' || _mlbZn === 'NA' ? 0 : parseFloat(_mlbZn);
            Zn.push(_mlbZnOK)

            let _mlbIron = item.mlbIron
            const _mlbIronOK = _mlbIron === null || _mlbIron === '' || _mlbIron === 'NA' ? 0 : parseFloat(_mlbIron);
            Iron.push(_mlbIronOK)

        })

        // console.log('label1', label1)

        const data1 = {
            labels: label1,
            datasets: [
                {
                    label: 'Sa',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                    data: sa1,
                },
                {
                    label: 'Sb',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--pink-600'),
                    tension: 0.4,
                    data: sb1,
                },
                {
                    label: 'CL',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--orange-600'),
                    tension: 0.4,
                    data: cl1,
                },
                {
                    type: 'bar',
                    label: 'Boron',
                    fill: true,
                    backgroundColor: documentStyle.getPropertyValue('--blue-400'),
                    // borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                    data: dset1,
                }

            ]
        };
        const options1 = {

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
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
        setChartData1(data1);
        setChartOptions1(options1);

        const data2 = {
            labels: label1,
            datasets: [
                {
                    label: 'Sa',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                    data: CodSa,
                },
                {
                    label: 'Sb',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--pink-600'),
                    tension: 0.4,
                    data: CodSb,
                },
                {
                    label: 'CL',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--orange-600'),
                    tension: 0.4,
                    data: CodCL,
                },
                {
                    type: 'bar',
                    label: 'COD',
                    fill: true,
                    backgroundColor: documentStyle.getPropertyValue('--primary-400'),
                    // borderColor: documentStyle.getPropertyValue('--blue-300'),
                    tension: 0.4,
                    data: Cod,
                }

            ]
        };
        const options2 = {

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
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
        setChartData2(data2);
        setChartOptions2(options2);

        const data3 = {
            labels: label1,
            datasets: [
                {
                    type: 'bar',
                    label: 'Pb',
                    backgroundColor: documentStyle.getPropertyValue('--blue-400'),
                    data: Pb
                },
                {
                    type: 'bar',
                    label: 'Cu',
                    backgroundColor: documentStyle.getPropertyValue('--green-400'),
                    data: Cu
                },
                {
                    type: 'bar',
                    label: 'Mn', 
                    backgroundColor: documentStyle.getPropertyValue('--yellow-400'),
                    data: Mn
                }
            ]
        };
        const options3 = {
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
        setChartData3(data3);
        setChartOptions3(options3);

        const data4 = {
            labels: label1,
            datasets: [
                {
                    label: 'Zn',
                    // tension: 0.4,
                    backgroundColor: documentStyle.getPropertyValue('--pink-300'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: Zn
                },
                {
                    label: 'Mn',
                    // tension: 0.4,
                    backgroundColor: documentStyle.getPropertyValue('--primary-300'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: Iron
                }
            ]
        };
        const options4 = {

            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
        setChartData4(data4);
        setChartOptions4(options4);
    }

    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            // const _paramDT  = {
            //     "UserID": LoginInfo('ENS_UserID'),
            //     "GroupId": LoginInfo('ENS_GroupID'),
            //     "ToDate": formattedDate
            // }
            const _result = await minilab(params.UserID, params.GroupId, params.ToDate)

            // console.log('handleFetchData', _result)
            setResultDT(_result.data)

            handleGraf1(_result.data)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Load Data Mini Lab ', life: 500 });
        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const actionSearch = () => {
        let myDate = YYMM.replace('/', '');

        const _paramsDT = {
            "UserID": LoginInfo('ENS_UserID'),
            "GroupId": LoginInfo('ENS_GroupID'),
            "ToDate": myDate
        }
        // console.log ('actionSearch', _paramsDT)
        handleFetchData(_paramsDT)
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>Mini Lab Monitoring</h5>
                    {/* ################### UI FOR SEARCH FROM ################## */}
                    <div className="grid">
                        <div className='col-6 justify-content-left'>
                            Month : <InputMask value={YYMM} onChange={(e) => { setYYMM(e.target.value); }} mask="9999/99" placeholder="Year/Month" onKeyUp={handleKeyPress} />
                            <Button label="Search" outlined onClick={actionSearch} />
                        </div>


                        <div className='col-6 text-right'>
                            {/* <Button label="New" icon="pi pi-plus" onClick={actionNew} severity="success" className="mr-2" raised /> */}
                            {/* <Button label="Delete" icon="pi pi-trash" onClick={actionDeletes} severity="danger" disabled={!selectedRow || !selectedRow.length} className="mr-2" /> */}
                            {/* <Button label="Export" icon="pi pi-file-export" severity="info" onClick={actionExportCSV}></Button> */}
                        </div>
                    </div>
                    <h5>Boron (mg/L)</h5>
                    <div className="card">
                        <Chart type="line" data={chartData1} options={chartOptions1} />
                    </div>
                    <h5>COD (mg/L)</h5>
                    <div className="card">
                        <Chart type="line" data={chartData2} options={chartOptions2} />
                    </div>
                    <h5>Pb, Cu, Mn (mg/L)</h5>
                    <div className="card">
                        <Chart type="bar" data={chartData3} options={chartOption3} />
                    </div>
                    <h5>Zn, Iron (mg/L)</h5>
                    <div className="card">
                        <Chart type="line" data={chartData4} options={chartOptions4} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MiniLabMonitor;
