import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher'
import {
    DISPLAY_REQUEST_FORM,
    CLEAR_CURRENT_FORM,
    MARK_SUBMISSION_ATTEMPTED,
    UPDATE_FORM_BATCH_DATA,
    UPDATE_FORM_BOX_GROUP_DATA,
    TOGGLE_BOX_LIST_VISIBILTY
 } from '../actions/constants.js'
 import { EMPTY_REQUEST } from './storeConstants.js'


// private data that will not be exposed through the currentFormStore singleton
let _formData = EMPTY_REQUEST
let _canAddBoxes = false
let _canSubmit = false
let _isDisplayForm = false
let _isSubmissionAttempted = false
let _isDisplayBoxList = false

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
        return _canSubmit
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

    handleActions(action) {
        switch(action.type) {
            case DISPLAY_REQUEST_FORM:
                _isDisplayForm = true
                // the request is deep copied into form data so that editing does not change the request
                // once a request is submittied (not closed) the old request will be updated
                _formData = JSON.parse(JSON.stringify(action.request))
                this.emit('change')
                break
            case MARK_SUBMISSION_ATTEMPTED:
                _isSubmissionAttempted = true
                this.emit('change')
                break
            case CLEAR_CURRENT_FORM:
                _formData = EMPTY_REQUEST
                _canAddBoxes = false
                _canSubmit = false
                _isDisplayForm = false
                _isSubmissionAttempted = false
                _isDisplayBoxList = false
                this.emit('change')
                break
            case UPDATE_FORM_BATCH_DATA:
                _formData.batchData[action.id] = action.newValue
                this.emit('change')
                break
            case UPDATE_FORM_BOX_GROUP_DATA:
                _formData.boxGroupData[action.id] = action.newValue
                this.emit('change')
                break
            case TOGGLE_BOX_LIST_VISIBILTY:
                _isDisplayBoxList = !_isDisplayBoxList
                this.emit('change')
                break
        }
    }
})

dispatcher.register(CurrentFormStore.handleActions.bind(CurrentFormStore))

export default CurrentFormStore
