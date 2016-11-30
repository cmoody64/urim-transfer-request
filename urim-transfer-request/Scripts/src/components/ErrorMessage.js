import React from 'react'
import { clearUserPermissionError } from '../actions/appActionCreators.js'
import { Alert } from 'react-bootstrap'

export const ErrorMessage = (props) => {
    setTimeout(clearUserPermissionError, props.duration || 4000)

    return (
        <Alert bsStyle="warning" id='userPermissionError'>
            <strong>{props.errorText}</strong>
        </Alert>
    )
}
