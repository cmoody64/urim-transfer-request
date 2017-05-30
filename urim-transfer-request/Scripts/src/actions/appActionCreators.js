import dispatcher from '../dispatcher/dispatcher'
import * as dao from '../dataAccess/dataAccess.js'
import {
    FETCHING_STARTUP_DATA,
    RETRIEVED_STARTUP_DATA,
    POST_SUCCESS_MESSAGE,
    CLEAR_SUCCESS_MESSAGE,
    POST_USER_PERMISSON_ERROR,
    CLEAR_USER_PERMISSION_ERROR
} from './constants.js'
import { transformDepartmentDataToDto, transformRetentionDataToDto, transformRetentionDataToFullDto } from '../utils/utils.js'
import {
    cacheCurrentUsername,
    cacheCurrentUserIdentifier,
    cacheCurrentAdminStatus,
    cacheUserPendingRequests,
    cacheUserRequestsAwaitingReview,
    cacheUserDepartment,
    cacheCurrentUserEmail
} from './userActionCreators.js'
import {
    cacheAdminPendingRequests
} from './adminActionCreators.js'
import { simpleAdminPendingRequests_TEST, simpleUserPendingRequests_TEST, simpleUserAwaitingRequests_TEST } from '../test/dummyStore.js'
import { StatusEnum } from '../stores/storeConstants.js'
import { cacheNextObjectNumber } from '../actions/settingsActionCreators.js'
import { DEFAULT_OBJECT_NUMBER } from '../stores/storeConstants.js'
import { cacheRetentionCategories, cacheFullRetentionCategories } from '../actions/currentFormActionCreators.js'
import { incrementObjectNumber } from '../utils/utils.js'

// asyncronously fetches app data:
//  1) user and user metadata (admin status)
//  2) user specific pending requests
//  3) if the user is an admin, all requests awaiting approval are fetched
//  4) user specific form presets such as dep. info and record category info
//         - these items are backed by data stored in dynamic sharepoint lists, meaning
//           it must be fetched on app startup
export async function fetchStartupData() {

    dispatcher.dispatch({type: FETCHING_STARTUP_DATA})

    // fetch the username
    const userData = await dao.getCurrentUser()
    const username = userData.d.Title // extract name from user info
    cacheCurrentUsername(username)
    const email = userData.d.email
    cacheCurrentUserEmail(email)
    const identifier = extractUsernameFromLoginName(userData.d.LoginName)
    cacheCurrentUserIdentifier(identifier)

    // fetch the administrative status of the user
    const adminData = await dao.searchUserInAdminList(username)
        // if a filtered query of the username in the admin list has no results, the user is not an admin
    const adminStatus = adminData.d.results && adminData.d.results.length
    cacheCurrentAdminStatus(adminStatus)

    // fetch the departments for which the user is a record liaison (form presets)
    const userDepartmentData = await dao.getUserDepartments(identifier)
    userDepartmentData.d.results.forEach((element, index) => {
        cacheUserDepartment(transformDepartmentDataToDto(element))
    })

    // fetch the record category info for the retention drop down on the form (form preset)
    const retentionCategoryData = await dao.getRetentionCategoryData()
    cacheRetentionCategories(transformRetentionDataToDto(retentionCategoryData))
    cacheFullRetentionCategories(transformRetentionDataToFullDto(retentionCategoryData))

    // fetch user specific pending requests
    const userPendingrequests = await dao.fetchUserPendingRequests(username)
    cacheUserPendingRequests(userPendingrequests)

    const userRequestsAwaitingReview = await dao.fetchUserRequestsAwaitingReview(username)
    cacheUserRequestsAwaitingReview(userRequestsAwaitingReview)

    // for admins, fetch all requests awaiting approval and admin metadata (lastArchivedObjectNumber)
    if(adminStatus) {
        // admin pending requests
        const adminPendingRequests = await dao.fetchAdminPendingRequests()
        cacheAdminPendingRequests(adminPendingRequests)

        // last archived object number
        const objectNumberData = await dao.fetchNextArchivedObjectNumber()
        const nextArchivedObjectNumber = objectNumberData.d.results[0] ? objectNumberData.d.results[0].Title : DEFAULT_OBJECT_NUMBER
        cacheNextObjectNumber(nextArchivedObjectNumber)
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

export function postUserPermissionError(errorMessage) {
    dispatcher.dispatch({
        type: POST_USER_PERMISSON_ERROR,
        errorMessage
    })
}

export function clearUserPermissionError() {
    dispatcher.dispatch({
        type: CLEAR_USER_PERMISSION_ERROR
    })
}

function extractUsernameFromLoginName(loginName) {
    if(loginName.includes("\\")) {
        return loginName.split("\\")[1]
    } else if(loginName.includes("|")) {
        return loginName.split("|")[1]
    } else return ""
}