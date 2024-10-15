import React, {useEffect} from 'react';
import axios, {setAuthToken} from "../../../service/auth/axios";
import apiService from "../../../service/apis/api";
import {authData} from "../../../store/slice/authSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {selectCompany ,selectCompanyName} from "../../../store/slice/companySlice";
import {selectModuls} from "../../../store/slice/modulsSlice";

const AuthProvider = ({children}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()

    axios.interceptors.response.use(
        (res) => res,
        async (err) => {
            const getRefToken = localStorage.getItem('refToken')

            if (err.response.status === 401 && err.response.config.method !== "get" && getRefToken) {
                try {
                    const refreshTokenData = {
                        refresh: getRefToken
                    }
                    const newToken = await apiService.postData('/users/user/token/refresh/', refreshTokenData);
                    localStorage.setItem('token', newToken.access)

                    // Retry the original request with the new token
                    const originalRequest = err.config;
                    originalRequest.headers.Authorization = `Bearer ${newToken.access}`
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken.access}`;
                    return axios(originalRequest)
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }else if (err.response.status === 401){
                navigate('/login')
                dispatch(authData({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                }))

            }
            return Promise.reject(err);
        },
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        const getUser = async () => {

            if (!token) {
                dispatch(authData({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false
                }))
                navigate('/login')
                return;
            }

            setAuthToken(token)
            try {

                const data =await apiService.getData('/users/user/me')
                dispatch(authData({
                    user: data,
                    isLoading: false,
                    isAuthenticated: true
                }))
                if(data?.roles[0].role?.name !=='general_director'){
                    dispatch(selectCompany(data?.roles[0].company?.id))
                    dispatch(selectCompanyName(data?.roles[0].company?.title))
                    dispatch(selectModuls(data?.roles[0]?.module.id))
                }
            } catch (error) {
                dispatch(authData({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false
                }))
                navigate('/login')
            }
        }

        getUser()

    }, []);


    return (
        <>
            {children}
        </>
    );
};

export default AuthProvider;