import { getQueryStringParameter } from '../utils/utils.js';

export const hostWebUrl = decodeURIComponent(getQueryStringParameter("SPHostUrl"));
const appWebUrl = getQueryStringParameter("SPAppWebUrl");

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
