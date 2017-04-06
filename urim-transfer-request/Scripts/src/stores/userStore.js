import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher'
import * as Actions from '../actions/constants'
import CurrentFormStore from '../stores/currentFormStore.js'
import { StatusEnum } from '../stores/storeConstants.js'

// private data that will not be exposed through the userStore singleton
let _currentUser = ""
let _currentUserEmail = ""
let _isAdmin = false
const _userPendingRequests = []  // holds requests that are pending user action (need user review)
const _userRequestsAwaitingReview = [] // holds requests that are pending admin action (awaiting admin approval)
const _userDepartments = [] // holds the department numbers of each department for which the user is a record liaison
let _isNewRequestDepartmentSelection = false

// private helper functions
const _removeFromListById = function(list, id) {
    let indexToRemove = Number.MAX_SAFE_INTEGER // init the indexToRemove as the max number so that if it is not replaced, it won't remove anything from the list
    list.forEach((request, index) => {
        if(request.spListId === id) {
            indexToRemove = index
        }
    })
    list.splice(indexToRemove, 1)
}


// public api
const UserStore = Object.assign({}, EventEmitter.prototype, {
    getCurrentUser() {
        return _currentUser
    },

    getCurrentUserEmail() {
        return _currentUserEmail
    },

    isAdminLoggedIn() {
        return _isAdmin
    },

    isNewRequestDepartmentSelection() {
        return _isNewRequestDepartmentSelection
    },

    getUserDepartments() {
        return _userDepartments
    },

    getUserPendingRequests() {
        return _userPendingRequests
    },

    getUserRequestsAwaitingReview() {
        return _userRequestsAwaitingReview
    },

    handleActions(action) {
        switch(action.type) {
            case Actions.CACHE_USERNAME:
                _currentUser = action.username
                this.emit('change')
                break
            case Actions.CACHE_EMAIL:
                _currentUserEmail = action.email
                this.emit('change')
                break
            case Actions.CACHE_ADMIN_STATUS:
                _isAdmin = action.adminStatus
                this.emit('change')
                break
            case Actions.CACHE_USER_PENDING_REQUESTS:
                _userPendingRequests.push(...action.requests)
                this.emit('change')
                break
            case Actions.CACHE_USER_REQUESTS_AWAITING_REVIEW:
                _userRequestsAwaitingReview.push(...action.requests)
                this.emit('change')
                break
            case `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.FULFILLED}`:
                _removeFromListById(_userPendingRequests, action.request.spListId)  // check both lists to remove and replace the request
                _removeFromListById(_userRequestsAwaitingReview, action.request.spListId)
                _userRequestsAwaitingReview.push(action.request) // no matter what list the request was on previously, its status will always be 'awaiting admin approval' after an edit
                this.emit('change')
                break
            case `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.FULFILLED}`:
                _removeFromListById(_userRequestsAwaitingReview, action.request.spListId)
                _userPendingRequests.push(action.request)
                this.emit('change')
                break
            case `${Actions.ARCHIVE_CURRENT_FORM}${Actions.FULFILLED}`:
                _removeFromListById(_userRequestsAwaitingReview, action.request.spListId)
                this.emit('change')
                break
            case Actions.CACHE_USER_DEPARTMENT:
                _userDepartments.push(action.department)
                this.emit('change')
                break
            case Actions.OPEN_NEW_REQUEST_DEPARTMENT_SELECTION:
                _isNewRequestDepartmentSelection = true
                this.emit('change')
                break
            case Actions.CLOSE_NEW_REQUEST_DEPARTMENT_SELECTION:
                _isNewRequestDepartmentSelection = false
                this.emit('change')
                break
            case Actions.DELETE_CURRENT_FORM:
                if(action.status === StatusEnum.WAITING_ON_ADMIN_APPROVAL) _removeFromListById(_userRequestsAwaitingReview, action.spListId)
                if(action.status === StatusEnum.NEEDS_USER_REVIEW) _removeFromListById(_userPendingRequests, action.spListId)
                this.emit('change')
                break
        }
    }
})

// when dispatcher calls handle actions, the calling context won't be Number store unless it is bound
dispatcher.register(UserStore.handleActions.bind(UserStore))

export default UserStore
