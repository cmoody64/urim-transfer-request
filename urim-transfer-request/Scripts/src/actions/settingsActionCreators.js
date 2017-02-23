import dispatcher from '../dispatcher/dispatcher'
import * as Actions from './constants.js'
import * as dao from '../dataAccess/dataAccess.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { DEFAULT_OBJECT_NUMBER } from '../stores/storeConstants.js'
import SettingsStore from '../stores/settingsStore.js'
import { incrementObjectNumber } from '../utils/utils.js'

export function cacheNextObjectNumber(objectNumber) {
    dispatcher.dispatch({
        type: Actions.CACHE_NEXT_OBJECT_NUMBER,
        objectNumber
    })
}

export function incrementNextObjectNumber() {
    dispatcher.dispatch({
        type: Actions.INCREMENT_NEXT_OBJECT_NUMBER
    })
}

export async function saveNextObjectNumberToServer( objectNumber = incrementObjectNumber(CurrentFormStore.getHighestObjectNumber()) ) {
    if(SettingsStore.getNextObjectNumber() === DEFAULT_OBJECT_NUMBER) {
        await dao.saveNextObjectNumberToServer(objectNumber)
    } else {
        await dao.updateNextObjectNumberOnServer(objectNumber)
    }

    cacheNextObjectNumber(objectNumber)
}