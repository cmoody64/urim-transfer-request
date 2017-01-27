import dispatcher from '../dispatcher/dispatcher'
import * as Actions from './constants.js'
import { currentFormToPDF } from '../service/pdfService.js'
import * as Dao from '../dataAccess/dataAccess.js'
import { StatusEnum } from '../stores/storeConstants.js'
import { postSuccessMessage } from '../actions/appActionCreators.js'
import { saveNextObjectNumberToServer } from './settingsActionCreators.js'
import { incrementObjectNumber, formatLongStringForSaveKey } from '../utils/utils.js'

export function displayRequestForm(request) {
    dispatcher.dispatch({
        type: Actions.DISPLAY_REQUEST_FORM,
        request
    })
}

export function displayNewRequestForm(departmentInfo) {
    dispatcher.dispatch({
        type: Actions.DISPLAY_NEW_REQUEST_FORM,
        departmentInfo // pass in the department info so that the new form can be pre-populated with the correct information
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

export function removeBoxFromCurrentForm(index) {
    dispatcher.dispatch({
        type: Actions.REMOVE_BOX_FROM_CURRENT_FORM,
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

export function postFormFooterMessage(text, style, duration) {
    dispatcher.dispatch({
        type: Actions.POST_FORM_FOOTER_MESSAGE,
        text,
        style,
        duration
    })
}

export function clearFormFooterMessage() {
    dispatcher.dispatch({
        type: Actions.CLEAR_FORM_FOOTER_MESSAGE
    })
}

export async function returnCurrentFormToUser(formData) {
    dispatcher.dispatch({
        type: `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.PENDING}`
    })
    postFormFooterMessage('Saving your changes ...', 'info')

    Dao.updateForm(formData, StatusEnum.NEEDS_USER_REVIEW)

    dispatcher.dispatch({
        type: Actions.UPDATE_CURRENT_FORM_STATUS,
        status: StatusEnum.NEEDS_USER_REVIEW
    })

    dispatcher.dispatch({
        type: `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.FULFILLED}`,
        request: formData
    })

    clearFormFooterMessage()
    clearCurrentForm()
    postSuccessMessage()
}

// called when a user is finished editing their form
export async function submitCurrentFormForApproval(formData) {
    dispatcher.dispatch({
        type: `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.PENDING}`
    })
    postFormFooterMessage('Saving your changes ...', 'info')

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

    clearFormFooterMessage()
    clearCurrentForm()
    postSuccessMessage()
}

// called when an admin approves the current form for archival
export async function archiveCurrentForm(formData) {
    dispatcher.dispatch({
        type: `${Actions.ARCHIVE_CURRENT_FORM}${Actions.PENDING}`
    })
    postFormFooterMessage('Archiving the form ...', 'info')

    dispatcher.dispatch({
        type: Actions.FINALIZE_CURRENT_FORM
    })

    // create and submit each PDF to the server
    const pdfBuffers = await currentFormToPDF(formData);

    for(let i = 0; i < pdfBuffers.length; i++) {
        const folderName = `${formData.batchData.departmentNumber} - ${formData.batchData.departmentName}`
        const fileName = `${formData.boxes[i].objectNumber}.pdf`
        await Dao.saveFormPdfToSever(pdfBuffers[i], folderName, fileName)

        // ceate a metadata object and save the data to library
        const fieldObject = {}
        fieldObject.Date_x0020_of_x0020_Prep_x002e_ = formData.batchData.dateOfPreparation
        fieldObject.Dept_x0020__x0023_ = formData.batchData.departmentNumber
        fieldObject.Description0 = formatLongStringForSaveKey(formData.boxes[i].description)
        fieldObject.Date_x0020_From = formData.boxes[i].beginningRecordsDate
        fieldObject.Date_x0020_To = formData.boxes[i].endRecordsDate
        await Dao.saveFormMetadata(fileName, folderName, fieldObject)
    }

    // after archiving the form pdf and metadata, delete the form from the pending requests lists
    Dao.deleteForm(formData)

    // after archiving the form, update the next object number for the next batch of submissions
    saveNextObjectNumberToServer()

    dispatcher.dispatch({
        type: Actions.UPDATE_CURRENT_FORM_STATUS,
        status:  StatusEnum.APPROVED
    })

    dispatcher.dispatch({
        type: `${Actions.ARCHIVE_CURRENT_FORM}${Actions.FULFILLED}`,
        request: formData
    })

    clearFormFooterMessage()
    clearCurrentForm()
    postSuccessMessage()
}


export function cacheRetentionCategories(retentionCategories) {
    dispatcher.dispatch({
        type: Actions.CACHE_RETENTION_CATEGORIES,
        retentionCategories
    })
}
