import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher'
import * as Actions from '../actions/constants.js'
import { EMPTY_REQUEST } from './storeConstants.js'
import UserStore from './userStore.js'
import AdminStore from '../stores/adminStore.js'
import AppStore from '../stores/appStore.js'
import { getFormattedDateToday, getFormattedDate } from '../utils/utils.js'
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
let _retentionCategoryNames = [null]  // default retention category is null
let _retentionCategories = []
let _retentionCategoriesByFunction = {}

// private helper data
const _dateRegEx = /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/

// private methods
const _addBoxes = (number) => {
    const nextBoxNumber = _getNextHighestBoxNumber()
    for(let i = 0; i < number; i++) {
        const temp = Object.assign({}, _formData.boxGroupData)
        delete temp.numberOfBoxes
        temp.boxNumber = Number.parseInt(nextBoxNumber) + i
        _formData.boxes.push(temp)
    }
    _isDisplayBoxList = _formData.boxes.length === 1 // only display the box list by default if there is one box
}

const _prepFormForArchival = () => {
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

// calculates and stores the review date on the box passed to it if the box has the required data
const _recalculateReviewDate = (box) => {
    if(box.retention && !isNaN(box.retention)) {
        const date = new Date()
        date.setFullYear(date.getFullYear() + Number.parseInt(box.retention))
        box.reviewDate = getFormattedDate(date)
    } else {
        box.reviewDate = null
    }
}

const _applyDispositionUpdate = (box, value) => {
    if(box.retentionCategory) {
        const fullRetentionCategory = _retentionCategories.find(({ retentionCategory }) => retentionCategory === box.retentionCategory)
        if(value === 'Yes') {
            box.permanentReviewPeriod = fullRetentionCategory.permanentReviewPeriod
            box.retention = null
            box.reviewDate = null
        } else if(value === 'No') {
            box.retention = fullRetentionCategory.period
            _recalculateReviewDate(box)
            box.permanentReviewPeriod = null
        }
    } else {
        box.retention = null
        box.permanentReviewPeriod = null
        box.reviewDate = null
    }
}

const _applyRetentionCategoryUpdate = (box, value, index) => {
    const boxRetentionCategory = _retentionCategories.find(({ retentionCategory }) => retentionCategory === value)
    if(boxRetentionCategory) {
        box.permanent = boxRetentionCategory.permanent
        box.retention = boxRetentionCategory.period
        box.permanentReviewPeriod = boxRetentionCategory.permanentReviewPeriod
        if(box.permanent === 'No') _recalculateReviewDate(box)
    } else {
        box.permanent = ''
        box.retention = null
        box.permanentReviewPeriod = null
        box.reviewDate = null
    }
}

const _getNextHighestBoxNumber = () => {
    if(!_formData.boxes.length) {
        return 1
    } else {
        let highest = 1
        _formData.boxes.forEach((box) => {
            if(Number.parseInt(box.boxNumber) > highest) highest = Number.parseInt(box.boxNumber)
        })
        return highest + 1
    }
}

//public api
const CurrentFormStore = Object.assign({}, EventEmitter.prototype, {
    getFormData() {
        return _formData
    },

    getRetentionCategoryNames() {
        return _retentionCategoryNames
    },

    canAddBoxes() {
        const { boxGroupData } = _formData
        return boxGroupData.numberOfBoxes && !isNaN(boxGroupData.numberOfBoxes) && boxGroupData.numberOfBoxes > 0
            && _dateRegEx.test(boxGroupData.beginningRecordsDate) && _dateRegEx.test(boxGroupData.endRecordsDate) && boxGroupData.description
    },

    canSubmit() {
        const { batchData } = _formData

        // first check to see if there are boxes added
        if(!_formData.boxes.length) {
            return false
        }

        // next check to see if all required batch data filds are present
        if(!(batchData.departmentNumber && batchData.departmentName && batchData.departmentPhone && batchData.prepPersonName
            && batchData.responsablePersonName && batchData.departmentAddress && _dateRegEx.test(batchData.dateOfPreparation))) {
                return false
        }

        for(var box of _formData.boxes) {
            if(!(box.boxNumber && box.description && !isNaN(box.boxNumber) && _dateRegEx.test(box.beginningRecordsDate) && _dateRegEx.test(box.endRecordsDate))) {
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
                _isDisplayBoxList = _formData.boxes.length === 1 // only display the box list by default if there is one box
                this.emit('change')
                break
            case Actions.DISPLAY_NEW_REQUEST_FORM:
                _isDisplayForm = true
                _formData = JSON.parse(JSON.stringify(EMPTY_REQUEST))
                _formData.batchData.prepPersonName = UserStore.getCurrentUser()
                _formData.batchData.submitterEmail = UserStore.getCurrentUserEmail()
                _formData.batchData.dateOfPreparation = getFormattedDateToday()
                _formData.boxGroupData.numberOfBoxes = 1
                if(action.departmentInfo) {
                    _formData.batchData.departmentName = action.departmentInfo.departmentName
                    _formData.batchData.departmentNumber = action.departmentInfo.departmentNumber
                    _formData.batchData.departmentPhone = action.departmentInfo.departmentPhone
                    _formData.batchData.departmentAddress = action.departmentInfo.departmentAddress
                    _formData.batchData.responsablePersonName = action.departmentInfo.responsiblePersonName
                    _formData.batchData.departmentCollege = action.departmentInfo.departmentCollege
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
                if(action.id === 'retention' || action.id === 'endRecordsDate') _recalculateReviewDate(_formData.boxGroupData)
                if(action.id === 'permanent') _applyDispositionUpdate(_formData.boxGroupData, action.newValue)
                if(action.id === 'retentionCategory') _applyRetentionCategoryUpdate(_formData.boxGroupData, action.newValue)
                this.emit('change')
                break
            case Actions.UPDATE_FORM_SINGLE_BOX_DATA:
                _formData.boxes[action.index][action.id] = action.newValue
                // specialized functions for if a value with dependend autocalculated values changes
                if(action.id === 'retention') _recalculateReviewDate(_formData.boxes[action.index])
                if(action.id === 'permanent') _applyDispositionUpdate(_formData.boxes[action.index], action.newValue)
                if(action.id === 'retentionCategory') _applyRetentionCategoryUpdate(_formData.boxes[action.index], action.newValue)
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
            case Actions.REMOVE_BOX_FROM_CURRENT_FORM:
                _formData.boxes.splice(action.index, 1)
                _isDisplayBoxList = _formData.boxes.length === 1 // only display the box list by default if there is one box
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
            case Actions.FINALIZE_CURRENT_FORM: //adds object number, approver, and approvedData fields to each box
                _prepFormForArchival()
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
            case Actions.CACHE_RETENTION_CATEGORIES:
                _retentionCategoriesByFunction = action.retentionCategories // store full object of keyed functions to retCat lists
                //_retentionCategories.push(...action.retentionCategories)
                //_retentionCategoryNames.push(..._retentionCategories.map(({ retentionCategory }) => retentionCategory).sort())
                this.emit('change')
                break
            case Actions.CHOOSE_FUNCTION:
                if(action.functionName) {
                    _retentionCategories.push(..._retentionCategoriesByFunction[action.functionName])
                    _retentionCategoryNames.push(..._retentionCategories.map(({ retentionCategory }) => retentionCategory).sort())
                } else {
                    _retentionCategories.length = 0 // clear the array
                    _retentionCategoryNames.length = 0 // clear the array
                }
                this.emit('change')
                break
        }
    }
})

dispatcher.register(CurrentFormStore.handleActions.bind(CurrentFormStore))

export default CurrentFormStore
