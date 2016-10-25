export const simpleUserPendingRequests_TEST = [
    {
        batchData: {
            prepPersonName: 'Connor Moody',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [{number: 1}, {number:2}],
        status: 'needs user review',
        id: 1
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 2',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'needs user review',
        id: 2
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 3',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'needs user review',
        id: 3
    }
]

export const simpleUserAwaitingRequests_TEST = [
    {
        batchData: {
            prepPersonName: 'Connor Moody',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [{number: 1}],
        status: 'wiating on admin approval',
        id: 4
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 2',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'wiating on admin approval',
        id: 5
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 3',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'wiating on admin approval',
        id: 6
    }
]

export const simpleAdminPendingRequests_TEST = [
    {
        batchData: {
            prepPersonName: 'Connor Moody',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'wiating on admin approval',
        id: 7
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 2',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'wiating on admin approval',
        id: 8
    },
    {
        batchData: {
            prepPersonName: 'Connor Moody 3',
            departmentName: 'records management',
            dateOfPreparation: '12/1/2015',
            departmentNumber: 9983,
            departmentPhone: '801-999-999',
            responsablePersonName: 'Connor Moody',
            departmentAddress: '512 HBLL'
        },
        boxGroupData: {},
        boxes: [],
        status: 'wiating on admin approval',
        id: 9
    }
]
