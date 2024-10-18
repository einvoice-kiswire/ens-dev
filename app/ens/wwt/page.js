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
import { InputNumber } from 'primereact/inputnumber';
import { TabView, TabPanel } from 'primereact/tabview';
import { AutoComplete } from "primereact/autocomplete";


// IMPORT FROM SQL
import { isLogin, LoginInfo, wwtparamset, wwt, wwt_newsave, wwt_editsave, wwt_deletesave } from "../../../api/ens"

const DataEmpty = {
    "wwtID": "X",
    "GroupId": null,
    "wwtDate": null,
    "wwtTime": null,
    "wwtAT1p": null,
    "wwtAT1s": null,
    "wwtAT1sa": null,
    "wwtAT1sb": null,
    "wwtMTp": null,
    "wwtAT2p": null,
    "wwtAT2s": null,
    "wwtAT2sa": null,
    "wwtAT2sb": null,
    "wwtAT11p": null,
    "wwtT12p": null,
    "wwtCTp": null,
    "wwtFp": null,
    "wwtCColor": null,
    "wwtCFSize": null,
    "wwtCSpeed": null,
    "wwtFWColor": null,
    "wwtFRD1": null,
    "wwtFRD2": null,
    "wwtEQF1": null,
    "wwtEQF2": null,
    "wwtLIncoming": null,
    "wwtPUsage": null,
    "wwtSGen": null,
    "wwtSDis": null,
    "wwtSBal": null,
    "wwtRemark": null,
    "wwtDateTime": null,
    "wwtUser": null,
    "wwtInputUser": null,
    "wwtInputDate": null,
    "wwtUpdateUser": null,
    "wwtUpdateDate": null,
    "CancelYN": null

}

const CColorOption = [
    { name: 'Clear', code: 'Clear' },
    { name: 'Reddish', code: 'Reddish' },
    { name: 'Dark', code: 'Dark' }
];

const CFSizeOption = [
    { name: 'Small', code: 'Small' },
    { name: 'Medium', code: 'Medium' },
    { name: 'Big', code: 'Big' }
];
const CSpeedOption = [
    { name: 'Fast', code: 'Fast' },
    { name: 'Medium', code: 'Medium' },
    { name: 'Slow', code: 'Slow' }
];
const FWColorOption = [
    { name: 'Clear', code: 'Clear' },
    { name: 'Reddish', code: 'Reddish' },
    { name: 'Dark', code: 'Dark' }
];

const cGrey = { backgroundColor: 'var(--gray-100)' };
const cPink = { backgroundColor: 'var(--pink-100)' };
const cGreen = { backgroundColor: 'var(--green-100)' };
const cOrange = { backgroundColor: 'var(--orange-100)' };

