import dispatcher from '../dispatcher/dispatcher'
import { CACHE_ADMIN_PENDING_REQUESTS } from './constants.js'

export function cacheAdminPendingRequests(requests) {
    dispatcher.dispatch({
        type: CACHE_ADMIN_PENDING_REQUESTS,
        requests
    })
}
