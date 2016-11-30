import {
    getQueryStringParameter,
    transformBatchesDataToBatchesDtoList,
    transformBoxesDataToBoxesDtoList,
    generateQueryFilterString
 } from '../utils/utils.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { StatusEnum, DISPOSITION_FIELD_DEFAULT_VALUE } from '../stores/storeConstants.js'

export const hostWebUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
const appWebUrl = getQueryStringParameter('SPAppWebUrl');
const archiveLibraryUrl = '/dept-records/Transfer Request Archive'
const REQUEST_BATCH_LIST_NAME = 'Request_Batch_Objects'
const REQUEST_BOX_LIST_NAME = 'Request_Box_Objects'
const ADMIN_LIST_NAME = 'Transfer Request Administrators'
const DEP_INFO_LIST_NAME = 'Department Information'
const RECORD_LIAISON_COLUMN_NAME = 'Record_x0020_Liaison'
const DEPARTMENT_NUMBER_COLUMN_NAME = 'Department Number'

export function getCurrentUser() {
    return $.ajax({
        url: '../_api/web/currentuser?$select=Title',
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}

export function searchUserInAdminList(userName) {
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/lists/getbytitle('${ADMIN_LIST_NAME}')/items?$filter=Title eq '${userName}'&@target='${hostWebUrl}'`,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}

export function getUserDepartments(username) {
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/lists/getbytitle('${DEP_INFO_LIST_NAME}')/items?$filter=${RECORD_LIAISON_COLUMN_NAME} eq '${username}'&@target='${hostWebUrl}'`,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}

export function saveFormPdfToSever(pdfArrayBuffer, filename) {
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/getfolderbyserverrelativeurl('${archiveLibraryUrl}')/files/add(overwrite=true,url='${filename}')?@target='${hostWebUrl}'`,
        type: 'POST',
        processData: false,
        headers: {
           'accept': 'application/json;odata=verbose',
           'X-RequestDigest': jQuery('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose'
        },
        data: pdfArrayBuffer
    })
}

// high level data access function that updates a previously saved form to the server
export async function updateForm(formData, intendedStatus) {
    await updateFormBatchData(formData.batchData, formData.spListId, intendedStatus, formData.adminComments)
    for(let i = 0; i < formData.boxes.length; i++) {
        // for each box, check to see if it has previously been saved on the server, indicated by the spListId field being defined
        if(formData.boxes[i].spListId !== undefined) {  // if it has an spListId field, update the boxData
            await updateFormBoxData(formData.boxes[i], formData.spListId)
        } else {           // if it does not have an spListId field, create the boxData
            const spBoxData = await createFormBoxData(formData.boxes[i], formData.spListId)
            formData.boxes[i].spListId = spBoxData.d.Id
        }
    }
}

// helper function coupled with updateFormToServer
function updateFormBatchData(batchData, spListId, intendedStatus, adminComments) {
    return $.ajax({
        url: `../_api/web/lists/getbytitle(\'Request_Batch_Objects\')/items(${spListId})`,
        method: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
            'Accept': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        },
        data : JSON.stringify({
            __metadata: {'type': 'SP.Data.Request_x005f_Batch_x005f_ObjectsListItem'},
            Title: '_',
            prepPersonName: batchData.prepPersonName,
            departmentName: batchData.departmentName,
            dateOfPreparation: batchData.dateOfPreparation,
            departmentNumber: batchData.departmentNumber,
            departmentPhone: batchData.departmentPhone,
            responsablePersonName: batchData.responsablePersonName,
            departmentAddress: batchData.departmentAddress,
            adminComments: adminComments,
            status: intendedStatus
        })
    })
}

// helper function coupled with updateFormToServer
function updateFormBoxData(boxData, batchForeignId) {
    return $.ajax({
        url: `../_api/web/lists/getbytitle(\'Request_Box_Objects\')/items(${boxData.spListId})`,
        method: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
            'Accept': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        },
        data : JSON.stringify({
            __metadata: {'type': 'SP.Data.Request_x005f_Box_x005f_ObjectsListItem'},
            Title: '_',
            boxNumber: boxData.boxNumber,
            beginningRecordsDate: boxData.beginningRecordsDate,
            endRecordsDate: boxData.endRecordsDate,
            recordType: boxData.recordType,
            retention: boxData.retention,
            disposition: boxData.disposition || DISPOSITION_FIELD_DEFAULT_VALUE, // since disposition is a select field, set it to the default value if it has not been set yet
            description: boxData.description,
            batchForeignId: batchForeignId
        })
    })
}


// high level data access function that saves a new form to the server
export async function createForm(formData, intendedStatus) {
    const spBatchData = await createFormBatchData(formData.batchData, intendedStatus, formData.adminComments)
    formData.spListId = spBatchData.d.Id
    for(let i = 0; i < formData.boxes.length; i++) {
        const spBoxData = await createFormBoxData(formData.boxes[i], formData.spListId)
        formData.boxes[i].spListId = spBoxData.d.Id
    }
}

// lower level helper function
function createFormBatchData(batchData, intendedStatus, adminComments) {
    return $.ajax({
        url: '../_api/web/lists/getbytitle(\'Request_Batch_Objects\')/items',
        method: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
            'Accept': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose'
        },
        data : JSON.stringify({
            __metadata: {'type': 'SP.Data.Request_x005f_Batch_x005f_ObjectsListItem'},
            Title: '_',
            prepPersonName: batchData.prepPersonName,
            departmentName: batchData.departmentName,
            dateOfPreparation: batchData.dateOfPreparation,
            departmentNumber: batchData.departmentNumber,
            departmentPhone: batchData.departmentPhone,
            responsablePersonName: batchData.responsablePersonName,
            departmentAddress: batchData.departmentAddress,
            adminComments: adminComments,
            status: intendedStatus
        })
    })
}

