import { createContext, useState } from "react";


export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
    const [ account, setAccount1 ] = useState({ email: '', username: '' });
        console.log("datacontext",account)
    return (
        <DataContext.Provider value={{ 
            account, 
            setAccount1 
        }}>
            {children}
        </DataContext.Provider>
    )
}

export default DataProvider;