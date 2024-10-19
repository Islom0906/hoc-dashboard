import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    editId:localStorage.getItem('editDataId')||"",
    editIdCalendar:""
}
export const querySlice = createSlice({
    name: 'query',
    initialState,
    reducers: {
        editIdQuery: (state, {payload}) => {
            state.editId = payload
        },
        editIdCalendarQuery: (state, {payload}) => {
            state.editIdCalendar = payload
        }
    }
})
export const {editIdQuery ,editIdCalendarQuery} = querySlice.actions
export default querySlice.reducer