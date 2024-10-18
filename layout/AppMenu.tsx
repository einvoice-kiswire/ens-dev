/* eslint-disable @next/next/no-img-element */
import dynamic from 'next/dynamic';
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';
import { Button } from 'primereact/button';
import { ConfirmPopup, confirmPopup, ConfirmPopupProps } from 'primereact/confirmpopup';
import { MouseEvent } from 'react';

import { ENSMenu } from '../app/api/ens';

const AppMenu = () => {
    const router = useRouter();
    const { layoutConfig } = useContext(LayoutContext);
    const [model, setModel] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        const fetchMenu = async () => {
            const menuData = await ENSMenu();

            // console.log('menu', menuData)
            setModel(menuData);
        };
        fetchMenu();
    }, []);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
