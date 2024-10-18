/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
// eslint-disable-next-line react-hooks/rules-of-hooks
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
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { InputMask } from 'primereact/inputmask';
import { TabView, TabPanel } from 'primereact/tabview';


import { useLocalStoragePage } from '../../../../api/hook/useLocalStoragePage';
import { isLogin, LoginInfo, ENSAccounts, ENSCheck, getENSAccounts } from '../../../../api/ens';
import { ENSAccountsSave, ENSAccountsEdit, ENSAccountsdelete } from '../../../../api/ens'


const DataEmpty = {
    "ENSUserID": "X",
    "UserID": '',
    "UserName": '',
    "isAdmin": '',
    "InsertDate": null,
    "UserInsert": null,
    "UpdateDate": null,
    "UserUpdate": null,
    "UseYN": ''
}

const level = [
    { name: '', code: '' },
    { name: 'Admin Team', code: '1' },
    { name: 'User Team', code: '2' },
    // { name: 'GUEST TEAM', code: '0' }

]
const yesno = [
    { name: '', code: '' },
    { name: 'Yes', code: 'Y' },
    { name: 'No', code: 'N' },
    // { name: 'GUEST TEAM', code: '0' }
]

const factory = [
    { name: 'KSB', code: '40' },
    { name: 'KCSB', code: '41' },
    { name: 'KNSB', code: '42' },
    // { name: 'GUEST TEAM', code: '0' }

]

function getValueOrDefault(data, key, defaultValue) {
    return data['0']?.[key] || data[key] || defaultValue;
}

