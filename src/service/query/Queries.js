import {useMutation, useQuery} from "react-query";
import apiService from "../apis/api";
import {message} from "antd";


export const useGetQuery=(isEnabled=true,key,url,isNotification=true)=>{
    const {
        data,
        isLoading,
        refetch,
        isSuccess,
    } = useQuery(key, () => apiService.getData(url), {
        enabled: isEnabled,
        onError: (error) => {
            if (isNotification){
            message.error(error.message);

            }
        },
        onSuccess: () => {
            if (isNotification){
            message.success('Успешно');
            }
        },
    });

    return {data,isLoading,refetch,isSuccess}
}

export const useGetByIdQuery=(isEnabled=true,key,editId,url)=>{
    const {
        isLoading,
        data,
        refetch,
        isSuccess,
    } = useQuery([key, editId], () => apiService.getDataByID(url, editId), {
        enabled: isEnabled
    });

    return {isSuccess,isLoading,data,refetch}
}

export const usePostQuery=()=>{
    const {
        mutate,
        isLoading,
        isSuccess,
        data
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    return {mutate,isSuccess,isLoading,data}
}

export const useEditQuery=()=>{
    const {
        mutate,
        isLoading,
        isSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id), {
        onSuccess: () => {
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
    return {mutate,isSuccess,isLoading}
}

export const useDeleteQuery=()=>{
    const {
        mutate,
        isSuccess,
        isLoading,
    } = useMutation(({url, id}) => apiService.deleteData(url, id),{
        onSuccess:()=>{
            message.success('Успешно')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });
    return {mutate,isSuccess,isLoading}
}

