import dispatcher from '../dispatcher/dispatcher'
import {
    CACHE_USERNAME,
    CACHE_ADMIN_STATUS,
    CACHE_USER_PENDING_REQUESTS,
    CACHE_USER_REQUESTS_AWAITING_REVIEW,
    CACHE_USER_DEPARTMENT,
    OPEN_NEW_REQUEST_DEPARTMENT_SELECTION,
    CLOSE_NEW_REQUEST_DEPARTMENT_SELECTION
} from './constants.js'

export function cacheCurrentUsername(username) {
    dispatcher.dispatch({
        type: CACHE_USERNAME,
        username
    })
}

export function cacheCurrentAdminStatus(adminStatus) {
    dispatcher.dispatch({
        type: CACHE_ADMIN_STATUS,
        adminStatus
    })
}

export function cacheUserPendingRequests(requests) {
    dispatcher.dispatch({
        type: CACHE_USER_PENDING_REQUESTS,
        requests
    })
}

export function cacheUserRequestsAwaitingReview(requests) {
    dispatcher.dispatch({
        type: CACHE_USER_REQUESTS_AWAITING_REVIEW,
        requests
    })
}

export function cacheUserDepartment(department) {
    dispatcher.dispatch({
        type: CACHE_USER_DEPARTMENT,
        department
    })
}

export function openNewRequestDepartmentSelection() {
    dispatcher.dispatch({
        type: OPEN_NEW_REQUEST_DEPARTMENT_SELECTION
    })
}

export function closeNewRequestDepartmentSelection() {
    dispatcher.dispatch({
        type: CLOSE_NEW_REQUEST_DEPARTMENT_SELECTION
    })
}
