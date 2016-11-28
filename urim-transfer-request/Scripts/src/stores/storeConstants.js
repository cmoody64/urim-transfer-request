export const EMPTY_REQUEST = {
    batchData: {},
    boxGroupData: {},
    boxes: [],
    status: 'new request'
}

export const StatusEnum = {
    NEW_REQUEST: 'new request',
    WAITING_ON_ADMIN_APPROVAL: 'waiting on admin approval',
    NEEDS_USER_REVIEW: 'needs user review',
    APPROVED: 'approved'
}

export const DISPOSITION_FIELD_DEFAULT_VALUE = 'destroy'
