import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/dispatcher.js'
import * as Actions from '../actions/constants.js'
import { incrementObjectNumber } from '../utils/utils.js'

// private data that will not be exposed through the settingsStore singleton
let _nextObjectNumber

// public api
const SettingsStore = Object.assign({}, EventEmitter.prototype, {
    getNextObjectNumber() {
        return _nextObjectNumber
    },

    handleActions(action) {
        switch(action.type) {
            case Actions.CACHE_NEXT_OBJECT_NUMBER:
                _nextObjectNumber = action.objectNumber
                this.emit('change')
                break
            case Actions.INCREMENT_NEXT_OBJECT_NUMBER:
                _nextObjectNumber = incrementObjectNumber(_nextObjectNumber)
                break
        }
    }
})

dispatcher.register(SettingsStore.handleActions.bind(SettingsStore))

export default SettingsStore