import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { TransferFormContainer } from '../layout/TransferFormContainer.js'

export const FormModal = (props) => (
    <Modal show={props.show} onHide={props.close} bsSize='large'>
        <Modal.Header closeButton>
            <Modal.Title>Record Transfer Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <TransferFormContainer type={props.type} />
        </Modal.Body>
        <Modal.Footer>
            { /* for type admin, the footer renders a return / comment, approve, and close button */
                props.type === 'admin'
                ? (
                    <span>
                        <Button onClick={props.approve} disabled={props.isSubmittingToServer}>Approve</Button>
                        { /* to return to the user, the admin must first add comments, then the return button will appear */
                            props.canAdminReturnToUser
                            ? (<Button onClick={props.return} disabled={props.isSubmittingToServer}>Return to User</Button>)
                            : (<Button onClick={props.addComments} disabled={props.isSubmittingToServer}>Add Comments to Request</Button>)
                        }

                    </span>
                )
                /* for type user, the footer only renders a submit button */
                : (<Button onClick={props.submit} disabled={props.isSubmittingToServer}>Submit</Button> )
            }
            <Button onClick={props.close} disabled={props.isSubmittingToServer}>Close</Button>
        </Modal.Footer>
    </Modal>
)
//spdjfg
