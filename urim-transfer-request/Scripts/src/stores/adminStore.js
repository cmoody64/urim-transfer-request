import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher.js'
import { CACHE_ADMIN_PENDING_REQUESTS } from '../actions/constants.js'

// private data that will not be exposed through the adminStore singleton
let _adminPendingRequests = []

// public api
const AdminStore = Object.assign({}, EventEmitter.prototype, {
    getAdminPendingRequests() {
        return _adminPendingRequests
    },

    handleActions(action) {
        switch(action.type) {
            case CACHE_ADMIN_PENDING_REQUESTS:
                _adminPendingRequests.push(...action.requests)
                this.emit('change')
                break
        }
    }
})

dispatcher.register(AdminStore.handleActions.bind(AdminStore))

export default AdminStore
