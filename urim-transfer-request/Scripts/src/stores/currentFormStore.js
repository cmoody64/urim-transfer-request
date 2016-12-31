import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher'
import * as Actions from '../actions/constants.js'
import { EMPTY_REQUEST } from './storeConstants.js'
import UserStore from './userStore.js'
import AdminStore from '../stores/adminStore.js'
import { getFormattedDateToday } from '../utils/utils.js'
import SettingsStore from '../stores/settingsStore.js'
import { incrementObjectNumber } from '../utils/utils.js'

// private data that will not be exposed through the currentFormStore singleton
let _formData = EMPTY_REQUEST
let _isDisplayForm = false
let _isSubmissionAttempted = false
let _isAddBoxesAtttempted = false
let _isDisplayBoxList = false
let _canAdminReturnToUser = false
let _isDisplayCommentInput = false
let _uncachedAdminComments
let _isSubmittingToServer = false
let _formFooterMessage = null

// private helper data
const _dateRegEx = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/

// private methods
const _addBoxes = (number) => {
    for(let i = 0; i < number; i++) {
        const temp = Object.assign({}, _formData.boxGroupData)
        delete temp.numberOfBoxes
        temp.boxNumber = i + 1
        _formData.boxes.push(temp)
    }
}

const _addApprovalStampToBoxes = () => {
    let nextObjectNumber = SettingsStore.getNextObjectNumber()
    const username = UserStore.getCurrentUser()
    const date = getFormattedDateToday()

    _formData.boxes.forEach((box, index) => {
        box.objectNumber = nextObjectNumber
        box.approver = username
        box.approvalDate = date
        nextObjectNumber = incrementObjectNumber(nextObjectNumber)
    })
}

