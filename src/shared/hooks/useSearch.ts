import { useCallback, useEffect, useState } from 'react';
import useDebounce from './useDebounce';

interface ISearch {
    fn: (value: string) => Promise<any>;
    initialQuery?: string;
    delay?: number;
}

const useSearch = ({ fn, initialQuery = '', delay = 300 }: ISearch) => {
    const [searchValue, setSearchValue] = useState(initialQuery);
    const [searchResult, setSearchResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceValue = useDebounce(searchValue, delay);

    const fetchSearchData = useCallback(
        async (value: string) => {
            setIsSearching(true);
            try {
                const data = await fn(value);
                setSearchResult(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearching(false);
            }
        },
        [fn]
    );

    useEffect(() => {
        if (debounceValue.trim()) {
            fetchSearchData(debounceValue);
        }
    }, [debounceValue, fetchSearchData]);

    return {
        searchValue,
        setSearchValue,
        searchResult,
        isSearching,
    };
};

export default useSearch;
