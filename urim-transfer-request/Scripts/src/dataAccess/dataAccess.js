import { getQueryStringParameter } from '../utils/utils.js'
import CurrentFormStore from '../stores/currentFormStore.js'


export const hostWebUrl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
const appWebUrl = getQueryStringParameter('SPAppWebUrl');
const archiveLibraryUrl = '/cmoodysite/Transfer Request Archive'

export function getCurrentUser() {
    return $.ajax({
        url: "../_api/web/currentuser?$select=Title",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
    })
}

export function SearchUserInAdminList(userName) {
    return $.ajax({
        url: `../_api/web/lists/getbytitle('Administrators')/items?$filter=Title eq '${userName}'`,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
    })
}

export function saveFormPdfToSever(pdfArrayBuffer, filename) {
    $.ajax({
        url: `../_api/SP.AppContextSite(@target)/web/getfolderbyserverrelativeurl('${archiveLibraryUrl}')/files/add(overwrite=true,url='${filename}')?@target='${hostWebUrl}'`,
        type: "POST",
        processData: false,
        headers: {
           "accept": "application/json;odata=verbose",
           "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
            "contentType": "application/json; odata=verbose"
        },
        data: pdfArrayBuffer
    })
}

export function saveCurrentFormDataToServer() {
    console.log('saving current data')
}
