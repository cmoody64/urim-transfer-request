import {
    getQueryStringParameter,
    transformBatchesDataToBatchesDtoList,
    transformBoxesDataToBoxesDtoList,
    generateQueryFilterString
 } from '../utils/utils.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { StatusEnum } from '../stores/storeConstants.js'

export const hostWebUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
const appWebUrl = getQueryStringParameter('SPAppWebUrl');
const archiveLibraryUrl = '/records_transfers/Records Transfer Sheets'
const REQUEST_BATCH_LIST_NAME = 'Request_Batch_Objects'
const REQUEST_BOX_LIST_NAME = 'Request_Box_Objects'
const ADMIN_LIST_NAME = 'Transfer Request Administrators'
const DEP_INFO_LIST_NAME = 'Department Information'
const RECORD_LIAISON_COLUMN_NAME = 'Record_x0020_Liaison'
const DEPARTMENT_NUMBER_COLUMN_NAME = 'Department Number'
const GENERAL_RETENTION_SCHEDULE_LIB = 'General Retention Schedule'

export function getCurrentUser() {
    return $.ajax({
        url: '../_api/web/currentuser?$select=Title',
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}

export function fetchLastArchivedObjectNumber() {
    return $.ajax({
        url: `../_api/web/lists/getbytitle('Object_Number_Log')/items?$select=Title`,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}

export function saveNextObjectNumberToServer(objectNumber) {
    return $.ajax({
        url: '../_api/web/lists/getbytitle(\'Object_Number_Log\')/items',
        method: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
            'Accept': 'application/json; odata=verbose',
            'X-RequestDigest': $('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose'
        },
        data : JSON.stringify({
            __metadata: {'type': 'SP.Data.Object_x005f_Number_x005f_LogListItem'},
            Title: objectNumber,
        })
    })
}

export function updateNextObjectNumberOnServer(objectNumber) {
    return $.ajax({
        url: `../_api/web/lists/getbytitle('Object_Number_Log')/items(1)`,
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
            __metadata: {'type': 'SP.Data.Object_x005f_Number_x005f_LogListItem'},
            Title: objectNumber
        })
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

export function saveFormPdfToSever(pdfArrayBuffer, folderName, fileName) {
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/getfolderbyserverrelativeurl('${archiveLibraryUrl}/${folderName}')/files/add(overwrite=true,url='${fileName}')?@target='${hostWebUrl}'`,
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

export function saveFormMetadata(fileName, folderName, data) {
    const listReadyFormData = Object.assign({}, data, { __metadata: {'type': 'SP.Data.Records_x0020_Transfer_x0020_SheetsItem'} })
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/getfilebyserverrelativeurl('${archiveLibraryUrl}/${folderName}/${fileName}')/listitemallfields?@target='${hostWebUrl}'`,
        type: 'POST',
        contentType: 'application/json; odata=verbose',
        headers: {
           'accept': 'application/json;odata=verbose',
           'X-RequestDigest': jQuery('#__REQUESTDIGEST').val(),
            'contentType': 'application/json; odata=verbose',
            'X-HTTP-Method': 'MERGE',
            'IF-MATCH': '*'
        },
        data: JSON.stringify(listReadyFormData)
    })
}

// high level data access function that updates a previously saved form to the server
export async function updateForm(formData, intendedStatus) {
    await updateFormBatchData(formData.batchData, formData.spListId, intendedStatus, formData.adminComments, formData.boxes)
}

// helper function coupled with updateFormToServer
function updateFormBatchData(batchData, spListId, intendedStatus, adminComments, boxes) {
    const boxString = JSON.stringify(boxes)
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
            departmentCollege: batchData.departmentCollege,
            pickupInstructions: batchData.pickupInstructions,
            adminComments: adminComments,
            status: intendedStatus,
            boxes: boxString
        })
    })
}


// high level data access function that saves a new form to the server
export async function createForm(formData, intendedStatus) {
    const spBatchData = await createFormBatchObject(formData.batchData, intendedStatus, formData.adminComments, formData.boxes)
    formData.spListId = spBatchData.d.Id
}

// lower level helper function
function createFormBatchObject(batchData, intendedStatus, adminComments, boxes) {
    const boxString = JSON.stringify(boxes)
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
            departmentCollege: batchData.departmentCollege,
            pickupInstructions: batchData.pickupInstructions,
            adminComments: adminComments,
            status: intendedStatus,
            boxes: boxString
        })
    })
}


export async function deleteForm(formData) {
    await deleteFormComponent(REQUEST_BATCH_LIST_NAME, formData.spListId)
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
        const boxesDtoList = JSON.parse(rawBatchesData.d.results[i].boxes)
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
        const boxesDtoList = JSON.parse(rawBatchesData.d.results[i].boxes)
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
        const boxesDtoList = JSON.parse(rawBatchesData.d.results[i].boxes)
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

export function getRetentionCategoryData() {
    return $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/lists/getbytitle('${GENERAL_RETENTION_SCHEDULE_LIB}')/items?@target='${hostWebUrl}'`,
        method: 'GET',
        headers: { 'Accept': 'application/json; odata=verbose' },
    })
}
