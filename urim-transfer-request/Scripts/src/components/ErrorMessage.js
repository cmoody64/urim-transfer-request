import React from 'react'
import { clearUserPermissionError } from '../actions/userActionCreators.js'
import { Alert } from 'react-bootstrap'

export const ErrorMessage = (props) => {
    setTimeout(clearUserPermissionError, props.duration || 3000)

    return (
        <Alert bsStyle="warning" id='userPermissionError'>
            <strong>{props.errorText}</strong>
        </Alert>
    )
}
