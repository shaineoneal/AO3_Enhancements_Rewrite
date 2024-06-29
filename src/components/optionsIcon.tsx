import { useContext, useEffect } from 'react';
import { IconContext } from 'react-icons';
import { BsFillGearFill } from 'react-icons/bs';
import { TokenContext } from '../contexts';
import { log } from '../utils';

export const OptionsIcon = () => {

    const { authToken } = useContext(TokenContext);

    useEffect(() => {
       log('useEffect');
    }, [authToken]);

    return (
        <IconContext.Provider value={{ className: 'settings-icon' }}>
            <a href="options.html">
                {authToken ? <BsFillGearFill /> : null}
            </a>
        </IconContext.Provider>
    );
}







