import React from 'react'
import { Jumbotron } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

export const NewRequestModule = (props) => (
    <Jumbotron>
        <h2>New Record Transfer Request</h2>
        <div>
            Fill out the provided form and press submit to create a new record transfer request.
            It will then be sent to an administrator for their approval before your request is fufilled.
        </div>
        <Button onClick={props.onClick} id='newRequestButton' bsStyle='primary'>new request</Button>
    </Jumbotron>
)
