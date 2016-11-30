import React from 'react'
import { clearSuccessMessage } from '../actions/appActionCreators.js'
import { Alert } from 'react-bootstrap'

export const SuccessMessage = (props) => {
    setTimeout(clearSuccessMessage, props.duration || 4000)

    return (
        <Alert bsStyle="success" >
            <strong>{props.messageText}</strong>
        </Alert>
    )
}
