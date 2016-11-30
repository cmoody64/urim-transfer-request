import dispatcher from '../dispatcher/dispatcher'
import * as dao from '../dataAccess/dataAccess.js'
import {
    FETCHING_STARTUP_DATA,
    RETRIEVED_STARTUP_DATA,
    POST_SUCCESS_MESSAGE,
    CLEAR_SUCCESS_MESSAGE,
    POST_USER_PERMISSON_ERROR,
    CLEAR_USER_PERMISSION_ERROR,
} from './constants.js'
import {
    cacheCurrentUsername,
    cacheCurrentAdminStatus,
    cacheUserPendingRequests,
    cacheUserRequestsAwaitingReview
} from './userActionCreators.js'
import {
    cacheAdminPendingRequests
} from './adminActionCreators.js'
import { simpleAdminPendingRequests_TEST, simpleUserPendingRequests_TEST, simpleUserAwaitingRequests_TEST } from '../test/dummyStore.js'
import { StatusEnum } from '../stores/storeConstants.js'

// asyncronously fetches app data:
//  1) user and user metadata (admin status)
//  2) user specific pending requests
//  3) if the user is an admin, all requests awaiting approval are fetched
export async function fetchStartupData() {
    debugger
    dispatcher.dispatch({type: FETCHING_STARTUP_DATA})

    const userData = await dao.getCurrentUser()
    const username = userData.d.Title

    //const adminData = await dao.searchUserInAdminList(username)
    // if a filtered query of the username in the admin list has no results, the user is not an admin
    //const adminStatus = adminData.d.results && adminData.d.results.length || username === 'Connor Moody'

    //const username = 'Connor Moody'
    const adminStatus = false

    // dispatches actions to cache username and adminStatus
    cacheCurrentUsername(username)
    cacheCurrentAdminStatus(adminStatus)

    // fetch user specific pending requests
    const userPendingrequests = await dao.fetchUserPendingRequests(username)
    cacheUserPendingRequests(userPendingrequests)
    //cacheUserPendingRequests(simpleUserPendingRequests_TEST)

    const userRequestsAwaitingReview = await dao.fetchUserRequestsAwaitingReview(username)
    cacheUserRequestsAwaitingReview(userRequestsAwaitingReview)
    //cacheUserRequestsAwaitingReview(simpleUserAwaitingRequests_TEST)

    // for admins, fetch all requests awaiting approval
    if(adminStatus) {
        const adminPendingRequests = await dao.fetchAdminPendingRequests()
        cacheAdminPendingRequests(adminPendingRequests)
    }
}

export function postSuccessMessage() {
    dispatcher.dispatch({
        type: POST_SUCCESS_MESSAGE
    })
}

export function clearSuccessMessage() {
    dispatcher.dispatch({
        type: CLEAR_SUCCESS_MESSAGE,
    })
}

export function postUserPermissionError() {
    dispatcher.dispatch({
        type: POST_USER_PERMISSON_ERROR
    })
}

export function clearUserPermissionError() {
    dispatcher.dispatch({
        type: CLEAR_USER_PERMISSION_ERROR
    })
}
