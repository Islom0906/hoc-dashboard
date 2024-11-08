import {statusColor} from "../constants/statusColor";

export const translateStatus=(status)=>{
    if (status==='checking'){
        return 'проверка'
    }else if(status==='done'){
        return 'сделанный'
    }else if(status==='progress'){
        return 'прогресс'
    }
}


export const colorStatus=(status)=>{
    if (status==='checking'){
        return statusColor.checking.color
    }else if(status==='done'){
        return statusColor.done.color
    }else if(status==='progress'){
        return statusColor.progress.color
    }
}