function createFormBoxData(boxData, batchForeignId) {
    return $.ajax({
        url: '../_api/web/lists/getbytitle(\'Request_Box_Objects\')/items',
        method: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
            'Accept': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose'
        },
        data : JSON.stringify({
            __metadata: {'type': 'SP.Data.Request_x005f_Box_x005f_ObjectsListItem'},
            Title: '_',
            boxNumber: boxData.boxNumber,
            beginningRecordsDate: boxData.beginningRecordsDate,
            endRecordsDate: boxData.endRecordsDate,
            recordType: boxData.recordType,
            retention: boxData.retention,
            disposition: boxData.disposition || DISPOSITION_FIELD_DEFAULT_VALUE, // since disposition is a select field, set it to the default value if it has not been set yet
            description: boxData.description,
            batchForeignId: batchForeignId
        })
    })
}



export async function deleteForm(formData) {
    await deleteFormComponent(REQUEST_BATCH_LIST_NAME, formData.spListId)
    for(let i = 0; i < formData.boxes.length; i++) {
        await deleteFormComponent(REQUEST_BOX_LIST_NAME, formData.boxes[i].spListId)
    }
}

function deleteFormComponent(listToDeleteFrom, spListId) {
    return $.ajax({
        url: `../_api/web/lists/getbytitle('${listToDeleteFrom}')/items(${spListId})`,
        method: 'POST',
        headers: {
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'X-HTTP-Method': 'DELETE',
            'IF-MATCH': '*'
        }
    })
}


export async function fetchUserPendingRequests(username) {
    // construct the field value pairs necessary for generating a filter string to fetch the specified elements
    const batchFieldValuePairs = [
        {field: 'prepPersonName', value: username},
        {field: 'status', value: StatusEnum.NEEDS_USER_REVIEW}
    ]

    // fetch the users batches that have the status 'needs user review' to populate the user pending requests list
    const rawBatchesData = await fetchAppWebListItemsByFieldVal(REQUEST_BATCH_LIST_NAME, batchFieldValuePairs)
    const batchesDtoList = transformBatchesDataToBatchesDtoList(rawBatchesData)
    for(let i = 0; i < batchesDtoList.length; i++) {
            // create a singleton array of fieldValue pairs so that all of the boxes assigned to the current batch will be fetched
        const rawBoxesData = await fetchAppWebListItemsByFieldVal(REQUEST_BOX_LIST_NAME, [{field: 'batchForeignId', value: batchesDtoList[i].spListId}])
        const boxesDtoList = transformBoxesDataToBoxesDtoList(rawBoxesData)
        batchesDtoList[i].boxes = boxesDtoList
    }
    return batchesDtoList
}

export async function fetchUserRequestsAwaitingReview(username) {
    // construct the field value pairs necessary for generating a filter string to fetch the specified elements
    const batchFieldValuePairs = [
        {field: 'prepPersonName', value: username},
        {field: 'status', value: StatusEnum.WAITING_ON_ADMIN_APPROVAL}
    ]

    // fetch the users batches that have the status 'needs user review' to populate the user pending requests list
    const rawBatchesData = await fetchAppWebListItemsByFieldVal(REQUEST_BATCH_LIST_NAME, batchFieldValuePairs)
    const batchesDtoList = transformBatchesDataToBatchesDtoList(rawBatchesData)
    for(let i = 0; i < batchesDtoList.length; i++) {
            // create a singleton array of fieldValue pairs so that all of the boxes assigned to the current batch will be fetched
        const rawBoxesData = await fetchAppWebListItemsByFieldVal(REQUEST_BOX_LIST_NAME, [{field: 'batchForeignId', value: batchesDtoList[i].spListId}])
        const boxesDtoList = transformBoxesDataToBoxesDtoList(rawBoxesData)
        batchesDtoList[i].boxes = boxesDtoList
    }
    return batchesDtoList
}

// higher level fetch function
export async function fetchAdminPendingRequests() {
    // fetch the users batches that have the status 'needs user review' to populate the user pending requests list
    const rawBatchesData = await fetchAppWebListItemsByFieldVal(REQUEST_BATCH_LIST_NAME, [{field: 'status', value: StatusEnum.WAITING_ON_ADMIN_APPROVAL}])
    const batchesDtoList = transformBatchesDataToBatchesDtoList(rawBatchesData)
    for(let i = 0; i < batchesDtoList.length; i++) {
            // create a singleton array of fieldValue pairs so that all of the boxes assigned to the current batch will be fetched
        const rawBoxesData = await fetchAppWebListItemsByFieldVal(REQUEST_BOX_LIST_NAME, [{field: 'batchForeignId', value: batchesDtoList[i].spListId}])
        const boxesDtoList = transformBoxesDataToBoxesDtoList(rawBoxesData)
        batchesDtoList[i].boxes = boxesDtoList
    }
    return batchesDtoList
}

// low level fetch function
function fetchAppWebListItemsByFieldVal(listName, fieldValPairArray) {
    const filterString = generateQueryFilterString(fieldValPairArray)
    return $.ajax({
        url: `../_api/web/lists/getbytitle('${listName}')/items?$filter=${filterString}`,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}
