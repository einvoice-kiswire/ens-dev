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

import wwtData from '../../../api/wwtdata'

const WWTMonitor = () => {
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

    const [resultDummy, setResultDummy] = useState(wwtData)

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
        // const formattedDate = `${_currentYear}${_curentMonth}`;

        const _adjustYear = '2023'
        const _adjustMonth = '11'
        const formattedDate = `${_adjustYear}${_adjustMonth}`;

        setYYMM(formattedDate)
        // console.log ('dummy', resultDummy)
        handleGraf1Dummy(resultDummy)
    }


    const handleGraf1Dummy = (dataDT) => {
        console.log('handleGraf1Dummy', dataDT)
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        const label1 = []
        const dset1 = []
        const AT1 = []
        const AT2 = []
        const MT = []
        const T12 = []
        const AT11 = []
        const CT = []
        const F = []
        const SGEN = []
        const SDIS = []
        const SBAL = []


        dataDT.map(item => {
            const _wwtDate = item.wwtDate
            let sYYMM = _wwtDate.substring(0, 5);
            label1.push(sYYMM)

            const _wwtAT1p = item.wwtAT1p
            const _wwtAT1pOK = _wwtAT1p === null || _wwtAT1p === '' ? 0 : parseFloat(_wwtAT1p);
            AT1.push(_wwtAT1pOK)

            const _wwtAT2p = item.wwtAT2p
            const _wwtAT2pOK = _wwtAT2p === null || _wwtAT2p === '' ? 0 : parseFloat(_wwtAT2p);
            AT2.push(_wwtAT2pOK)

            const _wwtAT11p = item.wwtAT11p
            const _wwtAT11pOK = _wwtAT11p === null || _wwtAT11p === '' ? 0 : parseFloat(_wwtAT11p);
            AT11.push(_wwtAT11pOK)

            const _wwtMTp = item.wwtMTp
            const _wwtMTpOK = _wwtMTp === null || _wwtMTp === '' ? 0 : parseFloat(_wwtMTp);
            MT.push(_wwtMTpOK)

            const _wwtT12p = item.wwtT12p
            const _wwtT12pOK = _wwtT12p === null || _wwtT12p === '' ? 0 : parseFloat(_wwtT12p);
            T12.push(_wwtT12pOK)

            const _wwtCTp = item.wwtCTp
            const _wwtCTpOK = _wwtCTp === null || _wwtCTp === '' ? 0 : parseFloat(_wwtCTp);
            CT.push(_wwtCTpOK)

            const _wwtFp = item.wwtFp
            const _wwtFpOK = _wwtFp === null || _wwtFp === '' ? 0 : parseFloat(_wwtFp);
            F.push(_wwtFpOK)

            const _wwtSGen = item.wwtSGen
            const _wwtSGenOK = _wwtSGen === null || _wwtSGen === '' ? 0 : parseFloat(_wwtSGen);
            SGEN.push(_wwtSGen)

            const _wwtSDis = item.wwtSDis
            const _wwtSDisOK = _wwtSDis === null || _wwtSDis === '' ? 0 : parseFloat(_wwtSDis);
            SDIS.push(_wwtSDis)


            const _wwtSBal = item.wwtSBal
            const _wwtSBalOK = _wwtSBal === null || _wwtSBal === '' ? 0 : parseFloat(_wwtSBal);
            SBAL.push(_wwtSBalOK)



        })

        // console.log ('data2',label1)
        // console.log ('SGEN',SGEN)
        // console.log ('SDIS',SDIS)


        const data1 = {
            labels: label1,
            datasets: [
                {
                    label: 'Adj Tank 1',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--primary-600'),
                    tension: 0.4,
                    data: AT1,
                },
                {
                    label: 'Adj Tank 2',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--blue-600'),
                    tension: 0.4,
                    data: AT2,
                },
                {
                    label: 'Mix Tank',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: 0.4,
                    data: MT,
                },
                {
                    label: 'Tank 12',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--cyan-600'),
                    tension: 0.4,
                    data: T12,
                },
                {
                    label: 'Aeration Tank 11',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--pink-600'),
                    tension: 0.4,
                    data: AT11,
                },
                {
                    label: 'Clarifier Tank',
                    fill: false,
                    // borderDash: [5, 5],
                    borderColor: documentStyle.getPropertyValue('--indigo-600'),
                    tension: 0.4,
                    data: CT,
                },
                // {
                //     // type: 'bar',
                //     label: 'Aeration Tank 11',
                //     fill: false,
                //     backgroundColor: documentStyle.getPropertyValue('--blue-400'),
                //     // borderColor: documentStyle.getPropertyValue('--blue-300'),
                //     tension: 0.4,
                //     data: AT11,
                // },
                // {
                //     // type: 'bar',
                //     label: 'Clarifier Tank',
                //     fill: false,
                //     backgroundColor: documentStyle.getPropertyValue('--blue-400'),
                //     // borderColor: documentStyle.getPropertyValue('--blue-300'),
                //     tension: 0.4,
                //     data: CT,
                // },

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
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        drawOnChartArea: false,
                        color: surfaceBorder
                    }
                }
            }
        };

        const data2 = {
            labels: label1,
            datasets: [
                {
                    label: 'Generate',
                    backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                    borderColor: documentStyle.getPropertyValue('--blue-500'),
                    data: SGEN
                },
                {
                    label: 'Dispose',
                    backgroundColor: documentStyle.getPropertyValue('--pink-500'),
                    borderColor: documentStyle.getPropertyValue('--pink-500'),
                    data: SDIS
                }
            ]
        };

        const options2 = {
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

        setChartData1(data1);
        setChartOptions1(options1);

        setChartData2(data2);
        setChartOptions2(options2);

    }

    const handleGraf1 = (dataDT) => {

    }

    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            const _result = await minilab(params.UserID, params.GroupId, params.ToDate)

            // console.log('handleFetchData', _result)
            setResultDT(_result.data)

            handleGraf1(_result.data)
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
                    <h5>WWT Monitoring</h5>
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
                    <h5>Tank</h5>
                    <div className="card">
                        <Chart type="line" data={chartData1} options={chartOptions1} />
                    </div>
                    <h5>Sludge Bags</h5>
                    <div className="card">
                        <Chart type="bar" data={chartData2} options={chartOptions2} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WWTMonitor;
