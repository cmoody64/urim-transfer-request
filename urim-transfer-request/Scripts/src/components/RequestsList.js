import React from 'react'
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { displayRequestForm } from '../actions/currentFormActionCreators.js'

export const RequestsList = (props) => (
    <ListGroup>
        {
            props.requests.map((request, index) => (
                <ListGroupItem header={request.batchData.departmentName} onClick={() => displayRequestForm(request)}
                    key={index} bsStyle={props.style}>
                {`submitted by ${request.batchData.prepPersonName} on ${request.batchData.dateOfPreparation}: `}
                <strong>{`${request.status}`}</strong>
                </ListGroupItem>
            ))
        }
    </ListGroup>
)
