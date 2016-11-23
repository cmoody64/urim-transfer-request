import React from 'react'
import { Alert, Button } from 'react-bootstrap'
import { removeAdminComment } from '../actions/currentFormActionCreators.js'
import CurrentFormStore from '../stores/currentFormStore.js'

export const FormCommentWarning = (props) => {
    const headerText = props.type === 'admin' ? 'Your Previous Comment' : 'URIM Administrators Have Requested that You Fix the Following:'

    return (
        <Alert bsStyle='danger'>
            <h4>{headerText}</h4>
            <p>{CurrentFormStore.getFormData().adminComments}</p>
            {
                props.type === 'admin'
                ? (<Button id='removeCommentButton' bsStyle='danger' onClick={removeAdminComment}>Remove comment</Button>)
                : null
            }
        </Alert>
    )
}
