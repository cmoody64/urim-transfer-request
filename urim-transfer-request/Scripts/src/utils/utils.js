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


// Transformer utilities
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

export function transformDepartmentDataToDto(rawDepData) {
    return {
        departmentNumber: rawDepData.Department_x0020_Number,
        departmentName: rawDepData.Department_x0020_Name,
        departmentPhone: rawDepData.Department_x0020_Phone_x0020_Num,
        departmentAddress: rawDepData.Department_x0020_Address,
        responsiblePersonName: rawDepData.Person_x0020_Responsible_x0020_f
    }
}

export function getFormattedDateToday() {
    const date = new Date()
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}

export function incrementObjectNumber(objectNumber) {
    // only works for alpha numeric object numbers of the form A-00000
    const temp = parseInt(objectNumber.substr(2))
    return `${objectNumber.substr(0,2)}${temp+1}` //increase numberic portion of object number by 1
}