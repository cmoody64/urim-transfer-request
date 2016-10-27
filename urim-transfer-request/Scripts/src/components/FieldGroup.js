import React from 'react'
import {
    Form,
    FormControl,
    ControlLabel,
    FormGroup,
    Col
} from 'react-bootstrap'

export const FieldGroup = (props) => {
    if(props.type === 'text') {
        return (
            <Col lg={props.span} md={props.span} sm={props.span}>
                <FormGroup controlId={props.id} validationState={props.validation(props.id)}>
                    <ControlLabel>{props.label}</ControlLabel>
                    <FormControl value={props.value} onChange={(e) => props.onChange(props.id, e.target.value)} type='text' placeholder={props.placeholder} />
                    <FormControl.Feedback />
                </FormGroup>
            </Col>
        )
    } else if(props.type === 'select') {
        return (
            <Col lg={props.span} md={props.span} sm={props.span}>
                <FormGroup controlId={props.id}>
                    <ControlLabel>{props.label}</ControlLabel>
                        <FormControl value={props.value} onChange={(e) => props.onChange(props.id, e.target.value)} componentClass="select" placeholder={props.placeholder}>
                            {
                                props.options && props.options.map((option, index) => (
                                    <option value={option} key={index}>{option}</option>
                                ))
                            }
                        </FormControl>
                </FormGroup>
            </Col>
        )
    } else if(props.type === 'textarea') {
        return (
            <Col lg={props.span} md={props.span} sm={props.span}>
                <FormGroup controlId={props.id} validationState={props.validation(props.id)}>
                    <ControlLabel>{props.label}</ControlLabel>
                    <FormControl value={props.value} onChange={(e) => props.onChange(props.id, e.target.value)} componentClass='textarea' placeholder={props.placeholder} />
                    <FormControl.Feedback />
                </FormGroup>
            </Col>
        )
    }

}
