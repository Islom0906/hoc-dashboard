import { createSlice } from "@reduxjs/toolkit";

const savedCompany = localStorage.getItem('company');
const initialState = {
  company: savedCompany ? JSON.parse(savedCompany) : null
};

export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    selectCompany: (state, { payload }) => {
      state.company = payload;
      localStorage.setItem('company', JSON.stringify(payload));
    },
    clearCompany: (state) => {
      state.company = null;
      localStorage.removeItem('company');
    }
  }
});

export const { selectCompany, clearCompany } = companySlice.actions;
export default companySlice.reducer;
