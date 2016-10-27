import dispatcher from '../dispatcher/dispatcher'
import {
    DISPLAY_REQUEST_FORM,
    CLEAR_CURRENT_FORM,
    UPDATE_FORM_BATCH_DATA,
    UPDATE_FORM_BOX_GROUP_DATA,
    MARK_SUBMISSION_ATTEMPTED,
    TOGGLE_BOX_LIST_VISIBILTY,
    ADD_BOXES_TO_REQUEST,
    UPDATE_FORM_SINGLE_BOX_DATA,
    MARK_ADD_BOXES_ATTEMPTED
 } from './constants.js'

export function displayRequestForm(request) {
    dispatcher.dispatch({
        type: DISPLAY_REQUEST_FORM,
        request
    })
}

export function clearCurrentForm() {
    dispatcher.dispatch({
        type: CLEAR_CURRENT_FORM
    })
}

export function markSubmissionAttempted() {
    dispatcher.dispatch({
        type: MARK_SUBMISSION_ATTEMPTED
    })
}

export function markAddBoxesAttempted() {
    dispatcher.dispatch({
        type: MARK_ADD_BOXES_ATTEMPTED
    })
}

export function updateFormBatchData(id, newValue) {
    dispatcher.dispatch({
        type: UPDATE_FORM_BATCH_DATA,
        id,
        newValue
    })
}

export function updateFormBoxGroupData(id, newValue) {
    dispatcher.dispatch({
        type: UPDATE_FORM_BOX_GROUP_DATA,
        id,
        newValue
    })
}

export function updateFormSingleBoxData(id, newValue, index) {
    dispatcher.dispatch({
        type: UPDATE_FORM_SINGLE_BOX_DATA,
        id,
        newValue,
        index
    })
}

export function toggleBoxListVisibilty() {
    dispatcher.dispatch({
        type: TOGGLE_BOX_LIST_VISIBILTY
    })
}

export function addBoxesToRequest(number) {
    dispatcher.dispatch({
        type: ADD_BOXES_TO_REQUEST,
        number
    })
}
