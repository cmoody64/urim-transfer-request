import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher'
import * as Actions from '../actions/constants.js'
 import { EMPTY_REQUEST } from './storeConstants.js'


// private data that will not be exposed through the currentFormStore singleton
let _formData = EMPTY_REQUEST
let _canAddBoxes = false
let _canSubmit = false
let _isDisplayForm = false
let _isSubmissionAttempted = false
let _isAddBoxesAtttempted = false
let _isDisplayBoxList = false
let _canAdminReturnToUser = false
let _isDisplayCommentInput = false
let _uncachedAdminComments

// private methods
const _addBoxes = (number) => {
    for(let i = 0; i < number; i++) {
        const temp = Object.assign({}, _formData.boxGroupData)
        delete temp.numberOfBoxes
        _formData.boxes.push(temp)
    }
}

//public api
const CurrentFormStore = Object.assign({}, EventEmitter.prototype, {
    getFormData() {
        return _formData
    },

    canAddBoxes() {
        return true
        //return _canAddBoxes
    },

    canSubmit() {
        //return _canSubmit
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
                _canAddBoxes = false
                _canSubmit = false
                _isDisplayForm = false
                _isSubmissionAttempted = false
                _isAddBoxesAtttempted = false
                _isDisplayBoxList = false
                _canAdminReturnToUser = false
                _isDisplayCommentInput = false
                _uncachedAdminComments = null
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
            case Actions.UPDATE_CURRENT_FORM_STATUS:
                _formData.status = action.status
                this.emit('change')
                break
            case Actions.DISPLAY_COMMENT_INPUT:
                _canAdminReturnToUser = true
                _isDisplayCommentInput = true
                this.emit('change')
                break
            case `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.PENDING}`:
                _formData.adminComments = _uncachedAdminComments
                break
            case Actions.REMOVE_ADMIN_COMMENT:
                _formData.adminComments = null
                this.emit('change')
                break
        }
    }
})

dispatcher.register(CurrentFormStore.handleActions.bind(CurrentFormStore))

export default CurrentFormStore
