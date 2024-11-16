import { getLinearProgressUtilityClass } from "@mui/material";
import * as types from "../constant/actionTypes";
import { createProgramAPI, deleteProgramAPI, getProgramsAPI, updateProgramAPI} from "../services/apiCall";


export const fetchPrograms = (institutionId, listProgramPayload) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token;
        const response = await getProgramsAPI(institutionId,listProgramPayload, token);
        dispatch({ type: types.FETCH_PROGRAMS_SUCCESS, payload: response.data });
        return { success: true, data: response.data };
    } catch (error) {
        dispatch({ type: types.FETCH_PROGRAMS_FAILURE, payload: error.response.data.message });
        return { success: false, message: error.response.data.message };
    }
};

export const createProgram = (createProgramPayload) => async (dispatch, getState) => {
    try {
        dispatch({ type: types.CREATE_PROGRAM_REQUEST });
        const token = getState().auth.token;
        const response = await createProgramAPI(createProgramPayload, token);
        dispatch({ type: types.CREATE_PROGRAM_SUCCESS, payload: response.data });
        return { success: true, data: response.data };
    } catch (error) {
        dispatch({ type: types.CREATE_PROGRAM_FAILURE, payload: error.response.data.message });
        return { success: false, message: error.response.data.message };
    }
};

export const deleteProgram = (programId) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token;
        const response = await deleteProgramAPI(programId, token);
        dispatch({ type: types.DELETE_PROGRAM_SUCCESS, payload: programId });
        return { success: true, data: response.data };
    } catch (error) {
        dispatch({ type: types.DELETE_PROGRAM_FAILURE, payload: error.response.data.message });
        return { success: false, message: error.response.data.message };
    }
};

export const updateProgram = (updateProgramPayload) => async (dispatch, getState) => {
    try {
        const token = getState().auth.token;
        const response = await updateProgramAPI(updateProgramPayload.id, updateProgramPayload, token);  
        dispatch({ type: types.UPDATE_PROGRAM_SUCCESS, payload: response.data });
        return { success: true, data: response.data };
    } catch (error) {
        dispatch({ type: types.UPDATE_PROGRAM_FAILURE, payload: error.response.data.message });
        return { success: false, message: error.response.data.message };
    }
};


