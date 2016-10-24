import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TransferFormContainer } from '../layout/TransferFormContainer.js'

export const FormModal = (props) => (
    <Modal show={props.show} onHide={props.close} bsSize='large'>
        <Modal.Header closeButton>
            <Modal.Title>Record Transfer Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <TransferFormContainer />
        </Modal.Body>
        <Modal.Footer>
            { /* for type admin, the footer renders a return, approve, and close button */
                props.type === 'admin'
                ? (<span><Button onClick={props.approve}>Approve</Button> <Button onClick={props.return}>Return to User</Button></span>)
                : (<Button onClick={props.submit}>Submit</Button> )
            }
            <Button onClick={props.close}>Close</Button>
        </Modal.Footer>
    </Modal>
)
//spdjfg
