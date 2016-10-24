import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'

export const RequestsList = (props) => (
    <ListGroup>
        {
            props.requests.map((request, index) => (
                <ListGroupItem header={request.department} onClick={props.action}
                    key={index} bsStyle={props.style}>
                {`submitted by ${request.submitter} on ${request.submissionDate}: `}
                <strong>{`${request.status}`}</strong>
                </ListGroupItem>
            ))
        }
    </ListGroup>
)
