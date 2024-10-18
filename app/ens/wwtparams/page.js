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

import { isLogin, LoginInfo, wwtparamset, wwtparamset_editsave } from "../../../api/ens"

const DataEmpty = {
    "wwtType": "X",
    "wwtName": null,
    "wwtSa": null,
    "wwtSb": null
}

const WWTParams = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [resultDT, setResultDT] = useState([])
    const [selectedRow, setSelectedRow] = useState()

    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [submitted, setSubmitted] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [wwtName, setWwtName] = useState(null)

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
            "wwtType": "wwt"
        }
        // console.log ('param', _paramsDT)
        handleFetchData(_paramsDT)
    }

    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            const _result = await wwtparamset(params)
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
            const _result = await wwtparamset_editsave(params)
            // console.log('handleFetchData', _result)

            if (_result.status === 200) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Parameter Updated', life: 3000 });
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

    const handleNumberChange = (e, name) => {
        const val = e.value
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }

    const actionEdit = (rowData) => {
        // action here
        const _wwtType = rowData.wwtType
        const wwtTypeOK = _wwtType.substring(3);

        let wwtTypeALL = ''

        if (_wwtType === 'wwtAT1s') {
            wwtTypeALL = 'Adj Tank 1'
        } else if (_wwtType === 'wwtAT2s') {
            wwtTypeALL = 'Adj Tank 2'
        } else {
            wwtTypeALL = 'EMPTY'

        }

        setWwtName(wwtTypeALL)

        setDataDialog(rowData)
        setShowDialog(true)
    }

    const actionSaveDialog = () => {
        setSubmitted(true);

        let _wwtType = getValueOrDefault(dataDialog, 'wwtType', 'X')
        let _wwtSa = getValueOrDefault(dataDialog, 'wwtSa', 0)
        let _wwtSb = getValueOrDefault(dataDialog, 'wwtSb', 0)


        if (_wwtType === 'X' || _wwtSa === 0 || _wwtSb === 0) {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Sa or Sb is NULL', life: 3000 });
        } else {

            const _params = {
                "wwtType": _wwtType,
                "wwtSa": _wwtSa,
                "wwtSb": _wwtSb
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
        const _wwtType = rowData.wwtType
        const wwtTypeOK = _wwtType.substring(3);
        let wwtTypeALL = ''

        if (_wwtType === 'wwtAT1s') {
            wwtTypeALL = 'Adj Tank 1'
        } else if (_wwtType === 'wwtAT2s') {
            wwtTypeALL = 'Adj Tank 2'
        } else {
            wwtTypeALL = 'EMPTY'

        }

        return (<div>{wwtTypeALL}</div>)
    }


    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>WWT Paramameter</h5>
                    <div className="mt-2">
                        <DataTable
                            loading={loading}
                            ref={dt}
                            dataKey="wwtType"
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
                            <Column body={colmlbType} header="Monitor Type" field="wwtType" sortable></Column>
                            <Column header="Sa (mg/L)" field="wwtSa"></Column>
                            <Column header="Sb (mg/L)" field="wwtSb"></Column>
                            <Column body={actionRowButton} exportable={false} style={{ width: '10px' }}></Column>
                        </DataTable>
                    </div>
                    {/* ################# RECORD DIALOG ################# */}
                    <Dialog header="Parameter : Mini Lab " visible={showDialog} onHide={actionCloseDialog} footer={dialogFooter} modal maximizable style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div className="formgrid grid">
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtName">Monitor Type</label>
                                    <InputText id="wwtName" value={wwtName} disabled />
                                </div>
                            </div>
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtSa">Sa</label>
                                    {/* <InputText id="mlbCod" value={dataDialog.mlbSa} onChange={(e) => handleInputChange(e, 'mlbSa')} /> */}
                                    <InputNumber id="wwtSa" value={dataDialog.wwtSa} onValueChange={(e) => handleNumberChange(e, 'wwtSa')} minFractionDigits={2} maxFractionDigits={5} />
                                </div>
                            </div>
                            <div className="field col-4">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtSb">Sb</label>
                                    {/* <InputText id="mlbCod" value={dataDialog.mlbSa} onChange={(e) => handleInputChange(e, 'mlbSa')} /> */}
                                    <InputNumber id="wwtSb" value={dataDialog.wwtSb} onValueChange={(e) => handleNumberChange(e, 'wwtSb')} minFractionDigits={2} maxFractionDigits={5} />
                                </div>
                            </div>

                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default WWTParams;
