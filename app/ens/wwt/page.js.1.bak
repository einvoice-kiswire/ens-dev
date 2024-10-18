'use client';

import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import wwtData from '../../../api/wwtdata'

const wwtDataEmpty = [
    {
        wwtId: 'X',
        wwtDate: '',
        wwtTime: '',
        wwtAT1p: '',
        wwwAT1s: '',
        wwtMTp: '',
        wwtAT2p: '',
        wwtAT2s: '',
        wwtAT11p: '',
        wwtT12p: '',
        wwtCTp: '',
        wwtFp: '',
        wwtCColor: '',
        wwtCFSize: '',
        wwtCSpeed: '',
        wwtFWColor: '',
        wwtFRD1: '',
        wwtFRD2: '',
        wwtEQF1: '',
        wwtEQF2: '',
        wwtLIncoming: '',
        wwtPUsage: '',
        wwtSGen: '',
        wwtSDis: '',
        wwtSBal: '',
        wwtRemark: '',
        wwtDateTime: '',
        wwtUser: ''
    }
];

const wwtParameter = [
    {
        wwtType: 'wwtAT1s',
        wwtSa: 9,
        wwtSb: 10.5
    },
    {
        wwtType: 'wwtAT2s',
        wwtSa: 8,
        wwtSb: 12
    }
];
const wwtCColorOption = [
    { name: 'Clear', code: 'Clear' },
    { name: 'Reddish', code: 'Reddish' },
    { name: 'Dark', code: 'Dark' }
];
const wwtCFSizeOption = [
    { name: 'Medium', code: 'Medium' },
    { name: 'Small', code: 'Small' },
    { name: 'Big', code: 'Big' }
];
const wwtCSpeedOption = [
    { name: 'Fast', code: 'Fast' },
    { name: 'Medium', code: 'Medium' },
    { name: 'Slow', code: 'Slow' }
];
const wwtFWColorOption = [
    { name: 'Clear', code: 'Clear' },
    { name: 'Reddish', code: 'Reddish' },
    { name: 'Dark', code: 'Dark' }
];

const wwtAT1sObject = wwtParameter.find((item) => item.wwtType === 'wwtAT1s');
const wwtAT2sObject = wwtParameter.find((item) => item.wwtType === 'wwtAT2s');

const cGrey = { backgroundColor: 'var(--gray-100)' };
const cPink = { backgroundColor: 'var(--pink-100)' };
const cGreen = { backgroundColor: 'var(--green-100)' };
const cOrange = { backgroundColor: 'var(--orange-100)' };
const cPrimary = { backgroundColor: 'var(--primary-100)' };

