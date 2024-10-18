/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Formik } from 'formik';

import { isLogin, ensLogin, setLogin } from '../../../api/ens';

const LoginPage = () => {
    const router = useRouter();
    const toast = useRef(null);

    const groupList = [
        { name: 'KSB', code: '40' },
        { name: 'KCSB', code: '41' },
        { name: 'KNSB', code: '42' }
    ];

    const handleLogin = async (params) => {
        try {
            const result = await ensLogin(params.GroupID.code, params.UserID, params.PWord );
           
            if (result.data && result.data.length > 0) {
                console.log('handleLogin: result', result.data[0])

                setLogin(result.data[0])
                toast.current.show({ severity: 'success', summary: 'Sign In', detail: 'Success..', life: 3000 });
                router.push('/');
            } else {
                toast.current.show({ severity: 'error', summary: 'Sign In', detail: 'Invalid Login', life: 3000 });
            }
           
        } catch (error) {
            console.error('handleLogin ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {

        }
    }

    const handleLoad = async () => {
        const _userLogin = isLogin();
        if (_userLogin) {
            router.push('/');
        }
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 xl:col-12">
                <div className="card">
                    <div className="flex align-items-center justify-content-center">
                        <div className="flex flex-column align-items-center justify-content-center">
                            <div className="w-full surface-card py-8 px-6 " style={{ borderRadius: '12px' }}>
                                <div className="text-center mb-5">
                                    <div className="text-900 text-3xl font-medium mb-3">Login Page</div>
                                    <span className="text-600 font-medium">Sign in to continue</span>
                                </div>
                                <Formik
                                    initialValues={{
                                        GroupID: '',
                                        UserID: '',
                                        PWord: ''
                                    }}
                                    validate={values => {
                                        const errors = {};
                                        if (!values.GroupID) { errors.GroupID = 'Required'; }
                                        if (!values.UserID) { errors.UserID = 'Required'; }
                                        if (!values.PWord) { errors.PWord = 'Required'; }

                                        return errors;
                                    }}
                                    onSubmit={(values, { setSubmitting }) => {
                                        setTimeout(() => {
                                            // alert(JSON.stringify(values, null, 2));
                                            handleLogin(values)
                                            setSubmitting(false);
                                        }, 400);
                                    }}
                                >
                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, }) => (
                                        <form onSubmit={handleSubmit}>
                                            <label htmlFor="GroupID" className="block text-900 font-medium text-xl mb-2">
                                                Group
                                            </label>
                                            <Dropdown
                                                name='GroupID'
                                                value={values.GroupID}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                options={groupList}
                                                optionLabel="name"
                                                placeholder="Select a Group"
                                                // className="w-full md:w-14rem"
                                                className={`w-full mb-3 ${errors.GroupID ? 'p-invalid' : ''}`}
                                            />

                                            <label htmlFor="UserID" className="block text-900 font-medium text-xl mb-2">
                                                User
                                            </label>
                                            <InputText
                                                name='UserID'
                                                value={values.UserID}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                type="text"
                                                placeholder="User"
                                                className={`w-full mb-3 ${errors.UserID ? 'p-invalid' : ''}`}
                                                style={{ padding: '1rem' }}
                                                autoComplete='true'
                                            />
                                            {/* <small id="username-help" >{errors.UserID && touched.UserID && errors.UserID}</small>                                         */}

                                            <label htmlFor="PWord" className="block text-900 font-medium text-xl mb-1">
                                                Password
                                            </label>
                                            <Password
                                                name="PWord"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                placeholder="Password"
                                                feedback={false}
                                                toggleMask
                                                className={`w-full mb-3 ${errors.PWord ? 'p-invalid' : ''}`}
                                                inputClassName="w-full p-3"
                                                autoComplete='true'
                                            />
                                            {/* <small id="username-help">{errors.PWord && touched.PWord && errors.PWord}</small>     */}
                                            <Button label="Sign In" icon='pi pi-lock-open'type="submit" className="w-full p-3 text-xl " disabled={isSubmitting}></Button>
                                            {/* <button type="submit" disabled={isSubmitting}>
                                                        Submit
                                                    </button> */}
                                        </form>

                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;
