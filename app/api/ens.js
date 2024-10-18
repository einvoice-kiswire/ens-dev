import React, { useState, useEffect, useMemo, useRef } from 'react';



import axios from "axios";
import Cookies from "js-cookie"
Cookies.remove('ENS_GroupID')

// import { error } from "console";
const url1 = "http://194.1.141.10:3200/demo1";
const url2 = "http://194.1.31.8:3220/";


import useStore from '../api/store/useStore';


//########################## DateString #####################################
export function DateString(isDate) {
    const _isDate = new Date(isDate);

    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const formattedDate = _isDate.toLocaleString('en-US', options);
    return formattedDate
}

//########################## AppMenu (ENS) #####################################
export async function ENSMenu() {

    const data = [
        { MenuSeq: 1, MenuName: 'Menu', MenuURL: '', MenuRef: 0, MenuSort: '', MenuLevel: '', MenuIcon: '' }, //-- menu
        { MenuSeq: 10, MenuName: 'Home', MenuURL: '/', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-home' },
        { MenuSeq: 3, MenuName: 'Knowledge Centre', MenuURL: '/ens/knowledge', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-globe' },
        { MenuSeq: 4, MenuName: 'Monitoring', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 5, MenuName: 'Mini Lab', MenuURL: '/ens/minilabmonitor', MenuRef: 4, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 6, MenuName: 'WWT', MenuURL: '/ens/wwtmonitor', MenuRef: 4, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 7, MenuName: 'Record', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 8, MenuName: 'Mini Lab', MenuURL: '/ens/minilab', MenuRef: 7, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-table' },
        { MenuSeq: 9, MenuName: 'WWT', MenuURL: '/ens/wwt', MenuRef: 7, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-table' },
        { MenuSeq: 10, MenuName: 'Mini Lab Parameter', MenuURL: '/ens/minilabparams', MenuRef: 24, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-lock' }, //-- menu
        { MenuSeq: 11, MenuName: 'WWT Parameter', MenuURL: '/ens/wwtparams', MenuRef: 24, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-lock' },        //-- menu
        { MenuSeq: 12, MenuName: 'Knowledge Upload', MenuURL: '/ens/upload', MenuRef: 7, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-table' },
        { MenuSeq: 13, MenuName: 'IETS/WWTS', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 14, MenuName: 'List', MenuURL: '/ens/2024/iets', MenuRef: 13, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 15, MenuName: 'APCS', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 16, MenuName: 'List', MenuURL: '/ens/2024/apcs', MenuRef: 15, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 17, MenuName: 'Machine Certification', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 18, MenuName: 'List', MenuURL: '/ens/2024/machcert', MenuRef: 17, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 19, MenuName: 'CPD/CEP', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-folder' },
        { MenuSeq: 20, MenuName: 'List', MenuURL: '/ens/2024/cpdcep', MenuRef: 19, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-bars' },
        { MenuSeq: 21, MenuName: 'Auth', MenuURL: '', MenuRef: 1, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-users' },
        { MenuSeq: 22, MenuName: 'User', MenuURL: '/ens/auth/user', MenuRef: 21, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-user' },
        // { MenuSeq: 23, MenuName: 'Menu', MenuURL: '/ens/auth/menu', MenuRef: 21, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-users' },
        // { MenuSeq: 24, MenuName: 'Systems', MenuURL: '', MenuRef: 21, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-users' },
        { MenuSeq: 25, MenuName: 'Common Code', MenuURL: '/ens/auth/common', MenuRef: 24, MenuSort: '', MenuLevel: '', MenuIcon: 'pi pi-fw pi-lock' }, //-- menu

    ];

    // Helper function to build the menu tree
    const buildMenuTree = (menuItems, parentSeq) => {
        // console.log(`Building menu tree for parentSeq: ${parentSeq}`);
        const filteredItems = menuItems.filter(item => item.MenuRef === parentSeq);
        // console.log(`Filtered items for parentSeq ${parentSeq}:`, filteredItems);

        return filteredItems.map(item => {
            const children = buildMenuTree(menuItems, item.MenuSeq);
            const menuItem = {
                label: item.MenuName,
                icon: item.MenuIcon,
                to: item.MenuURL || undefined,
                items: children.length ? children : undefined
            };
            // console.log('MenuItem:', menuItem);
            return menuItem;
        });
    };

    // Build the top-level menu
    const menu = buildMenuTree(data, 0);
    return menu;

}
// 
export async function ENSAccounts(UserID) {
    try {
        const res = await axios.get(url2 + "ens/user", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: UserID
            },
        });
        // console.log(res.data);
        return res;

    } catch (error) {
        return error;
    }
}

export async function ENSAccountsSave(UserID, params) {
    try {
        const res = await axios.post(url2 + "ens/accounts/newsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: UserID,
                ...params
            },
        });
        // console.log(res.data);
        return res;
    } catch (error) {
        return error;
    }
}

export async function ENSAccountsEdit(UserID, params) {
    try {
        const res = await axios.post(url2 + "ens/accounts/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: UserID,
                ...params
            },
        });
        // console.log(res.data);
        return res;
    } catch (error) {
        return error;
    }
}



export async function ENSAccountsdelete(params) {
    try {
        const res = await axios.post(url2 + "ens/accounts/delete", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...params
            },
        });
        // console.log(res.data);
        return res;
    } catch (error) {
        return error;
    }

}
export async function ENSCheck(UserID, GroupID) {
    try {
        const res = await axios.get(url2 + "ens/check", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: UserID,
                GroupID: GroupID
            },
        });
        // console.log(res.data);
        return res;

    } catch (error) {
        return error;
    }
}
// ######################### ENS LocalStorage #############################
export async function HandleLocalStorage(UserID, UserName) {
    // console.log('Function HandleLocalStorage', UserID, UserName)
    try {
        let returnENSData = {
            ENS_UserID: UserID,
            ENS_UserName: UserName,
            ENS_isAdmin: 0,
            ENS_date: new Date().toLocaleDateString(),
            ENS_UseYN: 'N'
        };

        const ensTemp = await ENSAccounts(UserID)
        if (ensTemp === null) {
            console.log('ensTemp empty');
        } else if (!ensTemp.data || ensTemp.data.length === 0) {
            console.log('ensTemp no data');
        } else if (ensTemp.data.length > 0) {
            returnENSData.ENS_isAdmin = ensTemp.data[0].isAdmin === 1 ? ensTemp.data[0].isAdmin : 2
            const userUpdateDate = ensTemp.data[0].UserUpdate === null
                ? new Date().toLocaleDateString()
                : new Date(ensTemp.data[0].UserUpdate);
            returnENSData.ENS_date = userUpdateDate

            returnENSData.ENS_UseYN = ensTemp.data[0].UseYN
        }
        // console.log('returnENSData', returnENSData);
        return returnENSData

    } catch (error) {
        return error;
    }

}
// ######################### ENS LocalStorage #############################
export async function getENSAccounts(params) {
    try {
        const res = await axios.get(url2 + "ens/accounts", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: params.UserID,
                sUserID: params.sUserID,
                sUserName: params.sUserName,
                sLevel: params.sLevel,
                sYesNo: params.sYesNo
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
//########################## Mini Lab #####################################
export async function minilab(UserID, GroupId, ToDate) {
    try {
        const res = await axios.get(url2 + "ens/minilab", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                InputUser: UserID,
                GroupId: GroupId,
                ToDate: ToDate,
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function minilab_params(parameter) {
    // console.log('minilab_params', parameter)
    try {
        const res = await axios.get(url2 + "ens/minilab/params", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: parameter.UserID,
                mlbType: parameter.Type
            },
        });
        return res;
    } catch (error) {
        return error;
    }
}
export async function minilab_editsave(UserId, GroupId, ToDate, parameter) {
    // console.log('minilab_editsave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/minilab/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }

}
export async function minilab_newsave(UserId, GroupId, ToDate, parameter) {
    // console.log('minilab_newsave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/minilab/newsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }
}
export async function minilab_deletesave(UserId, GroupId, ToDate, parameter) {
    // console.log('minilab_deletesave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/minilab/deletesave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }

}
export async function minilabUpdate(parameter) {
    try {
        // console.log('minilabUpdate')
        const _parameter = parameter;
        const res = await axios.post(url2 + "ens/minilab/update", {
            ..._parameter
        });
        return res.data;
    } catch (error) {
        return error;
    }
}
export async function minilabInsert(parameter) {
    try {
        const _parameter = parameter;
        const res = await axios.post(url2 + "ens/minilabsave", {
            ..._parameter
        });
        return res.data
    } catch (error) {
        return error;
    }
}
export async function minilabSave(parameter) {
    try {
        const res = await axios.get(url2 + "ens/minilabsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                parameter: parameter,
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
//########################## WWT #####################################
export async function wwt(parameter) {
    // console.log('wwt', parameter)
    try {
        const res = await axios.get(url2 + "ens/wwt", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function wwt_newsave(parameter) {
    // console.log ('wwt_newsave', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/newsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }
}
export async function wwt_editsave(parameter) {
    // console.log ('wwt_newsave', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }
}
export async function wwt_deletesave(parameter) {
    // console.log ('wwt_newsave', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/deletesave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }
}
//########################## Login Logout #####################################
export async function ensLogin(GroupID, UserID, PWord) {
    // console.log ('api->ensLogin', GroupID)
    try {
        const res = await axios.get(url2 + "ens/login", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                GroupID: GroupID,
                UserID: UserID,
                PWord: PWord
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export function isLogin() {
    // Cookies.remove('ENS_GroupID')
    // setLogout()
    // Cookies.set('ENS_UserID', '101054')
    return Cookies.get('ENS_UserID');
}
export function LoginInfo(info) {
    return Cookies.get(info)
}
export function setLogin(params) {
    // console.log ('setlogin', params)
    Cookies.set('ENS_GroupID', params.GroupID)
    Cookies.set('ENS_UserID', params.UserID)
    Cookies.set('ENS_UserName', params.UserName)
    Cookies.set('ENS_AprName', params.AprName)
    Cookies.set('ENS_BuseoID', params.UBuseoID)
    Cookies.set('ENS_BuseoName', params.BuseoName)
    Cookies.set('ENS_MailID', params.MailID)
}
export function setLogout() {
    Cookies.remove('ENS_GroupID')
    Cookies.remove('ENS_UserID')
    Cookies.remove('ENS_UserName')
    Cookies.remove('ENS_AprName')
    Cookies.remove('ENS_BuseoID')
    Cookies.remove('ENS_BuseoName')
    Cookies.remove('ENS_MailID')
}
//########################## mlbparamset #####################################
export async function mlbparamset(parameter) {
    try {
        const res = await axios.get(url2 + "ens/mlbparam", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function mlbparamset_editsave(parameter) {
    // console.log ('mlbparamset_editsave', parameter)
    try {
        const res = await axios.post(url2 + "ens/mlbparam/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }

}

//########################## wwtparam #####################################
export async function wwtparamset(parameter) {
    try {
        const res = await axios.get(url2 + "ens/wwtparam", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function wwtparamset_editsave(parameter) {
    // console.log ('wwtparamset_editsave', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwtparam/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }

}




//########################## PDF UPLOAD #####################################
export async function pdfUpload(file) {

    // console.log ('pdfUpload', file)
    if (!file) {
        throw new Error('No file selected');
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
        throw new Error('Invalid file type. Only PDF files are allowed.');
    }

    const formData = new FormData();
    formData.append('file', file);

    // console.log('formData:', formData);

    try {
        const response = await axios.post(url2 + 'ens/uploadpdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.status === 200) {
            console.log('File uploaded successfully');
            // console.log('message', response)
            return { success: true, message: response };
            // You can perform additional actions after a successful upload
        } else {
            throw new Error('File upload failed');
        }
    } catch (error) {
        console.error('Error during file upload:', error);
        return { success: false, message: error };
    }
}
export async function pdfInsert(parameter) {
    // console.log ('pdfInsert',parameter)
    try {
        const res = await axios.post(url2 + "ens/uploadinsert", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function pdfCancelYN(parameter) {
    // console.log ('pdfInsert',parameter)
    try {
        const res = await axios.post(url2 + "ens/uploadCancelYN", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function uploadSearch(parameter) {
    // console.log ('uploadSearch', parameter)
    try {
        const res = await axios.get(url2 + "ens/upload/search", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
export async function uploadSearchY(parameter) {
    // console.log ('uploadSearch', parameter)
    try {
        const res = await axios.get(url2 + "ens/upload/searchY", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                ...parameter
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}
//########################## WWT (AMIRUL) #####################################
export async function wwt_params(parameter) {
    // console.log('wwt_params', parameter)
    try {
        const res = await axios.get(url2 + "ens/wwt/params", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                UserID: parameter.UserID,
                wwtType: parameter.Type
            },
        });
        return res;
    } catch (error) {
        return error;
    }
}

export async function wwtOLD(UserID, GroupId, ToDate) {
    try {
        const res = await axios.get(url2 + "ens/wwt", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                InputUser: UserID,
                GroupId: GroupId,
                ToDate: ToDate,
            },
        });
        return res;
        // console.log(res);
    } catch (error) {
        return error;
    }
}

export async function wwt_editsaveOLD(UserId, GroupId, ToDate, parameter) {
    // console.log('wwt_editsave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/editsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }

}

export async function wwt_newsaveOLD(UserId, GroupId, ToDate, parameter) {
    // console.log('wwt_newsave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/newsave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }
}

export async function wwt_deletesaveOLD(UserId, GroupId, ToDate, parameter) {
    // console.log('wwt_deletesave: ', parameter)
    try {
        const res = await axios.post(url2 + "ens/wwt/deletesave", {
            timeout: 5000,
            params: {
                udate: Date.now(),
                User_ID: UserId,
                Group_ID: GroupId,
                To_Date: ToDate,
                ...parameter
            }
        })
        return res
    } catch (error) {
        return error
    }

}
