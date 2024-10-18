/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

import { isLogin, LoginInfo, setLogout, HandleLocalStorage } from "../../app/api/ens";
import { useLocalStoragePage } from '../api/hook/useLocalStoragePage';

const MainPage = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const [UserID, setUserID] = useState('');
    const [UserName, setUserName] = useState('');
    const [AprName, setAprName] = useState('');
    const [BuseoName, setBuseoName] = useState('');
    const [MailID, setMailID] = useState('');
    const [ensUserID, setEnsUserID] = useState('');
    const [ensUser, putEnsUser] = useLocalStoragePage('ENSUser');


    const [ENS_UserID, setENS_UserID] = useState('');
    const [ENS_UserName, setENS_UserName] = useState('');
    const [ENS_isAdmin, setENS_isAdmin] = useState('');
    const [ENS_date, setENS_date] = useState('');
    const [ENS_UseYN, setENS_UseYN] = useState('');

    const [emptyData,SetEmptyData] = useState({
        ENS_UserID: '',
        ENS_UserName: '',
        ENS_isAdmin: 0,
        ENS_date: new Date().toLocaleDateString(),
        ENS_UseYN: 'N'
    })

    const handleLoad = () => {
        const _userLogin = isLogin();

        if (!_userLogin) {
            putEnsUser(JSON.stringify(emptyData))
            router.push('/ens/login');
            return;
        }
        if (ensUser==='[]') {
            HandleLocalStorage(LoginInfo('ENS_UserID'), LoginInfo('ENS_AprName')).then((result) => {                
                SetEmptyData(result)
                putEnsUser(JSON.stringify(result))
            })
        } 

        // console.log('HandleLocalStorage', ensUser)         
        // const temp = JSON.stringify(ensUser, null, 2);
        // console.log('temp:', temp);

        // console.log('ENS_UseYN:', ensUser.ENS_UserID);


        setUserID(LoginInfo('ENS_UserID') || '');
        setAprName(LoginInfo('ENS_AprName') || '');
        setBuseoName(LoginInfo('ENS_BuseoName') || '');
        setMailID(LoginInfo('ENS_MailID') || '');

        // console.log('ENSUser', ensUser);
        // console.log('UserID', UserID);

        // ENSAccounts(LoginInfo('ENS_UserID'))
        //     .then((ensTemp) => {
        //         if (!ensTemp || ensTemp.length === 0) {
        //             console.log('data empty');

        //             let tempempty = {
        //                 UserID: UserID,
        //                 UserName: 'Sheik Hazrin',
        //                 isAdmin: null,
        //                 UpdateDate: '',
        //                 UseYN: null
        //             }

        //             console.log(tempempty)
        //         } else {
        //             console.log('ensTemp', ensTemp.data[0]);
        //         }
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching ENS accounts:', error);
        //     });


        // // console.log('UserID', UserID);
        // try {



        // } catch (error) {
        //     console.error('Error fetching ENS accounts:', error);
        // }



        // putEnsUser(JSON.stringify({
        //     UserID: LoginInfo('ENS_UserID'),
        //     UserName: LoginInfo('ENS_UserName'),
        //     AprName: LoginInfo('ENS_AprName'),
        //     BuseoName: LoginInfo('ENS_BuseoName'),
        //     MailID: LoginInfo('ENS_MailID')
        // }));


    };

    const translateRole = (isAdmin) => {
        switch (isAdmin) {
            case 1:
                return 'ADMIN TEAM';
            case 2:
                return 'USER TEAM';
            case 0:
                return 'GUEST TEAM';
            default:
                return '';
        }
    };

    const accept = () => {
         putEnsUser('{}')
        setLogout();
        router.push('/ens/login');
    };

    const reject = () => {
        // Handle reject
    };

    const confirmLogout = (event) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure?',
            accept,
            reject,
        });
    };

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <ConfirmPopup />
                    <Button onClick={confirmLogout} icon="pi pi-lock" label="Log Out" severity="secondary" outlined raised className=""></Button>
                </div>

            </div>
            <div className="col-6">
                <div className="card">
                    <h5>Accounts</h5>
                    <div className="field p-fluid">
                        <label htmlFor="UserID">UserID :</label>
                        <InputText id="UserID" type="text" value={UserID || ''} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="AprName">Name :</label>
                        <InputText id="AprName" type="text" value={AprName || ''} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="BuseoName">Dept:</label>
                        <InputText id="BuseoName" type="text" value={BuseoName || ''} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="MailID">Email:</label>
                        <InputText id="MailID" type="text" value={`${MailID || ''}@kiswire.com`} disabled={true} />
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <h5>ENS Accounts</h5>
                    <div className="field p-fluid">
                        <label htmlFor="ENS_UserID">UserID :</label>
                        <InputText id="ENS_UserID" type="text" value={emptyData.ENS_UserID || ''} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="ENS_UserName">Name :</label>
                        <InputText id="ENS_UserName" type="text" value={emptyData.ENS_UserName || ''} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="ENS_isAdmin">Level :</label>
                        <InputText id="ENS_isAdmin" type="text" value={translateRole(emptyData.ENS_isAdmin)} disabled={true} />
                    </div>
                    <div className="field p-fluid">
                        <label htmlFor="ENS_date">Last Updated :</label>
                        <InputText id="ENSAprNaENS_datemENS_datee" type="text" value={emptyData.ENS_date || ''} disabled={true} />
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="card">
                    <h5>Notification</h5>
                </div>
            </div>
        </div>
    );
};

export default MainPage;
