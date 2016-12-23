import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher.js'
import * as Actions from '../actions/constants.js'
import CurrentFormStore from '../stores/currentFormStore.js'

// private data that will not be exposed through the adminStore singleton
let _adminPendingRequests = []
let _lastArchivedBoxNumber

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
const AdminStore = Object.assign({}, EventEmitter.prototype, {
    getAdminPendingRequests() {
        return _adminPendingRequests
    },

    getLastArchivedBoxNumber() {
        return 0
    },

    handleActions(action) {
        switch(action.type) {
            case Actions.CACHE_ADMIN_PENDING_REQUESTS:
                _adminPendingRequests.push(...action.requests)
                this.emit('change')
                break
            case `${Actions.SUBMIT_CURRENT_FORM_FOR_APPROVAL}${Actions.FULFILLED}`:
                _adminPendingRequests.push(action.request)
                this.emit('change')
                break
            case `${Actions.RETURN_CURRENT_FORM_TO_USER}${Actions.FULFILLED}`:
                _removeFromListById(_adminPendingRequests, action.request.spListId)
                this.emit('change')
                break
            case `${Actions.ARCHIVE_CURRENT_FORM}${Actions.FULFILLED}`:
                _removeFromListById(_adminPendingRequests, action.request.spListId)
                this.emit('change')
                break
        }
    }
})

dispatcher.register(AdminStore.handleActions.bind(AdminStore))

export default AdminStore