const WWT = () => {
    //  ##################### Declaration variable ###############
    const toast = useRef(null);
    const dt = useRef(null);
    const [date, setDate] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedDeleteRow, setSelectedDeleteRow] = useState(null);
    const [dataDialog, setDataDialog] = useState(wwtDataEmpty);
    const [dataDeleteDialog, setDataDeleteDialog] = useState(wwtDataEmpty);
    const [showDialog, setShowDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deletesDialog, setDeletesDialog] = useState(false);

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };
    const findIndexById = (id) => {
        let index = -1;

        for (let i = 0; i < resultData.length; i++) {
            if (resultData[i].wwtId === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    // ##################### TOOLBAR UI ##########################
    const SearchFormUI = () => {
        return (
            <React.Fragment>
                <div className="grid">
                    <div className="col-6">
                        <div className="justify-content-left">
                            Month : <Calendar value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
                            <Button label="Search" outlined />
                        </div>
                    </div>
                    <div className="col-6 ">
                        <div className="text-right ">
                            <Button label="New" icon="pi pi-plus" onClick={actionNew} severity="success" className="mr-2" raised />
                            <Button label="Delete" icon="pi pi-trash" onClick={actionDeletes} severity="danger" disabled={!selectedRow || !selectedRow.length} className="mr-2" />
                            <Button label="Export" icon="pi pi-file-export" severity="info" onClick={exportCSV}></Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };
    // ##################### DIALOG UI & UX ##########################
    function getValueOrDefault(data, key, defaultValue) {
        return data['0']?.[key] || data[key] || defaultValue;
    }

    const actionNew = () => {
        //DO SOMETHING
        setDataDialog(wwtDataEmpty);
        setSubmitted(false);
        setShowDialog(true);
    };
    const actionEdit = (rowData) => {
        //DO SOMETHING
        let _dataDialogTemp = { ...rowData };
        setDataDialog({ ..._dataDialogTemp });
        setShowDialog(true);
    };

    const actionDelete = (rowData) => {
         setDataDeleteDialog(rowData);
         setDeleteDialog(true);
    };

    const actionDeletes = () => {
        setDeletesDialog(true);
    };
    const actionSaveDialog = () => {
        // console.log('actionSave');
        setSubmitted(true);

        let _resultDataTemp = [...resultData];
        let _dataDialogTemp = { ...dataDialog };

        let _wwtDate = getValueOrDefault(dataDialog, 'wwtDate', '');
        let _wwtTime = getValueOrDefault(dataDialog, 'wwtTime', '');

        if (_wwtDate.length < 10 || _wwtTime.length < 5) {
            //  console.log('error date & time ');
        } else {
            if (dataDialog.wwtId) {
                //  console.log('edit',dataDialog.wwtId);
                const index = findIndexById(dataDialog.wwtId);
                _resultDataTemp[index] = _dataDialogTemp;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Monitoring Updated', life: 3000 });
            } else {
                // console.log('new');
                let _wwtIdtemp = createId();
                _dataDialogTemp.mlId = _wwtIdtemp;
                _resultDataTemp.push(_dataDialogTemp);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Monitoring Created', life: 3000 });
            }
            setResultData(_resultDataTemp);
            setShowDialog(false);
            setDataDialog(wwtDataEmpty);
        }
    };

    const actionDeleteDialog = () => {
        let _resultData = resultData.filter((val) => val.wwtId !== dataDeleteDialog.wwtId);

        setResultData(_resultData);
        setDeleteDialog(false);
        setDataDialog(wwtDataEmpty);
        toast.current.show({ severity: 'error', summary: 'Successful', detail: 'Date Deleted', life: 3000 });
    };

    const actionDeletesDialog = () => {
        let _resultData = resultData.filter((val) => !selectedRow.includes(val));
        setResultData(_resultData);
        setDeletesDialog(false);
        setSelectedRow(null);
        toast.current.show({ severity: 'warn', summary: 'Successful', detail: 'Dates Deleted', life: 3000 });
    };
    const actionCloseDialog = () => {
        //DO SOMETHING
        setShowDialog(false);
    };

    const actionCloseDeleteDialog = () => {
        setDeleteDialog(false);
    };

    const actionCloseDeletesDialog = () => {
        setDeletesDialog(false);
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _dataDialogTemp = { ...dataDialog };
        _dataDialogTemp[`${name}`] = val;
        setDataDialog(_dataDialogTemp);
    };

    const onDropChange = (e, name) => {
        const val = (e && e.value) || '';
        let _dataDialogTemp = { ...dataDialog };
        _dataDialogTemp[`${name}`] = val;
        setDataDialog(_dataDialogTemp);
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined severity="secondary" onClick={actionCloseDialog} />
            <Button label="Save" icon="pi pi-check" severity="primary" onClick={actionSaveDialog} />
        </React.Fragment>
    );

    const deleteDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={actionCloseDeleteDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={actionDeleteDialog} />
        </React.Fragment>
    );
    const deletesDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={actionCloseDeletesDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={actionDeletesDialog} />
        </React.Fragment>
    );

    // ##################### TABLE UI ##########################
    const actionRowButton = (rowData) => {
        return (
            <React.Fragment>
                <Button text icon="pi pi-pencil" severity="primary" onClick={() => actionEdit(rowData)} />
                <Button text icon="pi pi-trash" severity="danger" onClick={() => actionDelete(rowData)} />
            </React.Fragment>
        );
    };

    const formatBodywwtATp = (rowData, property, sa, sb) => {
        const value = rowData[property];

        if (value === '0') {
            return '-';
        } else if (value === 'ND') {
            return <div style={cGreen}>ND</div>;
            // } else if (value < sa || value > sb) {
            //     return <div style={cPink}>{value}</div>;
        } else {
            return <div>{value}</div>;
        }
    };
    const formattedWwtAT1p = (rowData) => formatBodywwtATp(rowData, 'wwtAT1p', wwtAT1sObject.wwtSa, wwtAT1sObject.wwtSb);
    const formattedWwtAT2p = (rowData) => formatBodywwtATp(rowData, 'wwtAT2p', wwtAT2sObject.wwtSa, wwtAT2sObject.wwtSb);

    const formatBodywwtFRD = (rowData) => {
        let _wwtFRD1 = rowData.wwtFRD2 / 24;
        // console.log('formatBodywwtFRD', rowData.wwtFRD2);
        return <>{_wwtFRD1.toFixed(1)}</>;
    };

    const formatBodywwtEQF = (rowData) => {
        let _wwtEQF1 = rowData.wwtEQF2 / 24;
        return <>{_wwtEQF1.toFixed(1)}</>;
    };

    const formatBodywwtSDis = (rowData) => {
        let _wwtSDis = rowData.wwtSDis;
        if (_wwtSDis > 0) {
            return <div style={cGreen}>{_wwtSDis}</div>;
        } else {
            return <div>-</div>;
        }
    };

    const formatBodyCoagulation = (rowData, property) => {
        let value = rowData[property];
        return <div>{value ? value.name : ''}</div>;
    };

    const formatBodywwtCColor = (rowData) => formatBodyCoagulation(rowData, 'wwtCColor');
    const formatBodywwtCFSize = (rowData) => formatBodyCoagulation(rowData, 'wwtCFSize');
    const formatBodywwtCSpeed = (rowData) => formatBodyCoagulation(rowData, 'wwtCSpeed');
    const formatBodywwtFWColor = (rowData) => formatBodyCoagulation(rowData, 'wwtFWColor');

    function calTableStats(propertyName) {
        const values = wwtData.map((entry) => entry[propertyName]);
        const total = values.reduce((acc, value) => acc + value, 0);
        const average = total / values.length;
        const total2 = total / 24;
        const average2 = total2 / values.length;
        const max = Math.max(...values);
        const min = Math.min(...values);

        return {
            total,
            average,
            max,
            min,
            total2,
            average2
        };
    }

    const wwtAT1pStats = calTableStats('wwtAT1p');
    const wwtMTpStats = calTableStats('wwtMTp');
    const wwtAT2pStats = calTableStats('wwtAT2p');
    const wwtAT11pStats = calTableStats('wwtAT11p');
    const wwtT12pStats = calTableStats('wwtT12p');
    const wwtCTpStats = calTableStats('wwtCTp');
    const wwtFpStats = calTableStats('wwtFp');
    const wwtFRD2Stats = calTableStats('wwtFRD2');
    const wwtEQF2Stats = calTableStats('wwtEQF2');
    const wwtLIncomingStats = calTableStats('wwtLIncoming');
    const wwtPUsageStats = calTableStats('wwtPUsage');
    const wwtSGenStats = calTableStats('wwtSGen');
    const wwtSDisStats = calTableStats('wwtSDis');
    const wwtSBalStats = calTableStats('wwtSBal');

    const wwtSGenTotal = wwtSGenStats.total;
    const wwtSDisTotal = wwtSDisStats.total;
    const wwtSBalTotal = wwtSBalStats.total;

    const wstSBalLast = wwtSBalTotal + wwtSGenTotal - wwtSDisTotal;

    const tableHeader = (
        <ColumnGroup>
            <Row>
                <Column selectionMode="multiple" rowSpan={3} headerStyle={{ width: '10px' }} />
                <Column header="Date" field="mlDate" rowSpan={3} colSpan={1} sortable />
                <Column header="Adj" />
                <Column header="Mix " />
                <Column header="Adj" />
                <Column header="Aeration" />
                <Column header="Tank 12" rowSpan={2} />
                <Column header="Clarifier" />
                <Column header="Final " rowSpan={2} />
                <Column header="Coagulation" colSpan={3} />
                <Column header="Final " />
                <Column header="Flowrate " colSpan={2} />
                <Column header="EQ" colSpan={2} />
                <Column header="Lime" />
                <Column header="Polymer" />
                <Column header="Sludge" colSpan={2} />
                <Column rowSpan={3} headerStyle={{ width: '10px' }} />
            </Row>
            <Row>
                <Column header="Tank 1" />
                <Column header="Tank" />
                <Column header="Tank 2" />
                <Column header="Tank 11" />
                <Column header="Tank" />
                <Column header="Color" rowSpan={2} />
                <Column header="Floc" />
                <Column header="Slinking" />
                <Column header="Water " />
                <Column header="(Discharge) " colSpan={2} />
                <Column header="Flowrate (In) " colSpan={2} />
                <Column header="Incoming" />
                <Column header="Usage" />
                <Column header="(Bags)" colSpan={2} />
            </Row>

            <Row>
                <Column header="Panel" />
                <Column header="Panel" />
                <Column header="Panel" />
                <Column header="Portable" />
                <Column header="Panel" />
                <Column header="Panel" />
                <Column header="Portable" />
                {/* <Column header="Color" headerStyle={{ width: '5%' }} /> */}
                <Column header="Size" />
                <Column header="Speed" />
                <Column header="Color" />
                {/* <Column header="(m<sup>3</sup>/h)" /> */}
                {/* <Column header="(m3/d)" /> */}
                {/* <Column header="(m3/h)" /> */}
                {/* <Column header="(m3/d)" /> */}
                <Column header={<span dangerouslySetInnerHTML={{ __html: '(m<sup>3</sup>/h)' }} />} />
                <Column header={<span dangerouslySetInnerHTML={{ __html: '(m<sup>3</sup>/d)' }} />} />
                <Column header={<span dangerouslySetInnerHTML={{ __html: '(m<sup>3</sup>/h)' }} />} />
                <Column header={<span dangerouslySetInnerHTML={{ __html: '(m<sup>3</sup>/d)' }} />} />
                <Column header="Qty (kg)" />
                <Column header="Qty (kg)" />
                <Column header="Generate" />
                <Column header="Dispose" />
                {/* <Column header="Balance" /> */}
            </Row>
        </ColumnGroup>
    );

    const tableFooter = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={2} className="text-center" style={cGrey} />
                <Column footer={wwtAT1pStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtMTpStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtAT2pStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtAT11pStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtT12pStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtCTpStats.total.toFixed(1)} className="text-center" />
                <Column footer={wwtFpStats.total.toFixed(1)} className="text-center" />
                <Column footer="Total" colSpan={4} className="text-center" style={cGrey} />
                <Column footer={wwtFRD2Stats.total2.toFixed(1)} className="text-center" />
                <Column footer={wwtFRD2Stats.total.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtEQF2Stats.total2.toFixed(1)} className="text-center" />
                <Column footer={wwtEQF2Stats.total.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtLIncomingStats.total.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtPUsageStats.total.toFixed(0)} className="text-center" />
                <Column footer={'Last Month :' + wwtSBalTotal} colSpan={2} className="text-left" style={cGrey} />
                <Column />
            </Row>
            <Row>
                <Column footer="Average" colSpan={2} className="text-center" style={cGrey} />
                <Column footer={wwtAT1pStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtMTpStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtAT2pStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtAT11pStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtT12pStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtCTpStats.average.toFixed(1)} className="text-center" />
                <Column footer={wwtFpStats.average.toFixed(1)} className="text-center" />
                <Column footer="Average" colSpan={4} className="text-center" style={cGrey} />
                <Column footer={wwtFRD2Stats.average2.toFixed(1)} className="text-center" />
                <Column footer={wwtFRD2Stats.average.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtEQF2Stats.average2.toFixed(1)} className="text-center" />
                <Column footer={wwtEQF2Stats.average.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtLIncomingStats.average.toLocaleString('en-US')} className="text-center" />
                <Column footer={wwtPUsageStats.average.toFixed(0)} className="text-center" />
                <Column footer={'Today Balance :' + wstSBalLast} colSpan={2} className="text-left" style={cGrey} />
                <Column />
            </Row>
        </ColumnGroup>
    );

    const ResultTableUI = () => {
        return (
            <React.Fragment>
                <DataTable
                    ref={dt}
                    value={resultData}
                    headerColumnGroup={tableHeader}
                    footerColumnGroup={tableFooter}
                    selection={selectedRow}
                    onSelectionChange={(e) => setSelectedRow(e.value)}
                    dataKey="wwtId"
                    resizableColumns
                    showGridlines
                    stripedRows
                    size={'small'}
                    emptyMessage="No products found."
                    className="datatable-responsive"
                    tableStyle={{ minWidth: '50rem' }}
                >
                    <Column selectionMode="multiple" exportable={false} className="text-center" />
                    <Column header="Date" field="wwtDate" />
                    <Column body={formattedWwtAT1p} header="Adj Tank 1 (Rising Water) Panel" field="wwtAT1p" className="text-center" />
                    <Column header="Mix Tank Panel" field="wwtMTp" className="text-center" />
                    <Column body={formattedWwtAT2p} header="Adj Tank 2 Panel" field="wwtAT2p" className="text-center" />
                    <Column header="Aeration Tank 11" field="wwtAT11p" className="text-center" />
                    <Column header="Tank 12 (Panel)" field="wwtT12p" className="text-center" />
                    <Column header="Clarifier Tank (Panel)" field="wwtCTp" className="text-center" />
                    <Column header="Final Portable" field="wwtFp" className="text-center" />
                    <Column body={formatBodywwtCColor} header="Coagulation (Color)" field="wwtCColor" className="text-left" />
                    <Column body={formatBodywwtCFSize} header="Coagulation (Floc Size)" field="wwtCFSize" className="text-left" />
                    <Column body={formatBodywwtCSpeed} header="Coagulation (Slinking Speed)" field="wwtCSpeed" className="text-left" />
                    <Column body={formatBodywwtFWColor} header="Final Water Color" field="wwtFWColor" className="text-left" />
                    <Column body={formatBodywwtFRD} header="Flowrate (Discharge) (m3/h)" field="wwtFRD1" className="text-center" />
                    <Column header="Flowrate (Discharge) (m3/d)" field="wwtFRD2" className="text-center" />
                    <Column body={formatBodywwtEQF} header="EQ Flowrate(In)(m3/h)" field="wwtEQF1" className="text-center" />
                    <Column header="EQ Flowrate(In)(m3/d)" field="wwtEQF2" className="text-center" />
                    <Column header="Lime Incoming (Qty)" field="wwtLIncoming" className="text-center" />
                    <Column header="Polymer Usage" field="wwtPUsage" className="text-center" />
                    <Column header="Sludge Generate (Bags)" field="wwtSGen" className="text-center" />
                    <Column body={formatBodywwtSDis} header="Sludge Dispose(Bags)" field="wwtSDis" className="text-center" />
                    {/* <Column header="Polymer Balance (Bags)" field="wwtSBal" className="text-center" /> */}
                    <Column body={actionRowButton} exportable={false} />
                </DataTable>
            </React.Fragment>
        );
    };

    // ##################### END TABLE UI ##########################
    useEffect(() => {
        setResultData(wwtData);
        // console.log('data', resultData);
    }, []);
    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <h5>WWT Monitoring</h5>
                    <SearchFormUI />
                    <ResultTableUI />
                    {/* ################# RECORD DIALOG ################# */}
                    <Dialog header="Record : WWT Monitoring" visible={showDialog} onHide={actionCloseDialog} footer={dialogFooter} modal maximizable style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtDate">Date *(dd/mm/yyyy)</label>
                                    <InputMask id="wwtDate" mask="99/99/9999" placeholder="dd/mm/yyyy" value={dataDialog.wwtDate} required className={classNames({ 'p-invalid': !dataDialog.mlDate })} onChange={(e) => onInputChange(e, 'wwtDate')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtTime">Time *(24Hour)</label>
                                    <InputMask id="wwtTime" mask="99:99" placeholder="hh:mm" value={dataDialog.wwtTime} required className={classNames({ 'p-invalid': !dataDialog.wwtTime })} onChange={(e) => onInputChange(e, 'wwtTime')} />
                                </div>
                            </div>
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtAT1p">
                                        Adj Tank 1
                                        <i>
                                            {' '}
                                            (Settings: {wwtAT1sObject.wwtSa.toFixed(1)}-{wwtAT1sObject.wwtSb.toFixed(1)})
                                        </i>
                                    </label>
                                    <InputText id="wwtAT1p" value={dataDialog.wwtAT1p} onChange={(e) => onInputChange(e, 'wwtAT1p')} />
                                    <InputText type="hidden" id="wwwAT1s" value={`${wwtAT1sObject.wwtSa.toFixed(1)}-${wwtAT1sObject.wwtSb.toFixed(1)}`} onChange={(e) => onInputChange(e, 'wwwAT1s')} />
                                </div>
                            </div>
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtMTp">Mix Tank </label>
                                    <InputText id="wwtMTp" value={dataDialog.wwtMTp} onChange={(e) => onInputChange(e, 'wwtMTp')} />
                                </div>
                            </div>
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtAT2p">
                                        Adj Tank 2
                                        <i>
                                            {' '}
                                            (Settings: {wwtAT2sObject.wwtSa.toFixed(1)}-{wwtAT2sObject.wwtSb.toFixed(1)})
                                        </i>
                                    </label>
                                    <InputText id="wwtAT2p" value={dataDialog.wwtAT2p} onChange={(e) => onInputChange(e, 'wwtAT2p')} />
                                    <InputText type="hidden" id="wwtAT2s" value={`${wwtAT2sObject.wwtSa.toFixed(1)}-${wwtAT2sObject.wwtSb.toFixed(1)}`} onChange={(e) => onInputChange(e, 'wwtAT2s')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtAT11p">Aeration Tank 11 </label>
                                    <InputText id="wwtAT11p" value={dataDialog.wwtAT11p} onChange={(e) => onInputChange(e, 'wwtAT11p')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtT12p">Tank 12 </label>
                                    <InputText id="wwtT12p" value={dataDialog.wwtT12p} onChange={(e) => onInputChange(e, 'wwtT12p')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtCTp">Clarifier Tank </label>
                                    <InputText id="wwtCTp" value={dataDialog.wwtCTp} onChange={(e) => onInputChange(e, 'wwtCTp')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtFp">Final Portable </label>
                                    <InputText id="wwtFp" value={dataDialog.wwtFp} onChange={(e) => onInputChange(e, 'wwtFp')} />
                                </div>
                            </div>
                            <div className="field col-12">
                                <div className="flex flex-column">
                                    <strong>
                                        <u>Coagulation</u>
                                    </strong>
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtCColor">Color</label>
                                    {/* <InputText id="wwtCColor" value={dataDialog.wwtCColor} onChange={(e) => onInputChange(e, 'wwtCColor')} /> */}
                                    <Dropdown value={dataDialog.wwtCColor} onChange={(e) => onDropChange(e, 'wwtCColor')} options={wwtCColorOption} optionLabel="name" placeholder="Color" />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtCFSize">Floc Size</label>
                                    {/* <InputText id="wwtCFSize" value={dataDialog.wwtCFSize} onChange={(e) => onInputChange(e, 'wwtCFSize')} /> */}
                                    <Dropdown value={dataDialog.wwtCFSize} onChange={(e) => onDropChange(e, 'wwtCFSize')} options={wwtCFSizeOption} optionLabel="name" placeholder="Floc Size" />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtCSpeed">Slinking Speed</label>
                                    {/* <InputText id="wwtCSpeed" value={dataDialog.wwtCSpeed} onChange={(e) => onInputChange(e, 'wwtCSpeed')} /> */}
                                    <Dropdown value={dataDialog.wwtCSpeed} onChange={(e) => onDropChange(e, 'wwtCSpeed')} options={wwtCSpeedOption} optionLabel="name" placeholder="Slinking Speed" />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtFWColor">Final Water Color</label>
                                    {/* <InputText id="wwtFWColor" value={dataDialog.wwtFWColor} onChange={(e) => onInputChange(e, 'wwtFWColor')} /> */}
                                    <Dropdown value={dataDialog.wwtFWColor} onChange={(e) => onDropChange(e, 'wwtFWColor')} options={wwtFWColorOption} optionLabel="name" placeholder="Final Water Color" />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtFRD2">
                                        Flowrate (Discharge) m<sup>3</sup>d
                                    </label>
                                    <InputText id="wwtFRD2" value={dataDialog.wwtFRD2} onChange={(e) => onInputChange(e, 'wwtFRD2')} />
                                    <InputText type="hidden" id="wwtFRD1" value={isNaN(dataDialog.wwtFRD2) ? '0' : dataDialog.wwtFRD2 / 24} onChange={(e) => onInputChange(e, 'wwtFRD1')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtEQF2">
                                        EQ Flowrate m<sup>3</sup>d
                                    </label>
                                    <InputText id="wwtEQF2" value={dataDialog.wwtEQF2} onChange={(e) => onInputChange(e, 'wwtEQF2')} />
                                    <InputText type="hidden" id="wwtEQF1" value={isNaN(dataDialog.wwtEQF2) ? '0' : dataDialog.wwtEQF2 / 24} onChange={(e) => onInputChange(e, 'wwtEQF1')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtLIncoming">Lime Incoming Qty (kg)</label>
                                    <InputText id="wwtLIncoming" value={dataDialog.wwtLIncoming} onChange={(e) => onInputChange(e, 'wwtLIncoming')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtPUsage">Polymer Usage Qty (kg)</label>
                                    <InputText id="wwtPUsage" value={dataDialog.wwtPUsage} onChange={(e) => onInputChange(e, 'wwtPUsage')} />
                                </div>
                            </div>
                            <div className="field col-12">
                                <div className="flex flex-column">
                                    <strong>
                                        <u>Sludge(Bags)</u>
                                    </strong>
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtSGen">Generate</label>
                                    <InputText id="wwtSGen" value={dataDialog.wwtSGen} onChange={(e) => onInputChange(e, 'wwtSGen')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtSDis">Dispose</label>
                                    <InputText id="wwtSDis" value={dataDialog.wwtSDis} onChange={(e) => onInputChange(e, 'wwtSDis')} />
                                </div>
                            </div>
                            <div className="field col-12">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtSBal">
                                        Balance Last Month <i>*entry for 1st day of the month only</i>
                                    </label>
                                    <InputText id="wwtSBal" value={dataDialog.wwtSBal} onChange={(e) => onInputChange(e, 'wwtSBal')} />
                                </div>
                            </div>
                            <div className="field col-12">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtRemark">Remark/ Notes</label>
                                    <InputTextarea id="wwtRemark" value={dataDialog.wwtRemark} onChange={(e) => onInputChange(e, 'wwtSwwtRemarkBal')} rows={3} cols={30} />
                                </div>
                            </div>
                        </div>
                    </Dialog>
                    {/* ################# SINGLE DELETE DIALOG ################# */}
                    <Dialog visible={deleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDialogFooter} onHide={actionCloseDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {dataDeleteDialog && <span>Are you sure you want to delete ? {dataDeleteDialog.wwtDate}</span>}
                        </div>
                    </Dialog>
                    {/* ################# MANY DELETE DIALOG################# */}
                    <Dialog visible={deletesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deletesDialogFooter} onHide={actionCloseDeletesDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {selectedRow && <span>Are you sure you want to delete the selected dates?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default WWT;
