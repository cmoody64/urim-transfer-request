import React from 'react'
import { Alert } from 'react-bootstrap'
import { clearFormFooterMessage } from '../actions/currentFormActionCreators.js'

export const FormFooterMessage = (props) => {
    if(props.duration) {
            setTimeout(clearFormFooterMessage, props.duration)
    }

    return (
        <Alert id='formFooterMessage' bsStyle={props.style}>
            {props.messageText}
        </Alert>
    )
}
