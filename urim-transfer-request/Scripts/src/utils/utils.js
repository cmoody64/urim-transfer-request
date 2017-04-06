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
                submitterEmail: element.submitterEmail,
                departmentName: element.departmentName,
                dateOfPreparation: element.dateOfPreparation,
                departmentNumber: element.departmentNumber,
                departmentPhone: element.departmentPhone,
                responsablePersonName: element.responsablePersonName,
                departmentAddress: element.departmentAddress,
                departmentCollege: element.departmentCollege,
                pickupInstructions: element.pickupInstructions,
                departmentInfoChangeFlag: element.departmentInfoChangeFlag
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
            retentionCategory: element.retentionCategory,
            retention: element.retention,
            permanentReviewPeriod: element.permanentReviewPeriod,
            permanent: element.permanent,
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
        departmentCollege: rawDepData.Department_x0020_College,
        responsiblePersonName: rawDepData.Person_x0020_Responsible_x0020_f
    }
}

export function transformRetentionDataToDto(rawRetData) {
    return rawRetData.d.results.map((rawData) => {
        return {
            retentionCategory: rawData['Record_x0020_Category'],
            permanent: rawData['PERM'],
            period: rawData['Period'],
            permanentReviewPeriod: rawData['Perm_x0020_Review_x0020_Period']
        }
    })
}

export function getFormattedDate(date) {
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}

export function getFormattedDateToday() {
    const date = new Date()
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}

export function incrementObjectNumber(objectNumber) {
    // assumes object number is numeric string
    const temp = parseInt(objectNumber)
    return `${temp+1}` //increase numberic portion of object number by 1
}

// this function accepts a string of highly variable length and formats it into a short phrase key
// if the string is under a threshold length, it will not be changed, otherwise it will be trimmed
// to an appropriate length
export function formatLongStringForSaveKey(string) {
    // if the string is under 50 characters long, the whole string will be the phrase key
    if(string.length < 50) {
        return string
    } else if(string.split('\n').length < 50) {
        // if the  string has a newline character within the first characters, the first line of string
        // will be returned as the phrase key
        return string.split('\n')[0]
    } else {
        // otherwise the first 50 characters will be returned as the phrase key
        return string.substr(0, 49)
    }
}