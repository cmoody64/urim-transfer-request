import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher.js'
import * as Actions from '../actions/constants.js'

// private data that will not be exposed through the appStore singleton
let _userPermissionError = null
let _isShowingSuccessMessage = false


const AppStore = Object.assign({}, EventEmitter.prototype, {
        getUserPermissionError() {
            return _userPermissionError
        },

        isShowingSuccessMessage() {
            return _isShowingSuccessMessage
        },

        handleActions(action) {
            switch(action.type) {
                case Actions.POST_USER_PERMISSON_ERROR:
                    _userPermissionError = action.errorMessage
                    this.emit('change')
                    break
                case Actions.CLEAR_USER_PERMISSION_ERROR:
                    _userPermissionError = null
                    this.emit('change')
                    break
                case Actions.POST_SUCCESS_MESSAGE:
                    _isShowingSuccessMessage = true
                    this.emit('change')
                    break
                case Actions.CLEAR_SUCCESS_MESSAGE:
                    _isShowingSuccessMessage = false
                    this.emit('change')
                    break
            }
        }
})

// when dispatcher calls handle actions, the calling context won't be App store unless it is bound
dispatcher.register(AppStore.handleActions.bind(AppStore))

export default AppStore
