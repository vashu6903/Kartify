import {createContext, useContext, useState, useEffect} from 'react';
import { axiosInstance } from '../axiosCalls/axios';

const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        // On refresh, ask the backend if the auth cookie still belongs to a user.
        setLoading(true);
        axiosInstance.get("/customer/me")
        .then((response)=>{
            setCustomer(response.data.customerData)
        })
        .catch(()=>{
            setCustomer(null);
        })
        .finally(()=>{
            setLoading(false);
        })
    }, [])


    return (
        <AuthContext.Provider value={{customer, setCustomer, loading}}>
            {children}
        </AuthContext.Provider>
    )
}

// Components use this hook instead of importing AuthContext directly.
export const useAuth = () => useContext(AuthContext);
