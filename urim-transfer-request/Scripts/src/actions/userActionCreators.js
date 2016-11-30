import dispatcher from '../dispatcher/dispatcher'
import {
    CACHE_USERNAME,
    CACHE_ADMIN_STATUS,
    CACHE_USER_PENDING_REQUESTS,
    CACHE_USER_REQUESTS_AWAITING_REVIEW
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
