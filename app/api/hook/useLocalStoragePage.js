import { useEffect, useState } from 'react';
import useStore from '../store/useStore'

export const useLocalStoragePage = (key) => {
    const { getItem, setItem, initializeItem } = useStore();
    const [value, setValue] = useState(null);

    // Initialize the item in local storage with a default value if it doesn't exist
    useEffect(() => {
        initializeItem(key, '[]'); // Replace '[]' with your actual default value if needed
    }, [initializeItem, key]);

    // Get the stored value and update state
    useEffect(() => {
        const storedValue = getItem(key);
        if (storedValue === null) {
            const defaultValue = '[]'; // Set your default value here
            setItem(key, defaultValue);
            setValue(defaultValue);
        } else {
            setValue(storedValue);
        }
    }, [getItem, setItem, key]);

    // Function to set a new item in local storage
    const putLocalStorageItem = (newValue) => {
        setItem(key, newValue);
        setValue(newValue);
    };

    return [value || '[]', putLocalStorageItem];
};
