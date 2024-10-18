/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Calendar } from 'primereact/calendar';
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';

// IMPORT FROM SQL
import { isLogin, LoginInfo, minilab, minilab_params, minilab_editsave, minilab_newsave, minilab_deletesave } from "../../../api/ens"

const DataEmpty = [
    {
        "mlbID": 'X',
        "GroupId": null,
        "mlbDate": null,
        "mlbTime": null,
        "mlbCod": 0,
        "mlbCodSa": null,
        "mlbCodSb": null,
        "mlbCodCL": null,
        "mlbPb": 0,
        "mlbPbSa": null,
        "mlbPbSb": null,
        "mlbPbCL": null,
        "mlbCu": 0,
        "mlbCuSa": null,
        "mlbCuSb": null,
        "mlbCuCL": null,
        "mlbMn": 0,
        "mlbMnSa": null,
        "mlbMnSb": null,
        "mlbMnCL": null,
        "mlbZn": 0,
        "mlbZnSa": null,
        "mlbZnSb": null,
        "mlbZnCL": null,
        "mlbBoron": 0,
        "mlbBoronSa": null,
        "mlbBoronSb": null,
        "mlbBoronCL": null,
        "mlbIron": 0,
        "mlbIronSa": null,
        "mlbIronSb": null,
        "mlbIronCL": null,
        "mlbEnviLab": null,
        "mlbInputDate": null,
        "mlbInputUser": null,
        "mlbUpdateDate": null,
        "mlbUpdateUser": null,
        "mlbParameter": null,
        "CancelYN": "N"
    }
]

const cGrey = { backgroundColor: 'var(--gray-100)' };
const cPink = { backgroundColor: 'var(--pink-100)' };
const cGreen = { backgroundColor: 'var(--green-100)' };
const cOrange = { backgroundColor: 'var(--orange-100)' };