//public api
const CurrentFormStore = Object.assign({}, EventEmitter.prototype, {
    getFormData() {
        return _formData
    },

    canAddBoxes() {
        const { boxGroupData } = _formData
        return boxGroupData.numberOfBoxes && _dateRegEx.test(boxGroupData.beginningRecordsDate) && _dateRegEx.test(boxGroupData.endRecordsDate) && boxGroupData.description
    },

    canSubmit() {
        const { batchData } = _formData

        // first check to see if all required batch data filds are present
        if(!(batchData.departmentNumber && batchData.departmentName && batchData.departmentPhone && batchData.prepPersonName
            && batchData.responsablePersonName && batchData.departmentAddress && _dateRegEx.test(batchData.dateOfPreparation))) {
                return false
        }

        // mext check that each box has the required fields present
        // _formData.boxes.forEach((box, index) => {
        //     if(!(box.boxNumber && _dateRegEx.test(box.beginningRecordsDate) && _dateRegEx.test(box.endRecordsDate))) {
        //         return false
        //     }
        // })

        for(var box of _formData.boxes) {
            if(!(box.boxNumber && _dateRegEx.test(box.beginningRecordsDate) && _dateRegEx.test(box.endRecordsDate))) {
                return false
            }
        }


        return true
    },

    isDisplayForm() {
        return _isDisplayForm
    },

    isSubmissionAttempted() {
        return _isSubmissionAttempted
    },

    isDisplayBoxList() {
        return _isDisplayBoxList
    },

    isAddBoxesAttempted() {
        return _isAddBoxesAtttempted
    },

    canAdminReturnToUser() {
        return _canAdminReturnToUser
    },

    isDisplayCommentInput() {
        return _isDisplayCommentInput
    },

    getUncachedAdminComments() {
        return _uncachedAdminComments
    },

    isSubmittingToServer() {
        return _isSubmittingToServer
    },

    getFormFooterMessage() {
        return _formFooterMessage
    },

    getHighestObjectNumber() {
        return _formData.boxes[_formData.boxes.length-1].objectNumber
    },

    handleActions(action) {
        switch(action.type) {
            case Actions.DISPLAY_REQUEST_FORM:
                _isDisplayForm = true
                // the request is deep copied into form data so that editing does not change the request
                // once a request is submittied (not closed) the old request will be updated
                _formData = JSON.parse(JSON.stringify(action.request))
                this.emit('change')
                break
            case Actions.DISPLAY_NEW_REQUEST_FORM:
                _isDisplayForm = true
                _formData = JSON.parse(JSON.stringify(EMPTY_REQUEST))
                _formData.batchData.prepPersonName = UserStore.getCurrentUser()
                _formData.batchData.dateOfPreparation = getFormattedDateToday()
                if(action.departmentInfo) {
                    _formData.batchData.departmentName = action.departmentInfo.departmentName
                    _formData.batchData.departmentNumber = action.departmentInfo.departmentNumber
                    _formData.batchData.departmentPhone = action.departmentInfo.departmentPhone
                    _formData.batchData.departmentAddress = action.departmentInfo.departmentAddress
                    _formData.batchData.responsablePersonName = action.departmentInfo.responsiblePersonName
                }
                this.emit('change')
                break
            case Actions.MARK_SUBMISSION_ATTEMPTED:
                _isSubmissionAttempted = true
                this.emit('change')
                break
            case Actions.MARK_ADD_BOXES_ATTEMPTED:
                _isAddBoxesAtttempted = true
                this.emit('change')
                break
            case Actions.CLEAR_CURRENT_FORM:
                _formData = EMPTY_REQUEST
                _isDisplayForm = false
                _isSubmissionAttempted = false
                _isAddBoxesAtttempted = false
                _isDisplayBoxList = false
                _canAdminReturnToUser = false
                _isDisplayCommentInput = false
                _uncachedAdminComments = null
                _isSubmittingToServer = false
                _formFooterMessage = null
                this.emit('change')
                break
            case Actions.UPDATE_FORM_BATCH_DATA:
                _formData.batchData[action.id] = action.newValue
                this.emit('change')
                break
            case Actions.UPDATE_FORM_BOX_GROUP_DATA:
                _formData.boxGroupData[action.id] = action.newValue
                this.emit('change')
                break
            case Actions.UPDATE_FORM_ADMIN_COMMENTS:
                _uncachedAdminComments = action.newValue
                this.emit('change')
                break
            case Actions.TOGGLE_BOX_LIST_VISIBILTY:
                _isDisplayBoxList = !_isDisplayBoxList
                this.emit('change')
                break
            case Actions.ADD_BOXES_TO_REQUEST:
                _addBoxes(action.number)
                this.emit('change')
                break
            case Actions.UPDATE_FORM_SINGLE_BOX_DATA:
                _formData.boxes[action.index][action.id] = action.newValue
                this.emit('change')
                break
            case Actions.REMOVE_BOX_FROM_CURRENT_FORM:
                _formData.boxes.splice(action.index, 1)
                this.emit('change')
                break
            case Actions.UPDATE_CURRENT_FORM_STATUS:
                _formData.status = action.status
                this.emit('change')
                break
            case Actions.DISPLAY_COMMENT_INPUT:
                _canAdminReturnToUser = true
                _isDisplayCommentInput = true
                this.emit('change')
                break
            case Actions.REMOVE_ADMIN_COMMENT:
                _formData.adminComments = null
                this.emit('change')
                break
            case Actions.POST_FORM_FOOTER_MESSAGE:
                _formFooterMessage = {
                    text: action.text,
                    style: action.style,
                    duration: action.duration
                }
                this.emit('change')
                break
            case Actions.ADD_APPROVAL_STAMP_TO_CURRENT_FORM: //adds object number, approver, and approvedData fields to each box
                _addApprovalStampToBoxes()
                this.emit('change')
                break
            case Actions.CLEAR_FORM_FOOTER_MESSAGE:
                _formFooterMessage = null
                this.emit('change')
                break
            case `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.PENDING}`:
                _formData.adminComments = _uncachedAdminComments
                _isSubmittingToServer = true
                this.emit('change')
                break
            case `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.PENDING}`:
            case `${Actions.ARCHIVE_CURRENT_FORM}${Actions.PENDING}`:
                _isSubmittingToServer = true
                this.emit('change')
                break
        }
    }
})

dispatcher.register(CurrentFormStore.handleActions.bind(CurrentFormStore))

export default CurrentFormStore
