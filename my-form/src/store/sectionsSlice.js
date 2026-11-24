import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    education: { title: 'Education', fields: [], columns: [], records: [] },
    experience: { title: 'Experience', fields: [], columns: [], records: [] },
    skills: { title: 'Skills', fields: [], columns: [], records: [] },
    recommendation: { title: 'Recommendations', fields: [], columns: [], records: [] }
}
const sectionsSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
        setSectionsData: (state, action) => {
            Object.assign(state, action.payload)
        },
        addRecord: (state, action) => {
            const { key, fields } = action.payload
            state[key].records.push({ id: Date.now(), fields })
        },
        updateRecord: (state, action) => {
            const { key, id, fields } = action.payload
            state[key].records = state[key].records.map(r => r.id === id ? { id, fields } : r)
        },
        deleteRecord: (state, action) => {
            const { key, id } = action.payload
            state[key].records = state[key].records.filter(r => r.id !== id)
        }
    }
})
export const { setSectionsData, addRecord, updateRecord, deleteRecord } = sectionsSlice.actions
export default sectionsSlice.reducer