const MiniLab = () => {
    //  ##################### Declaration variable ###############
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [mlParameter, setMlParameter] = useState([])
    const [resultDT, setResultDT] = useState([])
    const [YYMM, setYYMM] = useState()
    const [selectedRow, setSelectedRow] = useState()
    
    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [submitted, setSubmitted] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [dataDeleteDialog, setDataDeleteDialog] = useState(DataEmpty)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [dateDelete, setDateDelete] = useState()
     
    const handleLoad = () => {
        const _userLogin = isLogin();
        // console.log('handleLoad: _userLogin',_userLogin)
        if (!_userLogin) {
            router.push('/ens/login');
            return
        }
        // ~~~ collect minilab parameter 
        handleParameter()

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

    const handleParameter = async () => {
        const _params = {
            "UserID": LoginInfo('ENS_UserID'),
            "Type": "mlb"
        }
        try {
            const _result = await minilab_params(_params);
            setMlParameter(_result.data)

        } catch (error) {
            console.error('handleParameter ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        }
    }

    const handleFetchData = async (params) => {
        setLoading(true)

        try {
            const _result = await minilab(params.UserID, params.GroupId, params.ToDate)

            // console.log('handleFetchData', _result)
            setResultDT(_result.data)
        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        // console.log('handleKeyPress', e);
        if (e.key === 'Enter') {
            actionSearch()
        }
    }

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value.trim()) || ''
        let _dataDialogTemp = {...dataDialog}
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }   

    const handleEditSave = async () => {
        let _mlbDate = getValueOrDefault(dataDialog, 'mlbDate', '')
        const validDate = _mlbDate.replace(/\//g, '');

        try {
            const result = await minilab_editsave(LoginInfo('ENS_UserID'), LoginInfo('ENS_GroupID'),validDate, dataDialog)
            // console.log('result',result)
            if (result.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mini Lab Monitoring Updated', life: 3000 });
                setShowDialog(false)
                setDataDialog(DataEmpty)
                actionSearch()
            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { result }, life: 3000 });
                
            }
        } catch (error){
            console.error('Error saving handleEditSave:', error);
            
        }
    }

    const handleNewsave = async () => {
        let _mlbDate = getValueOrDefault(dataDialog, 'mlbDate', '')
        const validDate = _mlbDate.replace(/\//g, '');

        try {
            const result = await minilab_newsave(LoginInfo('ENS_UserID'), LoginInfo('ENS_GroupID'), validDate, dataDialog)
            // console.log('result', result)
            if (result.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mini Lab Monitoring Save', life: 3000 });
                setShowDialog(false)
                setDataDialog(DataEmpty)
                actionSearch()
            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { result }, life: 3000 });
            }

        } catch (error) {
            console.error('Error saving handleNewsave:', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        }
    }

    const handleDeleteSave = async () => {
        let _mlbDate = getValueOrDefault(dataDeleteDialog, 'mlbDate', '')
        const validDate = _mlbDate.replace(/\//g, '');

        // console.log('handleDeleteSave', validDate)
        try {
            const result = await minilab_deletesave(LoginInfo('ENS_UserID'), LoginInfo('ENS_GroupID'), validDate, dataDeleteDialog)
            if (result.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mini Lab Monitoring Deleted', life: 3000 });
                setShowDeleteDialog(false)
                setDataDeleteDialog(DataEmpty)     
                actionSearch()           
            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { result }, life: 3000 });
            }

        } catch (error) {
            console.error('Error saving handleDeleteSave:', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
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

    const actionNew = () => {
        // assign mlb Paramater
        assignMlbParameter('Cod')
        assignMlbParameter('Pb');
        assignMlbParameter('Cu');
        assignMlbParameter('Mn');
        assignMlbParameter('Zn');
        assignMlbParameter('Boron');
        assignMlbParameter('Iron');
        // console.log ('actionNew > Data Empty', DataEmpty)

        setDataDialog(DataEmpty)
        setSubmitted(false)
        setShowDialog(true)

    }
    const actionEdit = (rowData) => {
        // assign data Dialog
        // console.log('actionEdit > rowData', rowData)
        setDataDialog(rowData)
        setShowDialog(true)

    }
    const actionDelete = (rowData) => {
        // assign data delete dialog
        // console.log('actionDelete> rowData', rowData)
        const _tempDate = rowData.mlbDate
        const _formatDate = _tempDate.substring(6, 8) + '/' + _tempDate.substring(4, 6) + '/' + _tempDate.substring(0, 4)
        setDateDelete(_formatDate)

        setDataDeleteDialog(rowData)
        setShowDeleteDialog(true)
    }
    const actionDeletes = () => {
        // do
    }
    const actionExportCSV = () => {
        dt.current?.exportCSV();
    }

    const actionSaveDialog = () => { 
        setSubmitted(true);
        let _resultDT = [...resultDT]
        
        let _mlbDate = getValueOrDefault(dataDialog, 'mlbDate', '')
        let _mlbTime = getValueOrDefault(dataDialog, 'mlbTime', '')

        if (_mlbDate !='' && _mlbTime !='') {
            const validDate = _mlbDate.replace(/\//g, '');
            if (validDate.length === 8) {
                if (dataDialog.mlbID) {
                    // EDIT DATA
                    // console.log('edit',dataDialog)
                    handleEditSave();
                } else {
                    // NEW DATA
                    // console.log('new', dataDialog)
                    handleNewsave()
                }

            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Date & Time is Empty', life: 3000 });
            }
        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Date & Time is Empty', life: 3000 });
        }        
    }

    const actionDeleteDialog = () => {
        // console.log('actionDeleteDialog')
        handleDeleteSave()
    }

    const actionCloseDialog = () => {
        setShowDialog(false);
        setDataDialog(DataEmpty)
    };

    const actionCloseDeleteDialog = () =>{
        setShowDeleteDialog(false)
        setDataDeleteDialog(DataEmpty)
    }

    const actionRowButton = (rowData) => {
        return (
            <React.Fragment>
                <Button text icon="pi pi-pencil" severity="primary" onClick={() => actionEdit(rowData)} />
                <Button text icon="pi pi-trash" severity="danger" onClick={() => actionDelete(rowData)} />
            </React.Fragment>
        );
    };



    const tableHeaderAPI = (
        <ColumnGroup>
            <Row>
                <Column selectionMode="multiple" rowSpan={2} headerStyle={{ width: '10px' }}></Column>
                <Column header="Date" field="mlbDate" rowSpan={2} colSpan={1} sortable />
                <Column header="Paramameter (mg/L)" colSpan={7} className="text-center" />
                <Column rowSpan={2} headerStyle={{ width: '15px' }}></Column>
            </Row>

            <Row>
                <Column header="COD"></Column>
                <Column header="Pb"></Column>
                <Column header="Cu"></Column>
                <Column header="Mn"></Column>
                <Column header="Zn"></Column>
                <Column header="Boron"></Column>
                <Column header="Iron"></Column>
            </Row>
        </ColumnGroup>
    );

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

    function getValueOrDefault(data, key, defaultValue) {
        return data['0']?.[key] || data[key] || defaultValue;
    }

    const checkMlbParameter = (type) => {
        const mlTypeObj = mlParameter.find((item) => item.mlbType === type);
        return mlTypeObj ? { [`${type}Sa`]: mlTypeObj.mlbSa, [`${type}Sb`]: mlTypeObj.mlbSb, [`${type}CL`]: mlTypeObj.mlbCL } : {};
    }

    const assignMlbParameter = (paramName) => {
        const mlbParameter = checkMlbParameter(`mlb${paramName}`)

        DataEmpty[`mlb${paramName}Sa`] = mlbParameter[`mlb${paramName}Sa`]
        DataEmpty[`mlb${paramName}Sb`] = mlbParameter[`mlb${paramName}Sb`]
        DataEmpty[`mlb${paramName}CL`] = mlbParameter[`mlb${paramName}CL`]

    }

    const formatColData = (rowData, column) => {
        const _value = rowData[column];
        const _valueSa = rowData[`${column}Sa`]
        const _valueSb = rowData[`${column}Sb`]
        const _valueCL = rowData[`${column}CL`]
        const _stdData = checkMlbParameter(column)

        if (_value === '0' || _value === '' || _value === null) {
            return <div className='text-center'>-</div>
        } else if (_value === 'ND') {
            return <div className='text-center' style={cGreen}>{_value}</div>
        } else if (parseFloat(_value) > parseFloat(_valueSb)) {
            return <div className='text-center' style={cPink}>{parseFloat(_value).toFixed(2)}</div>
        // } else if (parseFloat(_value) >parseFloat(_valueCL)) {
        //     return <div className='text-center' style={cOrange}>{parseFloat(_value).toFixed(2)}</div>
        // } else if (parseFloat(_value) > parseFloat(_valueSa)) {
        //     return <div className='text-center' style={cGrey}>{parseFloat(_value).toFixed(2)}</div>
        } else {
            return <div className='text-center'>{parseFloat(_value).toFixed(2)}</div>
        }
    }

    const colDate = (rowData) => {
        const _mlbDate = rowData.mlbDate
        let year = _mlbDate.substring(0, 4);
        let month = _mlbDate.substring(4, 6);
        let day = _mlbDate.substring(6, 8);
        const formattedDate = `${day}/${month}/${year}`;

        return <div>{formattedDate}</div>;
    }

   

    const colCod = (rowData) => formatColData(rowData, 'mlbCod')
    const colPb = (rowData) => formatColData(rowData, 'mlbPb')
    const colCu = (rowData) => formatColData(rowData, 'mlbCu')
    const colMn = (rowData) => formatColData(rowData, 'mlbMn')
    const colZn = (rowData) => formatColData(rowData, 'mlbZn')
    const colBoron = (rowData) => formatColData(rowData, 'mlbBoron')
    const colIron = (rowData) => formatColData(rowData, 'mlbIron')

    useEffect(() => {
        handleLoad()
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
                            <Button label="New" icon="pi pi-plus" onClick={actionNew} severity="success" className="mr-2" raised />
                            {/* <Button label="Delete" icon="pi pi-trash" onClick={actionDeletes} severity="danger" disabled={!selectedRow || !selectedRow.length} className="mr-2" /> */}
                            <Button label="Export" icon="pi pi-file-export" severity="info" onClick={actionExportCSV}></Button>
                        </div>
                    </div>
                    {/* ################### UI FOR DATA TABLE ################## */}
                    <div className="mt-2">
                        <DataTable
                            loading={loading}
                            ref={dt}
                            dataKey="mlbID"
                            value={resultDT}
                            headerColumnGroup={tableHeaderAPI}
                            // footerColumnGroup={tableFooter}
                            selection={selectedRow}
                            onSelectionChange={(e) => setSelectedRow(e.value)}
                            resizableColumns
                            showGridlines
                            stripedRows
                            size={'small'}
                            emptyMessage="No monitoring found."
                            className="datatable-responsive"
                            tableStyle={{ minWidth: '50rem' }}
                        >
                            <Column selectionMode="multiple" exportable={false}></Column>
                            <Column body={colDate} header="Date" field="mlbDate" sortable></Column>
                            <Column body={colCod} header="COD" field="mlbCod" ></Column>
                            <Column body={colPb} header="Pb" field="mlbPb" ></Column>
                            <Column body={colCu} header="Cu" field="mlbCu" ></Column>
                            <Column body={colMn} header="Mn" field="mlbMn" ></Column>
                            <Column body={colZn} header="Zn" field="mlbZn" ></Column>
                            <Column body={colBoron} header="Boron" field="mlbBoron" ></Column>
                            <Column body={colIron} header="Iron" field="mlbIron" ></Column>

                            <Column body={actionRowButton} exportable={false}></Column>
                        </DataTable>
                    </div>
                    {/* ################# RECORD DIALOG ################# */}
                    <Dialog header="Record : Mini Lab Monitoring" visible={showDialog} onHide={actionCloseDialog} footer={dialogFooter} modal maximizable style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbDate">Date *(dd/mm/yyyy)</label>
                                    <InputMask id="mlbDate" mask="9999/99/99" placeholder="yyyy/mm/dd" value={dataDialog.mlbDate} required className={classNames({ 'p-invalid': !dataDialog.mlbDate || dataDialog.mlbDate.length <8 })} onChange={(e) => handleInputChange(e, 'mlbDate')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="mlTime">Time *(24Hour)</label>
                                    <InputMask id="mlTime" mask="99:99" placeholder="hh:mm" value={dataDialog.mlbTime} required className={classNames({ 'p-invalid': !dataDialog.mlbTime })} onChange={(e) => handleInputChange(e, 'mlbTime')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbCod">COD</label>
                                    <InputText id="mlbCod" value={dataDialog.mlbCod} onChange={(e) => handleInputChange(e, 'mlbCod')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbPb">Pb</label>
                                    <InputText id="mlbPb" value={dataDialog.mlbPb} onChange={(e) => handleInputChange(e, 'mlbPb')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbCu">Cu</label>
                                    <InputText id="mlbCu" value={dataDialog.mlbCu} onChange={(e) => handleInputChange(e, 'mlbCu')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbMn">Mn</label>
                                    <InputText id="mlbMn" value={dataDialog.mlbMn} onChange={(e) => handleInputChange(e, 'mlbMn')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbZn">Zn</label>
                                    <InputText id="mlbZn" value={dataDialog.mlbZn} onChange={(e) => handleInputChange(e, 'mlbZn')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbBoron">Boron</label>
                                    <InputText id="mlbBoron" value={dataDialog.mlbBoron} onChange={(e) => handleInputChange(e, 'mlbBoron')} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbIron">Iron</label>
                                    <InputText id="mlbIron" value={dataDialog.mlbIron} onChange={(e) => handleInputChange(e, 'mlbIron')} />
                                </div>
                            </div>
                            {/* <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbEnviLab">EnviLab Boron</label>
                                    <InputText id="mlbEnviLab" value={dataDialog.mlbEnviLab} onChange={(e) => handleInputChange(e, 'mlbEnviLab')} />
                                </div>
                            </div> */}
                            
                        </div>
                        <div className="formgrid grid"></div>
                    </Dialog>
                    {/* ################# SINGLE DELETE DIALOG ################# */}
                    <Dialog visible={showDeleteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteDialogFooter} onHide={actionCloseDeleteDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            
                            {dataDeleteDialog && <span>Date: <strong>{dateDelete}</strong>, Are you sure you want to delete ? </span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>

    );
};


export default MiniLab;