const tblEnsUserPage = () => {

    //  ##################### Declaration variable ###############
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const [resultDT, setResultDT] = useState([])
    const [selectedRow, setSelectedRow] = useState()

    const [YYMM, setYYMM] = useState()

    const [cbFactory, setCbFactory] = useState(factory);
    const [cbLevel, setCbLevel] = useState(level);
    const [cbYesNo, setCbYesNo] = useState(yesno);

    const [filterLevel, setFilterLevel] = useState([]);
    const [bevel, setLevel] = useState([]);
    const [ensUser, setEnsUser] = useState(null);

    let searchField = {
        UserID: '',
        UserName: '',
        Level: '',
        YesNo: ''
    }

    const [formSearch, setFormSearch] = useState(searchField);

    const [tabActiveIndex, setTabActiveIndex] = useState(0);
    const [dataAction, setDataAction] = useState('')
    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [dataDialogLevel, setDataDialogLevel] = useState([]);
    const [dataDialogYesNo, setDataDialogYesNo] = useState([]);
    const [dataDialogFactory, setDataDialogFactory] = useState({ name: 'KSB', code: '40' });

    const UserIDRef = useRef(null);
    const UserIDLevel = useRef(null);
    const UserIDYesNo = useRef(null);

    const [submitted, setSubmitted] = useState(false)
    const [showDialog, setShowDialog] = useState(false)


    const searchLevel = (e) => {
        const filtered = [];
        const query = e.query;
        for (let i = 0; i < level.length; i++) {
            const search = level[i];
            if (search.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                filtered.push(search);
            }
        }
        setFilterLevel(filtered);
    };

    //  ##################### handle ###############
    const handleSearchInput = (e) => {
        const { id, value } = e.target;
        setFormSearch(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleKeyPress = (e) => {
        // console.log('handleKeyPress', e);
        if (e.key === 'Enter') {
            actionSearch()
        }
    }

    const handleSearchDropdown = (e) => {
        const { id, value } = e.target;
        setFormSearch(prevState => ({
            ...prevState,
            [id]: value
        }));
        // actionSearch()
    };

    const handledataDialogLevel = (e) => {
        const { id, value } = e.target;
        setDataDialogLevel(value)

        setDataDialog((prevState) => ({
            ...prevState,
            isAdmin: value.code
        }));
    };

    const handledataDialogYesNo = (e) => {
        const { id, value } = e.target;
        setDataDialogYesNo(value)

        setDataDialog((prevState) => ({
            ...prevState,
            UseYN: value.code
        }));
    };

    const handledataDialogFactory = (e) => {
        const { id, value } = e.target;
        setDataDialogFactory(value)
    };

    const handleFormInput = (e) => {
        const { id, value } = e.target;
        setDataDialog(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleFormKeyPress = (e) => {
        // console.log('handleKeyPress', e);
        if (e.key === 'Enter') {
            handleFormRegister()
        }
    }
    const handleFormBlur = () => {
        handleFormRegister()
    };

    const handleFormDropDown = (e) => {
        // console.log('handleFormDropDown', e)

        if (e.isAdmin === 1) {
            setDataDialogLevel({ name: 'Admin Team', code: '1' });
        } else if (e.isAdmin === 2) {
            setDataDialogLevel({ name: 'User Team', code: '2' });
        } else {
            setDataDialogLevel([]);
        }

        if (e.UseYN === 'Y') {
            setDataDialogYesNo({ name: 'Yes', code: 'Y' });
        } else if (e.UseYN === 'N') {
            setDataDialogYesNo({ name: 'No', code: 'N' });
        } else {
            setDataDialogYesNo([]); // Clear the state if isAdmin doesn't match any condition
        }
    }

    const handleLoad = (e) => {
        const _userLogin = isLogin();
        // console.log('handleLoad: _userLogin',_userLogin)
        if (!_userLogin) {
            router.push('/ens/login');
            return
        }

        const storedData = localStorage.getItem('ENSUser');

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setEnsUser(parsedData);

            actionSearch();

        } else {
            router.push('/ens/login');
            return
        }
    }

    const handleFetchData = async (params) => {
        setLoading(true)
        // console.log('handleFetchData', params)

        try {
            const _result = await getENSAccounts(params)

            // console.log('_result', _result)
            setResultDT(_result.data)
            setTabActiveIndex(0)
        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const handleUserAction = (params, action) => {
        // console.log('handleUserAction : ', params)

        let _params = JSON.parse(params)


        if (_params.ENS_isAdmin == '1' && _params.ENS_UseYN == 'Y') {
            if (action === 'new') {
                return true
            }
            if (action === 'edit') {
                return true
            }
            if (action === 'delete') {
                return true
            }
            if (action === 'csv') {
                return true
            }

        } else if (_params.ENS_isAdmin == '2' && _params.ENS_UseYN == 'Y') {

            if (action === 'new') {
                return false
            }
            if (action === 'edit') {
                return false
            }
            if (action === 'delete') {
                return false
            }
            if (action === 'csv') {
                return true
            }
        } else {
            return false
        }
    }

    const handleFormRegister = async () => {
        // Retrieve ENSUserID and UserID from dataDialog, with default values
        let _ENSUserID = getValueOrDefault(dataDialog, 'ENSUserID', 'X');
        let _UserID = getValueOrDefault(dataDialog, 'UserID', '');

        let _tempData = '[]'
        let _tempUsername = ''
        let _tempAccount = '[]'


        if (dataAction === 'new') {
            // Check if UserID is provided and ENSUserID is 'X'
            if (_UserID !== '' && _ENSUserID === 'X') {
                let _factory = dataDialogFactory;

                // Perform asynchronous checks
                let _check1 = await ENSAccounts(_UserID);
                let _check2 = await ENSCheck(_UserID, _factory.code);

                _tempData = _check2
                _tempAccount = _check1

                // If no data is returned from the second check, clear the UserName field
                if (_tempData.data.length === 0) {
                    toast.current.show({ severity: 'info', summary: 'Warning', detail: 'User ID not valid. Please try again', life: 3000 });
                    UserIDRef.current.focus();

                    _tempUsername = ''
                    setDataDialog((prevState) => ({
                        ...prevState,
                        UserName: _tempUsername
                    }));
                } else {
                    if (_tempAccount.data.length === 0) {
                        _tempUsername = _tempData.data[0].UserName

                        UserIDLevel.current.focus();

                        setDataDialog((prevState) => ({
                            ...prevState,
                            UserName: _tempUsername
                        }));
                    } else {
                        toast.current.show({ severity: 'info', summary: 'Warning', detail: 'User ID already in system. Please try again', life: 3000 });
                        UserIDRef.current.focus();

                        _tempUsername = ''
                        setDataDialog((prevState) => ({
                            ...prevState,
                            UserName: _tempUsername
                        }));

                    }

                }
            } else {
                // Show a warning message if UserID is not provided
                toast.current.show({ severity: 'info', summary: 'Warning', detail: 'User ID is required. Please try again', life: 3000 });
                // UserIDRef.current.focus();

                _tempUsername = ''
                setDataDialog((prevState) => ({
                    ...prevState,
                    UserName: _tempUsername
                }));
            }
        }
    }

    //  ##################### action search ###############
    const actionSearch = () => {
        // console.log('actionsearch')
        // console.log('formSearch', formSearch)

        const _paramsDT = {
            "UserID": LoginInfo('ENS_UserID'),
            "sUserID": formSearch.UserID,
            "sUserName": formSearch.UserName,
            "sLevel": formSearch.Level,
            "sYesNo": formSearch.YesNo

        }
        handleFetchData(_paramsDT)

        // console.log('actionSearch', _paramsDT)

    }

    //  ##################### action save & edit ###############
    const actionSaveDialog = async () => {
        setSubmitted(true);

        let _resultDT = [...resultDT]
        let _ENSUserID = getValueOrDefault(dataDialog, 'ENSUserID', 'X')
        let _UserID = getValueOrDefault(dataDialog, 'UserID', '')
        let _UserName = getValueOrDefault(dataDialog, 'UserName', '')
        let _isAdmin = getValueOrDefault(dataDialog, 'isAdmin', '')
        let _UseYN = getValueOrDefault(dataDialog, 'UseYN', '')

        if (_UserID != '' && _UserName != '' && _isAdmin != '' && _UseYN != '') {
            setLoading(true)
            // console.log('_ENSUserID', _ENSUserID)


            if (_ENSUserID == 'X') {
                // console.log('new accounts')
                let _params = {
                    UserID: LoginInfo('ENS_UserID'),
                    sUserID: _UserID,
                    sUserName: _UserName,
                    sLevel: _isAdmin,
                    sYesNo: _UseYN
                }
                const result = await ENSAccountsSave(LoginInfo('ENS_UserID'), _params)

                // console.log('result', result.status)

                if (result.status === '200' || result.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Save', detail: 'Information Saved', life: 2000 });

                    setTabActiveIndex(0)
                    setDataAction('')
                    actionSearch()

                } else {
                    toast.current.show({ severity: 'error', summary: 'Save', detail: 'Try Again', life: 2000 });
                }


            } else {
                // console.log('update accounts')
                let _params = {
                    UserID: LoginInfo('ENS_UserID'),
                    sUserID: _UserID,
                    sUserName: _UserName,
                    sLevel: _isAdmin,
                    sYesNo: _UseYN
                }

                const result = await ENSAccountsEdit(LoginInfo('ENS_UserID'), _params)

                if (result.status === '200' || result.status === 200) {
                    toast.current.show({ severity: 'success', summary: 'Edit', detail: 'Information Saved', life: 2000 });

                    setTabActiveIndex(0)
                    setDataAction('')
                    actionSearch()

                } else {
                    toast.current.show({ severity: 'error', summary: 'Edit', detail: 'Try Again', life: 2000 });
                }

            }
            setLoading(false)
        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Information not complete', life: 2000 });
        }

    }

    //  ##################### action delete ###############
    const actionDeleteDialog = async () => {
        let _resultDT = [...resultDT]
        let _ENSUserID = getValueOrDefault(dataDialog, 'ENSUserID', 'X')

        if (_ENSUserID == 'X') {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Select account to delete first', life: 2000 });
        } else {
            // console.log('delete', _ENSUserID).
            setLoading(true)

            let _params = {
                UserID: LoginInfo('ENS_UserID'),
                sUserID: _ENSUserID
            }

            const result = await ENSAccountsdelete(_params)

            if (result.status === '200' || result.status === 200) {
                toast.current.show({ severity: 'info', summary: 'Delete', detail: 'Information Deleted', life: 2000 });
                setTabActiveIndex(0)
                setDataAction('')
                actionSearch()
            } else {
                toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Try Again', life: 2000 });
            }
            setLoading(false)
        }
    }

    const actionCloseDialog = () => {
        setTabActiveIndex(0)
        setDataAction('')
        // actionSearch()
    }

    const actionNew = () => {

        let _UserAction = handleUserAction(localStorage.getItem('ENSUser'), 'new')

        if (_UserAction === true) {
            setDataDialog(DataEmpty)
            handleFormDropDown(DataEmpty)
            setTabActiveIndex(1)

            setDataAction('new')
        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Access Denied', life: 3000 });
        }

    }

    const actionEdit = (rowData) => {
        let _UserAction = handleUserAction(localStorage.getItem('ENSUser'), 'edit')

        if (_UserAction === true) {

            // console.log('actionEdit', rowData)
            setDataDialog(rowData)
            handleFormDropDown(rowData)
            setTabActiveIndex(1)

            setDataAction('edit')
        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Access Denied', life: 3000 });
        }
    }

    const actionDelete = (rowData) => {
        let _UserAction = handleUserAction(localStorage.getItem('ENSUser'), 'delete')

        if (_UserAction === true) {
            setDataDialog(rowData)
            handleFormDropDown(rowData)

            setTabActiveIndex(1)
            setDataAction('delete')

        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Access Denied', life: 3000 });
        }
    }

    const actionExportCSV = () => {
        let _UserAction = handleUserAction(localStorage.getItem('ENSUser'), 'csv')

        if (_UserAction === true) {
            setTabActiveIndex(0)
            dt.current?.exportCSV();

        } else {
            toast.current.show({ severity: 'error', summary: 'Warning', detail: 'Access Denied', life: 3000 });
        }
    }

    const tableactionRowButton = (rowData) => {
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
                <Column header="UserID"></Column>
                <Column header="UserName"></Column>
                <Column header="isAdmin"></Column>
                <Column header="UpdateDate"></Column>

                {/* <Column header="Date" field="mlbDate" rowSpan={2} colSpan={1} sortable /> */}
                {/* <Column header="Paramameter (mg/L)" colSpan={7} className="text-center" /> */}
                <Column header="Action..." rowSpan={1} headerStyle={{ width: '15px' }}></Column>
            </Row>

            {/* <Row>
                <Column header="COD"></Column>
                <Column header="Pb"></Column>
                <Column header="Cu"></Column>
                <Column header="Mn"></Column>
                <Column header="Zn"></Column>
                <Column header="Boron"></Column>
                <Column header="Iron"></Column>
            </Row> */}
        </ColumnGroup>
    );

    const dialogForm = (
        <React.Fragment>
            <div className="mt-2" >
                <Button label="Cancel" icon="pi pi-times" outlined severity="secondary" onClick={actionCloseDialog} loading={loading} />
                {dataAction === 'new' || dataAction === 'edit' ? (
                    <Button label="Save" icon="pi pi-check" severity="primary" onClick={actionSaveDialog} loading={loading} disabled={!dataDialog.UserID || !dataDialog.UserName || !dataDialog.isAdmin || !dataDialog.UseYN} />
                ) : (
                    <Button label="Delete" icon="pi pi-times" severity="danger" onClick={actionDeleteDialog} />
                )}
            </div>
        </React.Fragment>
    );

    const colDate = (rowData, rowColumn) => {
        const date = new Date(rowData[rowColumn]);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JavaScript
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    const colAccess = (rowData) =>{
        const _access = rowData.isAdmin 

        if (_access === '1' || _access === 1){
            return "Admin Team"
        } else {
            return "User Team"
        }
    }


    useEffect(() => {
        handleLoad()
    }, []);

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    {/* ################### TITLE & BUTTON ################## */}
                    <div className="grid">
                        <div className='col-6 text-left'>
                            <h4>ENS User Accounts</h4>
                        </div>
                        <div className='col-6 text-right'>
                            <Button label="New" icon="pi pi-plus" onClick={actionNew} severity="success" className="mr-2" raised />
                            <Button label="Export" icon="pi pi-file-export" severity="info" onClick={actionExportCSV}></Button>
                        </div>
                    </div>
                    {/* ################### UI FOR SEARCH FROM ################## */}
                    <div className="grid p-fluid mt-4 " >
                        <div className="field ">
                            <span className="p-float-label">
                                <InputText type="text" id="UserID" value={formSearch.UserID} onChange={handleSearchInput} onKeyUp={handleKeyPress} />
                                <label htmlFor="UserID">User ID</label>
                            </span>
                        </div>
                        <div className="field ">
                            <span className="p-float-label">
                                <InputText type="text" id="UserName" value={formSearch.UserName} onChange={handleSearchInput} onKeyUp={handleKeyPress} />
                                <label htmlFor="UserName">Username</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="Level" options={cbLevel} value={formSearch.Level} onChange={handleSearchDropdown} optionLabel="name"></Dropdown>
                                <label htmlFor="Level">Level</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Dropdown id="YesNo" options={cbYesNo} value={formSearch.YesNo} onChange={handleSearchDropdown} optionLabel="name"></Dropdown>
                                <label htmlFor="YesNo">Yes/No</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Button label="Search" outlined onClick={actionSearch} loading={loading} />
                            </span>
                        </div>
                    </div>
                    <TabView activeIndex={tabActiveIndex} onTabChange={(e) => setTabActiveIndex(e.index)}>
                        <TabPanel header="List" >
                            {/* ################### UI FOR DATA TABLE ################## */}
                            <DataTable
                                loading={loading}
                                ref={dt}
                                dataKey="UserID"
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
                                className="datatable-responsive mt-0"
                                tableStyle={{ minWidth: '50rem' }}
                            >
                                <Column selectionMode="multiple" exportable={false}></Column>
                                <Column header="UserID" field="UserID" sortable></Column>
                                <Column header="UserName" field="UserName" sortable></Column>
                                <Column body={(rowData) => colAccess(rowData)}  header="Access" field="isAdmin" sortable></Column>
                                <Column body={(rowData) => colDate(rowData, 'InsertDate')} header="Insert Date" field="InsertDate" sortable></Column>
                                <Column body={(rowData) => colDate(rowData, 'UpdateDate')} header="Update Date" field="UpdateDate" sortable></Column>
                                <Column header="Y/N" field="UseYN" sortable></Column>
                                {/* <Column body={UserID} header="UserID"></Column> */}
                                <Column body={tableactionRowButton} exportable={false}></Column>
                            </DataTable>


                        </TabPanel>
                        <TabPanel header="Info" disabled={tabActiveIndex === 0}>
                            {/* ################### FORM FOR DATA TABLE ################## */}
                            <div className="mt-0">

                                <div className="grid p-fluid mt-3" >
                                    <div className="field  col-12 md:col-2">
                                        <span className="p-float-label">
                                            <Dropdown id="dataDialogFactory" options={cbFactory} value={dataDialogFactory} onChange={handledataDialogFactory} disabled={classNames({ true: dataAction === 'edit' || dataAction === 'delete' })} optionLabel="name" ></Dropdown>
                                            <label htmlFor="dataDialogFactory">Factory</label>
                                        </span>
                                    </div>
                                    <div className="field  col-12 md:col-2">
                                        <span className="p-float-label">
                                            <InputText type="text" id="UserID" ref={UserIDRef} value={dataDialog.UserID} onKeyUp={handleFormKeyPress} onBlur={handleFormBlur} onChange={handleFormInput} disabled={classNames({ true: dataAction === 'edit' || dataAction === 'delete' })} required className={classNames({ 'p-invalid': !dataDialog.UserID })} />
                                            <label htmlFor="UserID">User ID</label>
                                        </span>
                                    </div>
                                    <div className="field  col-12 md:col-4">
                                        <span className="p-float-label">
                                            <InputText type="text" id="UserName" value={dataDialog.UserName} onChange={handleFormInput} disabled={classNames({ true: dataAction === 'edit' || dataAction === 'delete' || dataAction === 'new' })} required className={classNames({ 'p-invalid': !dataDialog.UserName })} />
                                            <label htmlFor="UserName">Name</label>
                                        </span>
                                    </div>
                                    <div className="field  col-12 md:col-2">
                                        <span className="p-float-label">
                                            <InputText type="hidden" id="isAdmin" value={dataDialog.isAdmin} />
                                            <Dropdown id="dataDialogLevel" ref={UserIDLevel} options={cbLevel} value={dataDialogLevel} onChange={handledataDialogLevel} disabled={classNames({ true: dataAction === 'delete' })} optionLabel="name" required className={classNames({ 'p-invalid': !dataDialog.isAdmin })} ></Dropdown>
                                            <label htmlFor="isAdmin">Level</label>
                                        </span>
                                    </div>
                                    <div className="field  col-12 md:col-2">
                                        <span className="p-float-label">
                                            <InputText type="hidden" id="UseYN" value={dataDialog.UseYN} />
                                            <Dropdown id="dataDialogYesNo" ref={UserIDYesNo} options={cbYesNo} value={dataDialogYesNo} onChange={handledataDialogYesNo} disabled={classNames({ true: dataAction === 'delete' })} optionLabel="name" required className={classNames({ 'p-invalid': !dataDialog.UseYN })} ></Dropdown>
                                            <label htmlFor="UseYN">Yes/No</label>
                                        </span>
                                    </div>
                                </div>


                                {/* BOTTOM FORM*/}
                                <div className="grid">
                                    <div className='col-6 text-left'>
                                        {/* <strong>User Information</strong> */}
                                    </div>
                                    <div className='col-6 text-right'>
                                        {dialogForm}
                                    </div>
                                </div>
                            </div>


                        </TabPanel>
                    </TabView>






                </div>
            </div>
        </div>

    )


}
export default tblEnsUserPage;



