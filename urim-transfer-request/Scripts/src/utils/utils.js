export function getQueryStringParameter(paramToRetrieve) {
    var params =
        document.URL.split("?")[1].split("&");
    var strParams = "";
    for (var i = 0; i < params.length; i = i + 1) {
        var singleParam = params[i].split("=");
        if (singleParam[0] == paramToRetrieve)
            return singleParam[1];
    }
}

export function transformBatchesDataToBatchesDtoList(batchesData) {
    return batchesData.d.results.map((element, index) => {
        return {
            batchData: {
                prepPersonName: element.prepPersonName,
                departmentName: element.departmentName,
                dateOfPreparation: element.dateOfPreparation,
                departmentNumber: element.departmentNumber,
                departmentPhone: element.departmentPhone,
                responsablePersonName: element.responsablePersonName,
                departmentAddress: element.departmentAddress
            },
            boxGroupData: {},
            boxes: [],
            status: element.status,
            spListId: element.Id,
            adminComments: element.adminComments
        }
    })
}

export function transformBoxesDataToBoxesDtoList(boxesData) {
    return boxesData.d.results.map((element, index) => {
        return {
            boxNumber: element.boxNumber,
            beginningRecordsDate: element.beginningRecordsDate,
            endRecordsDate: element.endRecordsDate,
            recordType: element.recordType,
            retention: element.retention,
            disposition: element.disposition,
            description: element.description,
            spListId: element.Id
        }
    })
}

export function generateQueryFilterString(filterPairArray) {
    return filterPairArray.reduce((accumulator, currentPair, index, array) => {
        accumulator += `(${currentPair.field} eq '${currentPair.value}')`
        if(index != array.length - 1) {
            accumulator += ' and '
        }
        return accumulator
    }, '')
}
