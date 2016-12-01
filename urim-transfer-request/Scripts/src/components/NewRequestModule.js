import React from 'react'
import {
    Jumbotron,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import { displayNewRequestForm } from '../actions/currentFormActionCreators.js'
import { postUserPermissionError } from '../actions/appActionCreators.js'
import {
    openNewRequestDepartmentSelection,
    closeNewRequestDepartmentSelection
} from '../actions/userActionCreators.js'

const handleNewRequestClick = (props) => {
    if(!props.userDepartments.length) {
        postUserPermissionError('You must be the record liaison for a department to request a record transfer')
    } else if(props.userDepartments.length === 1) {
        displayNewRequestForm(props.userDepartments[0])
    } else {
        // launch new Request department selection
        openNewRequestDepartmentSelection()
    }
}

const handleDepartmentSelection = (department) => {
    closeNewRequestDepartmentSelection()
    displayNewRequestForm(department)
}

export const NewRequestModule = (props) => (
    <Jumbotron>
        <h2>New Record Transfer Request</h2>
        <div>
            Fill out the provided form and press submit to create a new record transfer request.
            It will then be sent to an administrator for their approval before your request is fufilled.
        </div>
        <div>
        {
            props.isNewRequestDepartmentSelection
            ? (
                <ListGroup id='newRequestItemSelectionList'>
                {
                    props.userDepartments.map((department, index) => (
                        <ListGroupItem bsStyle='info' key={index} onClick={() => handleDepartmentSelection(department)}>{'Start request for '}<strong>{`${department.departmentName}`}</strong></ListGroupItem>
                    ))
                }
                </ListGroup>
            ) : (<Button onClick={() => handleNewRequestClick(props)} id='newRequestButton' bsStyle='primary'>new request</Button>)
        }
        </div>
    </Jumbotron>
)
