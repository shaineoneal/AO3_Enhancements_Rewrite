import { useEffect, useState } from 'react';
import { useUser } from '../utils/zustand';
import { IconContext } from 'react-icons';
import { BiArrowBack } from 'react-icons/bi';
import { NewSheet, Logout } from '../components';
import { LoaderContext } from '../contexts';
import { createRoot } from 'react-dom/client';
import '../styles.css';
export function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

/**
 * The main component for the options page.
 * @returns the Options component
 */
const Options = () => {
    const spreadsheetId = useUser().spreadsheetId;

    /**
     * State for the loader
     * @type {boolean}
     */
    const [ loader, setLoader ] = useState(false);

    /**
     * Side effect to run when the component mounts
     */
    useEffect(() => {
    }, []);

    //TODO: evalate if this is needed
    //chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //    log('heard message: ', message);
    //    if (message.message === 'spreadsheetUrlChanged') {
    //        setSpreadsheetUrl(message.newUrl);
    //        setLoader(false);
    //    }
    //});

    return (
        <>
            <header>
                <div className="flex-container">
                    <IconContext.Provider value={{ className: 'back-icon' }}>
                        <a href="popup.html">
                            <BiArrowBack />
                        </a>
                    </IconContext.Provider>
                    <div className="title">AO3E Rewritten&apos;s Options</div>
                </div>
            </header>
            <main>
                <div className="options-container">
                    <div>Google Spreadsheets URL</div>
                    <input type="text" defaultValue={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`} />
                    <Logout />
                    <LoaderContext.Provider value={{ loader, setLoader }}>
                        <NewSheet />
                    </LoaderContext.Provider>
                </div>
            </main>
        </>
    );
};

export const root = createRoot(document.getElementById("root")!);

root.render(
    <Options />
);