import dispatcher from '../dispatcher/dispatcher'
import * as dao from '../dataAccess/dataAccess.js'
import {
    FETCHING_STARTUP_DATA,
    RETRIEVED_STARTUP_DATA
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

// asyncronously fetches app data:
//  1) user and user metadata (admin status)
//  2) user specific pending requests
//  3) if the user is an admin, all requests awaiting approval are fetched
export async function fetchStartupData() {
    dispatcher.dispatch({type: FETCHING_STARTUP_DATA})
/*
    let userData = await dao.getCurrentUser()
    const username = userData.d.Title

    let adminData = await dao.SearchUserInAdminList(username)
    // if a filtered query of the username in the admin list has no results, the user is not an admin
    const adminStatus = adminData.d.results && adminData.d.results.length || username === 'Connor Moody'
*/
    const username = 'Connor Moody'
    const adminStatus = true

    // dispatches actions to cache username and adminStatus
    cacheCurrentUsername(username)
    cacheCurrentAdminStatus(adminStatus)

    // fetch user specific pending requests
    // let requestData = dao.getUserPendings(username) REMOVED FOR TESTING
    // const userPendingrequests = requestData.d.results REMOVED FOR TESTING
    cacheUserPendingRequests(simpleUserPendingRequests_TEST)

    // let requestData = dao.getUserRequestsAwaitingReview(username) REMOVED FOR TESTING
    // const userRequestsAwaitingReview = requestData.d.results REMOVED FOR TESTING
    cacheUserRequestsAwaitingReview(simpleUserAwaitingRequests_TEST)

    // for admins, fetch all requests awaiting approval
    if(adminStatus) {
        // let adminRequestData = dao.getAdminPendingRequests() REMOVED FOR TESTING
        // const adminPendingRequests = adminRequestData.d.results REMOVED FOR TESTING
        cacheAdminPendingRequests(simpleAdminPendingRequests_TEST)
    }
}
