/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useRouter } from 'next/navigation'

import { isLogin, LoginInfo, uploadSearchY } from "../../../api/ens"

const KnowledgePage = () => {
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const [loading, setLoading] = useState(false)
    const [resultDT, setResultDT] = useState([])
    const [selectedRow, setSelectedRow] = useState()

    const [listAIR, setListAIR] = useState(null)
    const [listIETS, setListIETS] = useState(null)
    const [listWASTE, setListWASTE] = useState(null)


    const handleLoad = () => {
        const _userLogin = isLogin();

        if (!_userLogin) {
            router.push('/ens/login');
            return
        }
        const _params = {
            "fileGroup": '',
            "fileName": ''
        }
        handleFetchData(_params)
    }

    const handleFetchData = async (params) => {
        setLoading(true)
        try {
            const _result = await uploadSearchY(params)
            // console.log('handleFetchData', _result)
            setResultDT(_result.data)

            const myData = _result.data

            const filteredDataAIR = myData.filter(item => item.fileGroup === 'AIR');
            const filteredDataIETS = myData.filter(item => item.fileGroup === 'IETS');
            const filteredDataWASTE = myData.filter(item => item.fileGroup === 'WASTE');

            setListAIR(filteredDataAIR)
            setListIETS(filteredDataIETS)
            setListWASTE(filteredDataWASTE)

        } catch (error) {
            console.error('handleFetchData ', error);
            toast.current.show({ severity: 'error', summary: 'Warning', detail: { error }, life: 3000 });
        } finally {
            setLoading(false)
        }
    }

    const colFileList = (fileList) => {
        return (
            <ol>
              {fileList.map((item, index) => {
                // Parse the JSON string in fileInfo
                const fileInfo = JSON.parse(item.fileInfo);
                const fileUploadName = item.fileUploadName;
                const filesize = fileInfo.size;
                const fileDate = fileInfo.lastModifiedDate;
                const lastModifiedDate = new Date(fileDate);

                const fileSizeMB = filesize / (1024 * 1024);
        
                const year = lastModifiedDate.getFullYear();
                const month = (lastModifiedDate.getMonth() + 1).toString().padStart(2, '0');
                const day = lastModifiedDate.getDate().toString().padStart(2, '0');
                const formattedDate = `${day}/${month}/${year}`;
        
                return (
                  <li key={item.fileID}>
                    {item.fileName} {'    '}
                    <a href={'/uploads/' + fileUploadName} target='_blank' title='View Files'><i className="pi pi-file-pdf"></i></a>
                    <br /><small><i>( Size: {fileSizeMB.toFixed(3)} MB ,  File Date: {formattedDate} )</i></small>
                  </li>
                );
              })}
            </ol>
          );
    }

    useEffect(() => {
        handleLoad();
    }, []);

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Knowledge Centre (Environment)</h5>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Air">
                            {listAIR && listAIR.length > 0 ? (
                               colFileList(listAIR)
                            ) : (
                                <span>No items</span>
                            )}

                        </AccordionTab>
                        <AccordionTab header="IETS (WWT)">
                            {listIETS && listIETS.length > 0 ? (
                                colFileList(listIETS)
                            ) : (
                                <span>No items</span>
                            )}
                        </AccordionTab>
                        <AccordionTab header="Schedule Waste">
                            {listWASTE && listWASTE.length > 0 ? (
                                colFileList(listWASTE)
                            ) : (
                                <span>No items</span>
                            )}
                        </AccordionTab>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default KnowledgePage;