const WWTPage = () => {
    //  ##################### Declaration variable ###############
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [wwtParameter, setWwtParameter] = useState([])
    const [resultDT, setResultDT] = useState([])
    const [YYMM, setYYMM] = useState()
    const [YYMMDD, setYYMMDD] = useState()
    const [selectedRow, setSelectedRow] = useState()

    const [dataDialog, setDataDialog] = useState(DataEmpty)
    const [submitted, setSubmitted] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [dataDeleteDialog, setDataDeleteDialog] = useState(DataEmpty)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [dateDelete, setDateDelete] = useState()

    const [itemCColor, setItemCColor] = useState([]);
    const [itemCFSize, setItemCFSize] = useState([]);
    const [itemCSpeed, setItemCSpeed] = useState([]);
    const [itemFWColor, setItemFWColor] = useState([]);

    const [enableBal, setEnableBal] = useState(false)
    const [itemStat, setItemStat] = useState([])



    function getValueOrDefault(data, key, defaultValue) {
        return data['0']?.[key] || data[key] || defaultValue;
    }

    const getValueAutoComplete = (item) => {
        if (typeof item === 'object' && item !== null && 'name' in item) {
            return item.name
        } else if (typeof item === 'string') {
            return item
        } else {
            return null
        }
    }

    const getWWTParameter = (type) => {
        const mlTypeObj = wwtParameter.find((item) => item.wwtType === type);
        return mlTypeObj ? { [`${type}Sa`]: mlTypeObj.wwtSa, [`${type}Sb`]: mlTypeObj.wwtSb } : {};
    }

    const assignWWTParameter = (paramName) => {
        const wwtParameter = getWWTParameter(`wwt${paramName}`)
        // console.log ('wwtParameter',wwtParameter)

        DataEmpty[`wwt${paramName}Sa`] = wwtParameter[`wwt${paramName}Sa`]
        DataEmpty[`wwt${paramName}Sb`] = wwtParameter[`wwt${paramName}Sb`]
    }

    const createSearchFunction = (options, setItems) => (event) => {
        let query = event.query;
        let filteredItems = options.filter(item =>
            item.name.toLowerCase().indexOf(query.toLowerCase()) === 0
        );
        setItems(filteredItems);
    };

    const searchCColor = createSearchFunction(CColorOption, setItemCColor);
    const searchCFSize = createSearchFunction(CFSizeOption, setItemCFSize);
    const searchCSpeed = createSearchFunction(CSpeedOption, setItemCSpeed);
    const searchFWColor = createSearchFunction(FWColorOption, setItemFWColor);

    const handleKeyPress = (e) => {
        // console.log('handleKeyPress', e);
        if (e.key === 'Enter') {
            actionSearch()
        }
    }

    const handleInputChange = (e, name) => {
        const val = (e.target && e.target.value.trim()) || ''
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)


        const enableday = _dataDialogTemp.wwtDate.slice(-2);
        if (enableday ==='01') {
            setEnableBal(true)
        } else {
            setEnableBal(false)
        }
    }

    const handleNumberChange = (e, name) => {
        const val = (e.value) || '0'
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }

    const handleAutoCompleteChange = (e, name) => {
        const val = (e.value) || ''
        let _dataDialogTemp = { ...dataDialog }
        _dataDialogTemp[`${name}`] = val
        setDataDialog(_dataDialogTemp)
    }

    const handleLoad = () => {
        const _userLogin = isLogin();
        // console.log('handleLoad: _userLogin', _userLogin)
        if (!_userLogin) {
            router.push('/ens/login');
            return
        }
        // ~~~ collect wwt parameter 
        handleParameter()

        // ~~~ check date 
        const _currentDate = new Date();
        const _currentYear = _currentDate.getFullYear();
        const _curentMonth = (_currentDate.getMonth() + 1).toString().padStart(2, '0');
        const _currentDay = _currentDate.getDate().toString().padStart(2, '0');
        // const _adjustMonth = '11'
        const formattedDate = `${_currentYear}${_curentMonth}`;
        const formattedDateYYMMDD = `${_currentYear}${_curentMonth}${_currentDay}`;

        setYYMM(formattedDate)
        setYYMMDD(formattedDateYYMMDD)
        // ~~~ fetch data for DT
        handleFetchData(formattedDate)
    }

    const handleParameter = async () => {
        const _params = {
            "wwtType": "wwt"
        }
        try {
            const _result = await wwtparamset(_params);
            // console.log('handleParameter', _result)
            setWwtParameter(_result.data)

        } catch (error) {
            console.error('handleParameter ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        }
    }

    const handleFetchData = async (todate) => {
        setLoading(true)

        try {
            const _paramsDT = {
                "InputUser": LoginInfo('ENS_UserID'),
                "GroupId": LoginInfo('ENS_GroupID'),
                "ToDate": todate
            }
            const _result = await wwt(_paramsDT)
            // console.log('handleFetchData', _result)
            setResultDT(_result.data)

            handleStatData(_result.data)

        } catch (error) {
            setResultDT([])
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const calculateStats = (data) => {
        const total = data.length;
        const totalsum = data.reduce((acc, value) => acc + value, 0);
        const average = totalsum / data.length;
        const minimum = Math.min(...data);
        const maximum = Math.max(...data);

        return { total, totalsum, average, minimum, maximum };
    };

    const handleStatData = (dataDT) => {

        const AT1 = []
        const MT = []
        const AT2 = []
        const AT11 = []
        const T12 = []
        const CT = []
        const F = []
        const FRD1 = []
        const FRD2 = []
        const EQF1 = []
        const EQF2 = []
        const Lincoming = []
        const PUsage = []
        const SGen = []
        const SDis = []
        const SBal = []

        dataDT.map(item => {
            const _wwtAT1p = item.wwtAT1p
            const _wwtAT1pOK = _wwtAT1p === null || _wwtAT1p === '' || _wwtAT1p === 'NA' ? 0 : parseFloat(_wwtAT1p);
            AT1.push(_wwtAT1pOK)

            const _wwtMTp = item.wwtMTp
            const _wwtMTpOK = _wwtMTp === null || _wwtMTp === '' || _wwtMTp === 'NA' ? 0 : parseFloat(_wwtMTp);
            MT.push(_wwtMTpOK)

            const _wwtAT2p = item.wwtAT2p
            const _wwtAT2pOK = _wwtAT2p === null || _wwtAT2p === '' || _wwtAT2p === 'NA' ? 0 : parseFloat(_wwtAT2p);
            AT2.push(_wwtAT2pOK)

            const _wwtAT11p = item.wwtAT11p
            const _wwtAT11pOK = _wwtAT11p === null || _wwtAT11p === '' || _wwtAT11p === 'NA' ? 0 : parseFloat(_wwtAT11p);
            AT11.push(_wwtAT11pOK)

            const _wwtT12p = item.wwtT12p
            const _wwtT12pOK = _wwtT12p === null || _wwtT12p === '' || _wwtT12p === 'NA' ? 0 : parseFloat(_wwtT12p);
            T12.push(_wwtT12pOK)

            const _wwtCTp = item.wwtCTp
            const _wwtCTpOK = _wwtCTp === null || _wwtCTp === '' || _wwtCTp === 'NA' ? 0 : parseFloat(_wwtCTp);
            CT.push(_wwtCTpOK)

            const _wwtFp = item.wwtFp
            const _wwtFpOK = _wwtFp === null || _wwtFp === '' || _wwtFp === 'NA' ? 0 : parseFloat(_wwtFp);
            F.push(_wwtFpOK)

            const _wwtFRD1 = item.wwtFRD1
            const __wwtFRD1OK = _wwtFRD1 === null || _wwtFRD1 === '' || _wwtFRD1 === 'NA' ? 0 : parseFloat(_wwtFRD1);
            FRD1.push(__wwtFRD1OK)

            const _wwtFRD2 = item.wwtFRD2
            const _wwtFRD2OK = _wwtFRD2 === null || _wwtFRD2 === '' || _wwtFRD2 === 'NA' ? 0 : parseFloat(_wwtFRD2);
            FRD2.push(_wwtFRD2OK)

            const _wwtEQF1 = item.wwtEQF1
            const _wwtEQF1OK = _wwtEQF1 === null || _wwtEQF1 === '' || _wwtEQF1 === 'NA' ? 0 : parseFloat(_wwtEQF1);
            EQF1.push(_wwtEQF1OK)

            const _wwtEQF2 = item.wwtEQF2
            const _wwtEQF2OK = _wwtEQF2 === null || _wwtEQF2 === '' || _wwtEQF2 === 'NA' ? 0 : parseFloat(_wwtEQF2);
            EQF2.push(_wwtEQF2OK)

            const _wwtLIncoming = item.wwtLIncoming
            const _wwtLIncomingOK = _wwtLIncoming === null || _wwtLIncoming === '' || _wwtLIncoming === 'NA' ? 0 : parseFloat(_wwtLIncoming);
            Lincoming.push(_wwtLIncomingOK)

            const _wwtPUsage = item.wwtPUsage
            const _wwtPUsageOK = _wwtPUsage === null || _wwtPUsage === '' || _wwtPUsage === 'NA' ? 0 : parseFloat(_wwtPUsage);
            PUsage.push(_wwtPUsageOK)

            const _wwtSGen = item.wwtSGen
            const _wwtSGenOK = _wwtSGen === null || _wwtSGen === '' || _wwtSGen === 'NA' ? 0 : parseFloat(_wwtSGen);
            SGen.push(_wwtSGenOK)

            const _wwtSDis = item.wwtSDis
            const _wwtSDisOK = _wwtSDis === null || _wwtSDis === '' || _wwtSDis === 'NA' ? 0 : parseFloat(_wwtSDis);
            SDis.push(_wwtSDisOK)

            const _wwtSBal = item.wwtSBal
            const _wwtSBalOK = _wwtSBal === null || _wwtSBal === '' || _wwtSBal === 'NA' ? 0 : parseFloat(_wwtSBal);
            SBal.push(_wwtSBalOK)
        })


        const statAT1 = calculateStats(AT1)
        const statMT = calculateStats(MT)
        const statAT2 = calculateStats(AT2)
        const statAT11 = calculateStats(AT11)
        const statT12 = calculateStats(T12)
        const statCT = calculateStats(CT)
        const statF = calculateStats(F)
        const statFRD1 = calculateStats(FRD1)
        const statFRD2 = calculateStats(FRD2)
        const statEQF1 = calculateStats(EQF1)
        const statEQF2 = calculateStats(EQF2)
        const statLIncoming = calculateStats(Lincoming)
        const statPUsage = calculateStats(PUsage)
        const statSGen = calculateStats(SGen)
        const statSDis = calculateStats(SDis)
        const statSBal = calculateStats(SBal)

        const AllStat = {
            statAT1,
            statMT,
            statAT2,
            statAT11,
            statT12,
            statCT,
            statF,
            statFRD1,
            statFRD2,
            statEQF1,
            statEQF2,
            statLIncoming,
            statPUsage,
            statSGen,
            statSDis,
            statSBal
        }

        // console.log('ALLSTat', AllStat)
        setItemStat(AllStat)
    }

    const handleEditSave = async (_params) => {
        // console.log('handleEditSave', _params)
        try {
            const result = await wwt_editsave(_params)
            // console.log (result)

            if (result.status === 200) {
                setShowDialog(false)
                setDataDialog(DataEmpty)
                actionSearch()
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Monitoring Updated', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { result }, life: 3000 });
            }

        } catch (error) {
            console.error('Error saving handleEditSave:', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        }


    }
    const handleNewsave = async (_params) => {
        // console.log('handleNewsave', _params)
        try {
            const result = await wwt_newsave(_params)
            // console.log (result)

            if (result.status === 200) {
                setShowDialog(false)
                setDataDialog(DataEmpty)
                actionSearch()
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Monitoring Saved', life: 3000 });
            } else {
                toast.current.show({ severity: 'error', summary: 'Warning', detail: { result }, life: 3000 });
            }

        } catch (error) {
            console.error('Error saving handleNewsave:', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        }

    }

    const handleDeleteSave = async (_params) => {
        // console.log('handleDeleteSave', _params)
        try {
            const result = await wwt_deletesave(_params)
            // console.log (result)

            if (result.status === 200) {
                setShowDeleteDialog(false)
                setDataDeleteDialog(DataEmpty)
                actionSearch()
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'WWT Monitoring Deleted', life: 3000 });
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
        handleFetchData(myDate)
    }
    const actionNew = () => {
        const currentDate = new Date();
        // Get hours, minutes, and seconds
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        const seconds = currentDate.getSeconds().toString().padStart(2, '0');
        const currentTime = `${hours}:${minutes}`;


        // ~~~~ Assign Paramater
        assignWWTParameter('AT1s')
        assignWWTParameter('AT2s')

        DataEmpty.wwtID = ''
        DataEmpty.wwtDate = YYMMDD
        DataEmpty.wwtTime = currentTime
        DataEmpty.GroupId = LoginInfo('ENS_GroupID')
        DataEmpty.wwtInputUser = LoginInfo('ENS_UserID')
        DataEmpty.wwtUser = LoginInfo('ENS_UserID')
        DataEmpty.wwtUpdateUser = LoginInfo('ENS_UserID')

        // DataEmpty.wwtCColor = 'Clear' testing je

        // console.log('actionNew > Data Empty', DataEmpty)

        // ~~~~ open dialog
        setDataDialog(DataEmpty)
        setSubmitted(false)
        setShowDialog(true)

        const enableday = YYMMDD.slice(-2);

        if (enableday ==='01') {
            setEnableBal(true)
        } else {
            setEnableBal(false)
        }
    }
    const actionEdit = (rowData) => {
        // console.log('actionEdit', rowData)
        setDataDialog(rowData)
        setShowDialog(true)

        const enableday = rowData.wwtDate.slice(-2);

        if (enableday ==='01') {
            setEnableBal(true)
        } else {
            setEnableBal(false)
        }
    }
    const actionDelete = (rowData) => {
        const _tempDate = rowData.wwtDate
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
        // console.log('datadialog', dataDialog)

        // *** collect dataDialog     
        let _GroupId = getValueOrDefault(dataDialog, 'GroupId', null)
        let _wwtInputUser = getValueOrDefault(dataDialog, 'wwtInputUser', null)

        let _wwtDate = getValueOrDefault(dataDialog, 'wwtDate', '')
        let _wwtTime = getValueOrDefault(dataDialog, 'wwtTime', '')

        let _wwtAT1p = getValueOrDefault(dataDialog, 'wwtAT1p', 0)
        let _wwtAT1sa = getValueOrDefault(dataDialog, 'wwtAT1sSa', 0)  // wwtAT1sSa
        let _wwtAT1sb = getValueOrDefault(dataDialog, 'wwtAT1sSb', 0)  // wwtAT1sSb
        let _wwtMTp = getValueOrDefault(dataDialog, 'wwtMTp', 0)
        let _wwtAT2p = getValueOrDefault(dataDialog, 'wwtAT2p', 0)
        let _wwtAT2sa = getValueOrDefault(dataDialog, 'wwtAT2sSa', 0)
        let _wwtAT2sb = getValueOrDefault(dataDialog, 'wwtAT2sSb', 0)
        let _wwtAT11p = getValueOrDefault(dataDialog, 'wwtAT11p', 0)
        let _wwtT12p = getValueOrDefault(dataDialog, 'wwtT12p', 0)
        let _wwtCTp = getValueOrDefault(dataDialog, 'wwtCTp', 0)
        let _wwtFp = getValueOrDefault(dataDialog, 'wwtFp', 0)


        let _wwtFRD2 = getValueOrDefault(dataDialog, 'wwtFRD2', 0)
        let _wwtFRD1 = isNaN(_wwtFRD2) ? 0 : _wwtFRD2 / 24
        let _wwtEQF2 = getValueOrDefault(dataDialog, 'wwtEQF2', 0)
        let _wwtEQF1 = isNaN(_wwtEQF2) ? 0 : _wwtEQF2 / 24

        let _wwtLIncoming = getValueOrDefault(dataDialog, 'wwtLIncoming', 0)
        let _wwtPUsage = getValueOrDefault(dataDialog, 'wwtPUsage', 0)
        let _wwtSGen = getValueOrDefault(dataDialog, 'wwtSGen', 0)
        let _wwtSDis = getValueOrDefault(dataDialog, 'wwtSDis', 0)
        let _wwtSBal = getValueOrDefault(dataDialog, 'wwtSBal', 0)

        const _wwtCColor = getValueAutoComplete(dataDialog.wwtCColor)
        const _wwtCFSize = getValueAutoComplete(dataDialog.wwtCFSize)
        const _wwtCSpeed = getValueAutoComplete(dataDialog.wwtCSpeed)
        const _wwtFWColor = getValueAutoComplete(dataDialog.wwtFWColor)

        // *** validate 
        if (_wwtDate != '' && _wwtTime != '') {
            const validDate = _wwtDate.replace(/\//g, '');

            if (validDate.length === 8) {
                if (dataDialog.wwtID) {
                    // EDIT DATA
                    let _userID = LoginInfo('ENS_UserID')
                    let _paramEDIT = {
                        "wwtID": dataDialog.wwtID,
                        "UserID": _userID,
                        "GroupId": _GroupId,
                        "wwtDate": validDate,
                        "wwtTime": _wwtTime,
                        "wwtAT1p": _wwtAT1p,
                        "wwtMTp": _wwtMTp,
                        "wwtAT2p": _wwtAT2p,
                        "wwtAT11p": _wwtAT11p,
                        "wwtT12p": _wwtT12p,
                        "wwtCTp": _wwtCTp,
                        "wwtFp": _wwtFp,
                        "wwtCColor": _wwtCColor,
                        "wwtCFSize": _wwtCFSize,
                        "wwtCSpeed": _wwtCSpeed,
                        "wwtFWColor": _wwtFWColor,
                        "wwtFRD1": _wwtFRD1,
                        "wwtFRD2": _wwtFRD2,
                        "wwtEQF1": _wwtEQF1,
                        "wwtEQF2": _wwtEQF2,
                        "wwtLIncoming": _wwtLIncoming,
                        "wwtPUsage": _wwtPUsage,
                        "wwtSGen": _wwtSGen,
                        "wwtSDis": _wwtSDis,
                        "wwtSBal": _wwtSBal
                    }
                    // console.log('edit', _paramEDIT)
                    handleEditSave(_paramEDIT);
                } else {
                    // ****   NEW DATA
                    let _paramsNEW = {
                        "GroupId": _GroupId,
                        "wwtDate": validDate,
                        "wwtTime": _wwtTime,
                        "wwtAT1p": _wwtAT1p,
                        "wwtAT1sa": _wwtAT1sa,
                        "wwtAT1sb": _wwtAT1sb,
                        "wwtMTp": _wwtMTp,
                        "wwtAT2p": _wwtAT2p,
                        "wwtAT2sa": _wwtAT2sa,
                        "wwtAT2sb": _wwtAT2sb,
                        "wwtAT11p": _wwtAT11p,
                        "wwtT12p": _wwtT12p,
                        "wwtCTp": _wwtCTp,
                        "wwtFp": _wwtFp,
                        "wwtCColor": _wwtCColor,
                        "wwtCFSize": _wwtCFSize,
                        "wwtCSpeed": _wwtCSpeed,
                        "wwtFWColor": _wwtFWColor,
                        "wwtFRD1": _wwtFRD1,
                        "wwtFRD2": _wwtFRD2,
                        "wwtEQF1": _wwtEQF1,
                        "wwtEQF2": _wwtEQF2,
                        "wwtLIncoming": _wwtLIncoming,
                        "wwtPUsage": _wwtPUsage,
                        "wwtSGen": _wwtSGen,
                        "wwtSDis": _wwtSDis,
                        "wwtSBal": _wwtSBal,
                        "wwtRemark": '',
                        "wwtInputUser": _wwtInputUser
                    }
                    // console.log('new', _paramsNEW)
                    handleNewsave(_paramsNEW)
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
        let _userID = LoginInfo('ENS_UserID')
        let _paramDEL = {
            "wwtID": dataDeleteDialog.wwtID,
            "UserID": _userID
        }

        // console.log ('actionDeleteDialog',_paramDEL)
        handleDeleteSave(_paramDEL)
    }
    const actionCloseDialog = () => {
        setShowDialog(false);
        setDataDialog(DataEmpty)
    };
    const actionCloseDeleteDialog = () => {
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
    const tableHeaderAPI = (
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
                        
                <Column footer="Sludge (Opening Bag/s) : " colSpan={19} className="text-right" style={cGrey} />
                <Column colSpan={2}  footer={itemStat && itemStat.statSBal ? itemStat.statSBal.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column className="text-center" />
            </Row>
            <Row>
                        
                <Column footer="Sludge (Current Bag/s) : " colSpan={19} className="text-right" style={cGrey} />
                <Column colSpan={2}  footer={itemStat && itemStat.statSBal ? itemStat.statSBal.totalsum + itemStat.statSGen.totalsum - itemStat.statSDis.totalsum || 0 : 0} className="text-center" />
                <Column className="text-center" />
            </Row>
            <Row>
                <Column footer="Total: " colSpan={2} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statAT1 ? itemStat.statAT1.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statMT ? itemStat.statMT.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT2 ? itemStat.statAT2.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT11 ? itemStat.statAT11.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statT12 ? itemStat.statT12.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statCT ? itemStat.statCT.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statF ? itemStat.statF.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer="Total: " colSpan={4} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statFRD1 ? itemStat.statFRD1.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statFRD2 ? itemStat.statFRD2.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF1 ? itemStat.statEQF1.totalsum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF2 ? itemStat.statEQF2.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statLIncoming ? itemStat.statLIncoming.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statPUsage ? itemStat.statPUsage.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSGen ? itemStat.statSGen.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSDis ? itemStat.statSDis.totalsum.toFixed(0) || 0 : 0} className="text-center" />
                <Column className="text-center" />

            </Row>
            <Row>
                <Column footer="Average: " colSpan={2} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statAT1 ? itemStat.statAT1.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statMT ? itemStat.statMT.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT2 ? itemStat.statAT2.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT11 ? itemStat.statAT11.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statT12 ? itemStat.statT12.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statCT ? itemStat.statCT.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statF ? itemStat.statF.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer="Average: " colSpan={4} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statFRD1 ? itemStat.statFRD1.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statFRD2 ? itemStat.statFRD2.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF1 ? itemStat.statEQF1.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF2 ? itemStat.statEQF2.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statLIncoming ? itemStat.statLIncoming.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statPUsage ? itemStat.statPUsage.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSGen ? itemStat.statSGen.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSDis ? itemStat.statSDis.average.toFixed(1) || 0 : 0} className="text-center" />
                <Column className="text-center" />
            </Row>
            <Row>
                <Column footer="Min: " colSpan={2} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statAT1 ? itemStat.statAT1.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statMT ? itemStat.statMT.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT2 ? itemStat.statAT2.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT11 ? itemStat.statAT11.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statT12 ? itemStat.statT12.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statCT ? itemStat.statCT.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statF ? itemStat.statF.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer="Min: " colSpan={4} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statFRD1 ? itemStat.statFRD1.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statFRD2 ? itemStat.statFRD2.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF1 ? itemStat.statEQF1.minimum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF2 ? itemStat.statEQF2.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statLIncoming ? itemStat.statLIncoming.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statPUsage ? itemStat.statPUsage.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSGen ? itemStat.statSGen.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSDis ? itemStat.statSDis.minimum.toFixed(0) || 0 : 0} className="text-center" />
                <Column className="text-center" />
            </Row>
            <Row>
                <Column footer="Max: " colSpan={2} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statAT1 ? itemStat.statAT1.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statMT ? itemStat.statMT.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT2 ? itemStat.statAT2.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statAT11 ? itemStat.statAT11.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statT12 ? itemStat.statT12.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statCT ? itemStat.statCT.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statF ? itemStat.statF.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer="Max: " colSpan={4} className="text-right" style={cGrey} />
                <Column footer={itemStat && itemStat.statFRD1 ? itemStat.statFRD1.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statFRD2 ? itemStat.statFRD2.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF1 ? itemStat.statEQF1.maximum.toFixed(1) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statEQF2 ? itemStat.statEQF2.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statLIncoming ? itemStat.statLIncoming.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statPUsage ? itemStat.statPUsage.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSGen ? itemStat.statSGen.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column footer={itemStat && itemStat.statSDis ? itemStat.statSDis.maximum.toFixed(0) || 0 : 0} className="text-center" />
                <Column className="text-center" />
            </Row>
            {/*<Row>
                <Column footer="Max" colSpan={2} className="text-center" style={cGrey} />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
                <Column className="text-center" />
            </Row> */}
        </ColumnGroup>
    )

    const colDate = (rowData) => {
        const _wwtDate = rowData.wwtDate
        let year = _wwtDate.substring(0, 4);
        let month = _wwtDate.substring(4, 6);
        let day = _wwtDate.substring(6, 8);
        const formattedDate = `${day}/${month}/${year}`;

        return <div>{formattedDate}</div>;
    }

    const colNumber = (data, decimal) => {
        const _data = data;

        if (_data === 0 || _data === "0" || _data === null) {
            return (<div className='text-center'>-</div>);
        } else {
            const numberData = parseFloat(_data).toFixed(decimal);

            return (<div className='text-center'>{numberData}</div>);
        }
    }

    const colString = (data) => {
        const _data = data;

        if (_data === null) {
            return (<div className='text-center'>-</div>);
        } else {
            return (<div className='text-center'>{_data}</div>);
        }
    }

    const colAT1 = (rowData) => {
        const _data = rowData.wwtAT1p
        const _sa = rowData.wwtAT1sa
        const _sb = rowData.wwtAT1sb

        if (_data === 0 || _data === "0" || _data === null) {
            return (<div className='text-center'>-</div>)
        } else if (parseFloat(_data) > parseFloat(_sb)) {
            let numberSb = parseFloat(_data).toFixed(1);

            return (<div className='text-center' style={cPink}>{numberSb}</div>)
        } else {
            let numberNormal = parseFloat(_data).toFixed(1);

            return (<div className='text-center' >{numberNormal}</div>)
        }

    }

    const colAT2 = (rowData) => {
        const _data = rowData.wwtAT2p
        const _sa = rowData.wwtAT2sa
        const _sb = rowData.wwtAT2sb

        if (_data === 0 || _data === "0" || _data === null) {
            return (<div className='text-center'>-</div>)
        } else if (parseFloat(_data) > parseFloat(_sb)) {
            let numberSb = parseFloat(_data).toFixed(1);

            return (<div className='text-center' style={cPink}>{numberSb}</div>)
        } else {
            let numberNormal = parseFloat(_data).toFixed(1);

            return (<div className='text-center' >{numberNormal}</div>)
        }

    }



    useEffect(() => {
        handleLoad()
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>WWT Monitoring</h5>
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
                            dataKey="wwtID"
                            value={resultDT}
                            headerColumnGroup={tableHeaderAPI}
                            footerColumnGroup={tableFooter}
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
                            <Column body={colDate} header="Date" field="wwtDate" ></Column>
                            <Column body={colAT1} header="Adj Tank 1" field="wwtAT1p" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtMTp, 1)} header="Mix Tank" field="wwtMTp" ></Column>
                            <Column body={colAT2} header="Adj Tank 2" field="wwtAT2p" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtAT11p, 1)} header="Aeration Tank 11" field="wwtAT11p" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtT12p, 1)} header="Tank 12" field="wwtT12p" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtCTp, 1)} header="Clarifier Tank" field="wwtCTp" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtFp, 1)} header="Fnal" field="wwtFp" ></Column>
                            <Column body={(rowData) => colString(rowData.wwtCColor)} header="Coagulation Color" field="wwtCColor" ></Column>
                            <Column body={(rowData) => colString(rowData.wwtCFSize)} header="Coagulation Floc Size" field="wwtCFSize" ></Column>
                            <Column body={(rowData) => colString(rowData.wwtCSpeed)} header="Coagulation Slinking Speed" field="wwtCSpeed" ></Column>
                            <Column body={(rowData) => colString(rowData.wwtFWColor)} header="Final Water Color" field="wwtFWColor" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtFRD1, 1)} header="Flowrate D1" field="wwtFRD1" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtFRD2, 0)} header="Flowrate D2" field="wwtFRD2" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtEQF1, 1)} header="EQ Flowrate 1" field="wwtEQF1" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtEQF2, 0)} header="EQ Flowrate 2" field="wwtEQF2" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtLIncoming, 0)} header="Lime Incoming" field="wwtLIncoming" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtPUsage, 0)} header="Polymer Usage" field="wwtPUsage" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtSGen, 0)} header="Sludge Generate" field="wwtSGen" ></Column>
                            <Column body={(rowData) => colNumber(rowData.wwtSDis, 0)} header="Sludge Dispose" field="wwtSDis" ></Column>
                            <Column body={actionRowButton} exportable={false}></Column>

                        </DataTable>
                    </div>
                    {/* ################# RECORD DIALOG ################# */}
                    <Dialog header="Record : WWT Monitoring" visible={showDialog} onHide={actionCloseDialog} footer={dialogFooter} modal maximizable style={{ width: '75vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                        <div className="formgrid grid">
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtDate">Date*</label>
                                    <InputMask id="wwtDate" mask="9999/99/99" placeholder="yyyy/mm/dd" value={dataDialog.wwtDate} required className={classNames({ 'p-invalid': !dataDialog.wwtDate || dataDialog.wwtDate.length < 8 })} onChange={(e) => handleInputChange(e, 'wwtDate')} />
                                </div>
                            </div>
                            <div className="field col-6">
                                <div className="flex flex-column">
                                    <label htmlFor="wwtTime">Time*</label>
                                    <InputMask id="wwtTime" mask="99:99" placeholder="hh:mm" value={dataDialog.wwtTime} required className={classNames({ 'p-invalid': !dataDialog.wwtTime })} onChange={(e) => handleInputChange(e, 'wwtTime')} />
                                </div>
                            </div>
                            <div className="field col-12">
                                <TabView>
                                    <TabPanel header="Tank">
                                        <div className="formgrid grid">
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtAT1p">Adj Tank 1</label>
                                                    <InputNumber id="wwtAT1p" value={dataDialog.wwtAT1p} onValueChange={(e) => handleNumberChange(e, 'wwtAT1p')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtMTp">Mix Tank</label>
                                                    <InputNumber id="wwtMTp" value={dataDialog.wwtMTp} onValueChange={(e) => handleNumberChange(e, 'wwtMTp')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtAT2p">Adj Tank 2</label>
                                                    <InputNumber id="wwtAT2p" value={dataDialog.wwtAT2p} onValueChange={(e) => handleNumberChange(e, 'wwtAT2p')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtAT11p">Aeration Tank 11</label>
                                                    <InputNumber id="wwtAT11p" value={dataDialog.wwtAT11p} onValueChange={(e) => handleNumberChange(e, 'wwtAT11p')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtT12p">Tank 12</label>
                                                    <InputNumber id="wwtT12p" value={dataDialog.wwtT12p} onValueChange={(e) => handleNumberChange(e, 'wwtT12p')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtCTp">Clarifier Tank</label>
                                                    <InputNumber id="wwtCTp" value={dataDialog.wwtCTp} onValueChange={(e) => handleNumberChange(e, 'wwtCTp')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtFp">Final Portable</label>
                                                    <InputNumber id="wwtFp" value={dataDialog.wwtFp} onValueChange={(e) => handleNumberChange(e, 'wwtFp')} minFractionDigits={2} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel header="Coagulation">
                                        <div className="formgrid grid">
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtCColor">Color</label>
                                                    <AutoComplete id="wwtCColor" field="name" value={dataDialog.wwtCColor} suggestions={itemCColor} completeMethod={searchCColor} onChange={(e) => handleAutoCompleteChange(e, 'wwtCColor')} dropdown />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtCFSize">Floc Size</label>
                                                    <AutoComplete id="wwtCFSize" field="name" value={dataDialog.wwtCFSize} suggestions={itemCFSize} completeMethod={searchCFSize} onChange={(e) => handleAutoCompleteChange(e, 'wwtCFSize')} dropdown />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtCSpeed">Slinking Speed</label>
                                                    <AutoComplete id="wwtCSpeed" field="name" value={dataDialog.wwtCSpeed} suggestions={itemCSpeed} completeMethod={searchCSpeed} onChange={(e) => handleAutoCompleteChange(e, 'wwtCSpeed')} dropdown />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtFWColor">Final Water Color</label>
                                                    <AutoComplete id="wwtFWColor" field="name" value={dataDialog.wwtFWColor} suggestions={itemFWColor} completeMethod={searchFWColor} onChange={(e) => handleAutoCompleteChange(e, 'wwtFWColor')} dropdown />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtFRD2">Flowrate (Discharge) m<sup>3</sup>d</label>
                                                    <InputNumber id="wwtFRD2" value={dataDialog.wwtFRD2} onValueChange={(e) => handleNumberChange(e, 'wwtFRD2')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtEQF2">EQ Flowrate (In) m<sup>3</sup>d</label>
                                                    <InputNumber id="wwtEQF2" value={dataDialog.wwtEQF2} onValueChange={(e) => handleNumberChange(e, 'wwtEQF2')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtLIncoming">Lime Incoming Qty (kg)</label>
                                                    <InputNumber id="wwtLIncoming" value={dataDialog.wwtLIncoming} onValueChange={(e) => handleNumberChange(e, 'wwtLIncoming')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                            <div className="field col-3">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtPUsage">Polymer Usage Qty (kg)</label>
                                                    <InputNumber id="wwtPUsage" value={dataDialog.wwtPUsage} onValueChange={(e) => handleNumberChange(e, 'wwtPUsage')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                    <TabPanel header="Sludge(Bags)">
                                        <div className="formgrid grid">
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtSGen">Generate</label>
                                                    <InputNumber id="wwtSGen" value={dataDialog.wwtSGen} onValueChange={(e) => handleNumberChange(e, 'wwtSGen')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtSDis">Dispose</label>
                                                    <InputNumber id="wwtSDis" value={dataDialog.wwtSDis} onValueChange={(e) => handleNumberChange(e, 'wwtSDis')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                            <div className="field col-4">
                                                <div className="flex flex-column">
                                                    <label htmlFor="wwtTime">Balance  <i>*For 1st day of the month only</i></label>
                                                    <InputNumber disabled={!enableBal} id="wwtSBal" value={dataDialog.wwtSBal} onValueChange={(e) => handleNumberChange(e, 'wwtSBal')} minFractionDigits={0} />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>
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

export default WWTPage;
