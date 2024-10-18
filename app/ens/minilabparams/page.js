/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

import { isLogin, LoginInfo, mlbparamset, mlbparamset_editsave } from "../../../api/ens"

const DataEmpty = {
    "mlbType": "X",
    "mlbName": null,
    "mlbSa": null,
    "mlbSb": null,
    "mlbCL": null
}


const MiniLabParams = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [resultDT, setResultDT] = useState([])
    const [selectedRow, setSelectedRow] = useState()

    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [submitted, setSubmitted] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [mlbName, setMlbName] = useState(null)

    function getValueOrDefault(data, key, defaultValue) {
        return data['0']?.[key] || data[key] || defaultValue;
    }

    const handleLoad = () => {
        const _userLogin = isLogin();

        if (!_userLogin) {
            router.push('/ens/login');
            return
        }
        const _paramsDT = {
            "wwtType": "mlb"
        }
        // console.log ('param', _paramsDT)
        handleFetchData(_paramsDT)
    }
    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            const _result = await mlbparamset(params)
            // console.log('handleFetchData', _result)
            setResultDT(_result.data)

        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const handleEditSave = async (params) => {
        try {
            const _result = await mlbparamset_editsave(params)
            // console.log('handleFetchData', _result)

            if (_result.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Mini Lab Parameter Updated', life: 3000 });
            } else {
                console.error('handleEditSave ', _result);
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { _result }, life: 3000 });
            }

        } catch (error) {
            console.error('handleEditSave ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            // nothing
            handleLoad();
        }
    }

    // const handleInputChange = (e, name) => {
    //     const val = (e.target && e.target.value.trim()) || ''
    //     let _dataDialogTemp = { ...dataDialog }
    //     _dataDialogTemp[`${name}`] = val
    //     setDataDialog(_dataDialogTemp)
    // }

    const handleNumberChange = (e, name) => {
        const val = e.value
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }



    const actionEdit = (rowData) => {
        // action here
        const _mlbType = rowData.mlbType
        const mlbTypeOK = _mlbType.substring(3);

        setMlbName(mlbTypeOK)

        setDataDialog(rowData)
        setShowDialog(true)
    }

    const actionSaveDialog = () => {
        setSubmitted(true);

        let _mlbType = getValueOrDefault(dataDialog, 'mlbType', 'X')
        let _mlbSa = getValueOrDefault(dataDialog, 'mlbSa', 0)
        let _mlbSb = getValueOrDefault(dataDialog, 'mlbSb', 0)
        let _mlbCL = getValueOrDefault(dataDialog, 'mlbCL', 0)


        if (_mlbType === 'X' || _mlbSa === 0 || _mlbSb === 0 || _mlbCL === 0) {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Sa, Sb, CL is NULL', life: 3000 });
        } else {

            const _params = {
                "mlbType": _mlbType,
                "mlbSa": _mlbSa,
                "mlbSb": _mlbSb,
                "mlbCL": _mlbCL
            }

            // console.log ('_params', _params)
            handleEditSave(_params)

            setShowDialog(false);
            setDataDialog(DataEmpty)
        }
    }

    const actionCloseDialog = () => {
        setShowDialog(false);
        setDataDialog(DataEmpty)
    }

    const actionRowButton = (rowData) => {
        return (
            <React.Fragment>
                <Button text icon="pi pi-pencil" severity="primary" onClick={() => actionEdit(rowData)} />
                {/* <Button text icon="pi pi-trash" severity="danger" onClick={() => actionDelete(rowData)} /> */}
            </React.Fragment>
        );
    };

    const dialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined severity="secondary" onClick={actionCloseDialog} />
            <Button label="Save" icon="pi pi-check" severity="primary" onClick={actionSaveDialog} />
        </React.Fragment>
    );

    const colmlbType = (rowData) => {
        const _mlbType = rowData.mlbType
        const mlbTypeOK = _mlbType.substring(3);

        return (<div>{mlbTypeOK}</div>)
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>Mini Lab Parameter</h5>
                    <div className="mt-2">
                        <DataTable
                            loading={loading}
                            ref={dt}
                            dataKey="mlbType"
                            value={resultDT}
                            // headerColumnGroup={tableHeaderAPI}
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
                            <Column body={colmlbType} header="Monitor Type" field="mlbType" sortable></Column>
                            <Column header="Sa (mg/L)" field="mlbSa"></Column>
                            <Column header="Sb (mg/L)" field="mlbSb"></Column>
                            <Column header="CL (mg/L)" field="mlbCL"></Column>
                            <Column body={actionRowButton} exportable={false} style={{ width: '10px' }}></Column>
                        </DataTable>
                    </div>
                    {/* ################# RECORD DIALOG ################# */}
                    <Dialog header="Parameter : Mini Lab " visible={showDialog} onHide={actionCloseDialog} footer={dialogFooter} modal maximizable style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div className="formgrid grid">
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbName">Monitor Type</label>
                                    <InputText id="mlbName" value={mlbName} disabled />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbSa">Sa</label>
                                    {/* <InputText id="mlbCod" value={dataDialog.mlbSa} onChange={(e) => handleInputChange(e, 'mlbSa')} /> */}
                                    <InputNumber id="mlbSa"  value={dataDialog.mlbSa} onValueChange={(e) => handleNumberChange(e, 'mlbSa')} minFractionDigits={2} maxFractionDigits={5} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbSb">Sb</label>
                                    {/* <InputText id="mlbCod" value={dataDialog.mlbSa} onChange={(e) => handleInputChange(e, 'mlbSa')} /> */}
                                    <InputNumber id="mlbSb"  value={dataDialog.mlbSb} onValueChange={(e) => handleNumberChange(e, 'mlbSb')} minFractionDigits={2} maxFractionDigits={5} />
                                </div>
                            </div>
                            <div className="field col-3">
                                <div className="flex flex-column">
                                    <label htmlFor="mlbCL">CL</label>
                                    {/* <InputText id="mlbCod" value={dataDialog.mlbSa} onChange={(e) => handleInputChange(e, 'mlbSa')} /> */}
                                    <InputNumber id="mlbCL"  value={dataDialog.mlbCL} onValueChange={(e) => handleNumberChange(e, 'mlbCL')} minFractionDigits={2} maxFractionDigits={5} />
                                </div>
                            </div>
                        </div>
                    </Dialog>


                </div>
            </div>
        </div>
    );
};

export default MiniLabParams;
