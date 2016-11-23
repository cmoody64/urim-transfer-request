export const EMPTY_REQUEST = {
    batchData: {},
    boxGroupData: {},
    boxes: [],
    status: 'waiting on admin approval'
}

export const StatusEnum = {
    WAITING_ON_ADMIN_APPROVAL: 'waiting on admin approval',
    NEEDS_USER_REVIEW: 'needs user review',
    APPROVED: 'approved'
}
