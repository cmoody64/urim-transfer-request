import dispatcher from '../dispatcher/dispatcher'
import {
    DISPLAY_REQUEST_FORM,
    CLEAR_CURRENT_FORM,
    UPDATE_FORM_DATA,
    MARK_SUBMISSION_ATTEMPTED
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

export function updateFormData(id, newValue) {
    dispatcher.dispatch({
        type: UPDATE_FORM_DATA,
        id,
        newValue
    })
}
