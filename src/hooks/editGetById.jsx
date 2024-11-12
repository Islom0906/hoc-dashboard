import {useEffect} from "react";
import {useSelector} from "react-redux";

const EditGetById = (getByIdRefetch,id) => {
    const {editId} = useSelector(state => state.query)

    useEffect(() => {
        if (editId !== ""||id) {
            getByIdRefetch();
        }
    }, [editId]);
};

export default EditGetById;