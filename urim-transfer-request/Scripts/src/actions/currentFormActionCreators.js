import dispatcher from '../dispatcher/dispatcher'
import * as Actions from './constants.js'
import { currentFormToPDF } from '../service/pdfService.js'
import * as Dao from '../dataAccess/dataAccess.js'
import { StatusEnum } from '../stores/storeConstants.js'

export function displayRequestForm(request) {
    dispatcher.dispatch({
        type: Actions.DISPLAY_REQUEST_FORM,
        request
    })
}

export function displayNewRequestForm() {
    dispatcher.dispatch({
        type: Actions.DISPLAY_NEW_REQUEST_FORM
    })
}

export function displayCommentInput() {
    dispatcher.dispatch({
        type: Actions.DISPLAY_COMMENT_INPUT
    })
}

export function clearCurrentForm() {
    dispatcher.dispatch({
        type: Actions.CLEAR_CURRENT_FORM
    })
}

export function markSubmissionAttempted() {
    dispatcher.dispatch({
        type: Actions.MARK_SUBMISSION_ATTEMPTED
    })
}

export function markAddBoxesAttempted() {
    dispatcher.dispatch({
        type: Actions.MARK_ADD_BOXES_ATTEMPTED
    })
}

export function updateFormBatchData(id, newValue) {
    dispatcher.dispatch({
        type: Actions.UPDATE_FORM_BATCH_DATA,
        id,
        newValue
    })
}

export function updateFormBoxGroupData(id, newValue) {
    dispatcher.dispatch({
        type: Actions.UPDATE_FORM_BOX_GROUP_DATA,
        id,
        newValue
    })
}

export function updateFormSingleBoxData(id, newValue, index) {
    dispatcher.dispatch({
        type: Actions.UPDATE_FORM_SINGLE_BOX_DATA,
        id,
        newValue,
        index
    })
}

export function updateFormAdminComments(id, newValue) {
    dispatcher.dispatch({
        type: Actions.UPDATE_FORM_ADMIN_COMMENTS,
        id,
        newValue
    })
}

export function removeAdminComment() {
    dispatcher.dispatch({
        type: Actions.REMOVE_ADMIN_COMMENT
    })
}

export function toggleBoxListVisibilty() {
    dispatcher.dispatch({
        type: Actions.TOGGLE_BOX_LIST_VISIBILTY
    })
}

export function addBoxesToRequest(number) {
    dispatcher.dispatch({
        type: Actions.ADD_BOXES_TO_REQUEST,
        number
    })
}

export async function returnCurrentFormToUser(formData) {
    dispatcher.dispatch({
        type: `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.PENDING}`
    })

    Dao.updateForm(formData, StatusEnum.NEEDS_USER_REVIEW)

    dispatcher.dispatch({
        type: Actions.UPDATE_CURRENT_FORM_STATUS,
        status: StatusEnum.NEEDS_USER_REVIEW
    })

    dispatcher.dispatch({
        type: `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.FULFILLED}`,
        request: formData
    })

    clearCurrentForm()
}

// called when a user is finished editing their form
export async function submitCurrentFormForApproval(formData) {
    dispatcher.dispatch({
        type: `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.PENDING}`
    })

    //save the formData to the pendingRequestsList
    const persistorFunction = formData.status === StatusEnum.NEW_REQUEST ? Dao.createForm : Dao.updateForm
    await persistorFunction(formData, StatusEnum.WAITING_ON_ADMIN_APPROVAL)

    // after the current form is saved on the server, update its cached statua
    dispatcher.dispatch({
        type: Actions.UPDATE_CURRENT_FORM_STATUS,
        status:  StatusEnum.WAITING_ON_ADMIN_APPROVAL
    })

    dispatcher.dispatch({
        type: `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.FULFILLED}`,
        request: formData
    })

    clearCurrentForm()
}

// called when an admin approves the current form for archival
export async function archiveCurrentForm(formData) {
    dispatcher.dispatch({
        type: `${Actions.ARCHIVE_CURRENT_FORM}${Actions.PENDING}`
    })
    // create and submit each PDF to the server
    const pdfBuffers = await currentFormToPDF(formData);

    for(let i = 0; i < pdfBuffers.length; i++) {
        await Dao.saveFormPdfToSever(pdfBuffers[i], `transfer_sheet_${i}.pdf`)
    }

    // after archiving the form pdf and metadata, delete the form from the pending requests lists
    Dao.deleteForm(formData)

    dispatcher.dispatch({
        type: Actions.UPDATE_CURRENT_FORM_STATUS,
        status:  StatusEnum.APPROVED
    })

    dispatcher.dispatch({
        type: `${Actions.ARCHIVE_CURRENT_FORM}${Actions.FULFILLED}`,
        request: formData
    })

    clearCurrentForm()
}
