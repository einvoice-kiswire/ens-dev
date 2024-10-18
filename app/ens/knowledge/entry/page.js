/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation'
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { ToggleButton } from 'primereact/togglebutton';
import { Dropdown } from 'primereact/dropdown';
import { SplitButton } from 'primereact/splitbutton';


import { isLogin, LoginInfo, pdfUpload, uploadSearch } from "../../../../api/ens"

const DataEmpty = {
    "fileID": "X",
    "GroupId": null,
    "fileGroup": null,
    "fileYYMM": null,
    "fileYYMMDD": null,
    "fileName": null,
    "fileUploadName": null,
    "fileInfo": null,
    "InputDate": null,
    "InputUser": null,
    "UpdateDate": null,
    "UpdateUser": null,
    "CancelYN": null
}

const KnowledgeEntry = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [resultDT, setResultDT] = useState([])
    const [selectedRow, setSelectedRow] = useState()

    const [YYMM, setYYMM] = useState(null);
    const [YYMMDD, setYYMMDD] = useState(null);

    const [fileGroup, setFileGroup] = useState(null);
    const [fileName, setFileName] = useState('');

    const [file, setFile] = useState(null);
    const [error, setError] = useState(false)
    const [showUploadDialog, setShowUploadDialog] = useState(false)
    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [submitted, setSubmitted] = useState(false)


    const fileGroupList = [
        { name: 'All', code: 'ALL' },
        { name: 'Air', code: 'AIR' },
        { name: 'IETS (WWT)', code: 'IETS' },
        { name: 'Schedule Waste', code: 'WASTE' }
    ];

    const fileGroupInsert = [
        { name: 'Air', code: 'AIR' },
        { name: 'IETS (WWT)', code: 'IETS' },
        { name: 'Schedule Waste', code: 'WASTE' }
    ];

    const actionList = [
        {
            label: 'Clear',
            icon: 'pi pi-refresh',
            command: () => {
                actionClear()
                // toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated' });
            }
        },
    ]

    function getValueOrDefault(data, key, defaultValue) {
        return data['0']?.[key] || data[key] || defaultValue;
    }

    const handleLoad = () => {
        const _userLogin = isLogin();

        if (!_userLogin) {
            router.push('/ens/login');
            return
        }

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const currentDay = currentDate.getDate().toString().padStart(2, '0');

        const formattedYYMM = `${currentYear}${currentMonth}`;
        const formattedYYMMDD = `${currentYear}${currentMonth}${currentDay}`;
        setYYMM(formattedYYMM)
        setYYMMDD(formattedYYMMDD)

    }

    const handleFileUploadChange = (e) => {
        let _dataDialogTemp = { ...dataDialog }
        // console.log ('_dataDialogTemp : load', _dataDialogTemp)

        const _fileName = e.name
        const _fileInfo = JSON.stringify({
            "file": e.name,
            "size": e.size,
            "lastModified": e.lastModified,
            "lastModifiedDate": e.lastModifiedDate

        })
        // console.log(_fileName)
        // console.log(_fileInfo)

        _dataDialogTemp[`fileName`] = _fileName
        _dataDialogTemp[`fileInfo`] = _fileInfo

        // console.log ('_dataDialogTemp : update', _dataDialogTemp)

        setDataDialog(_dataDialogTemp)
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        handleFileUploadChange(selectedFile)

        // Clear the input field on change
        if (error) {
            setError(null);
        }
    };

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value.trim()) || ''
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }

    const handleDropChange = (e, name) => {
        const val = e.value
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }

    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            const _result = await uploadSearch(params)
            console.log('handleFetchData', _result)
            setResultDT(_result.data)

        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const actionUpload = () => {

        const _GroupID = LoginInfo('ENS_GroupID')
        const _UserID = LoginInfo('ENS_UserID')
        // ddd
        DataEmpty.fileID = 'X'
        DataEmpty.GroupId = _GroupID
        DataEmpty.fileYYMM = YYMM
        DataEmpty.fileYYMMDD = YYMMDD
        DataEmpty.InputUser = _UserID

        // console.log('dataempty', DataEmpty)
        setDataDialog(DataEmpty)
        setSubmitted(false)
        setShowUploadDialog(true)


    }
    const actionCloseUploadDialog = () => {

        setShowUploadDialog(false)
        setDataDialog(DataEmpty)
    }

    const actionSaveUploadDialog = async () => {
        setSubmitted(true);
        const _GroupID = LoginInfo('ENS_GroupID')
        const _UserID = LoginInfo('ENS_UserID')

        let _fileYYMMDD = getValueOrDefault(dataDialog, 'fileYYMMDD', '')
        let _fileGroup = getValueOrDefault(dataDialog, 'fileGroup', '')
        let _fileName = getValueOrDefault(dataDialog, 'fileName', '')

        let _fileGroupOK = JSON.stringify(_fileGroup)

        console.log('actionSaveUploadDialog', dataDialog)

        if (_fileYYMMDD === '' || _fileGroup === '' || _fileName === '') {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Complete the form ', life: 3000 });
            return
        } else {
            // console.log("filegroupok", _fileGroupOK)
            try {

                if (!file) {
                    toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Please select file to upload', life: 3000 });
                    return
                }

                if (file) {
                    const result = await pdfUpload(file);
                    console.log ('result', result)
                }


            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: error.message, life: 3000 });
                return
            }

            // 
            //     const result = await pdfUpload(file);

            //     if (result.success) {

            //     } else {
            //         toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Upload file errors. Please try again', life: 3000 });
            //         return
            //     }

            // } catch (error) {
            //     toast.current.show({ severity: 'error', summary: 'Warning', detail: error.message, life: 3000 });
            //     return
            // }

        }

    }

    const actionSearch = () => {
        const _fileGroup = fileGroup
        const _fileName = fileName
        let fileGroupSearch = ''

        if (_fileGroup === null || _fileGroup.code === "ALL") {
            fileGroupSearch = ''
        } else {
            fileGroupSearch = _fileGroup.code
        }

        const _params = {
            "fileGroup": fileGroupSearch,
            "fileName": _fileName
        }

        // console.log ('_params', _params)
        handleFetchData(_params)
    }

    const actionClear = () => {
        // ddd
        setFileGroup(null)
        setFileName('')

    }

    const dialogUploadFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined severity="secondary" onClick={actionCloseUploadDialog} />
            <Button label="Upload" icon="pi pi-check" severity="primary" onClick={actionSaveUploadDialog} />
            {/* <Button label="Upload" onClick={actionHandleUpload} /> */}
            {/* <Button label="Clear" onClick={actionClearUpload} />  */}
        </React.Fragment>
    );

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>Knowledge Centre (Upload File)</h5>
                    {/* ################# SEARCH UI   ################# */}
                    <div className='col-12 justify-content-left '>
                        <div className="p-fluid formgrid grid">
                            <div className="field col-4 md:col-3 ">
                                <Dropdown value={fileGroup} onChange={(e) => setFileGroup(e.value)} options={fileGroupList} optionLabel="name" placeholder="Select File Group" />
                            </div>
                            <div className="field col-8 md:col-5 ">
                                <InputText value={fileName} onChange={(e) => setFileName(e.target.value)} />
                            </div>
                            <div className="field col-6 md:col-2 ">
                                {/* <Button label="Search" icon="pi pi-upload" severity="success" raised /> */}
                                <SplitButton label="Search" icon="pi pi-search" onClick={actionSearch} model={actionList} raised />
                            </div>
                            <div className="field col-6 md:col-2 ">
                                <Button label="Upload" icon="pi pi-upload" onClick={actionUpload} severity="secondary" outlined />
                            </div>
                        </div>
                    </div>
                    {/* ################# DATA TABLE UI   ################# */}
                    {/* ################# UPLOAD UI   ################# */}
                    <Dialog header="Upload Files" visible={showUploadDialog} onHide={actionCloseUploadDialog} footer={dialogUploadFooter} modal maximizable style={{ width: '60vw' }} breakpoints={{ '960px': '60vw', '641px': '100vw' }}>
                        <div className="p-fluid">
                            <div className="field grid">
                                <label htmlFor="name3" className="col-12 mb-2 md:col-2 md:mb-0">Date:</label>
                                <div className="col-12 md:col-10">
                                    <InputMask id="fileYYMM" mask="9999/99/99" placeholder="yyyy/mm/dd" value={dataDialog.fileYYMMDD} required className={classNames({ 'p-invalid': !dataDialog.fileYYMMDD || dataDialog.fileYYMMDD.length < 8 })} onChange={(e) => handleInputChange(e, 'fileYYMMDD')} />
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="fileGroup" className="col-12 mb-2 md:col-2 md:mb-0">File Group</label>
                                <div className="col-12 md:col-10">
                                    <Dropdown id="fileGroup" value={dataDialog.fileGroup} onChange={(e) => handleDropChange(e, 'fileGroup')} required className={classNames({ 'p-invalid': !dataDialog.fileGroup })} options={fileGroupInsert} optionLabel="name" placeholder="Select File Group" />
                                </div>
                            </div>
                            <div className="field grid">
                                <label htmlFor="filename" className="col-12 mb-2 md:col-2 md:mb-0">Email</label>
                                <div className="col-12 md:col-10">
                                    <input id="filename" name="filename" type="file" accept="application/pdf" onChange={handleFileChange} className={classNames({ 'p-invalid': !dataDialog.fileName }, 'p-inputtext', 'p-component')} />
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeEntry;
