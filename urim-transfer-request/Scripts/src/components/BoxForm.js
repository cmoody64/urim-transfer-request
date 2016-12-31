import React from 'react'
import CurrentFormStore from '../stores/currentFormStore.js'
import { FieldGroup } from './FieldGroup.js'
import { Grid, Row, Col, Well, Button } from 'react-bootstrap'
import { updateFormSingleBoxData, removeBoxFromCurrentForm } from '../actions/currentFormActionCreators.js'

export const BoxForm = (props) => {

    const validateComponent = (componentId, value) => {
        if(CurrentFormStore.isSubmissionAttempted()) {
            if(componentId === 'beginningRecordsDate' || componentId === 'endRecordsDate') {
                return /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(value) ? null : 'error'
            }
            return value ? null : 'error'
        }
        return null
    }

    const updateBoxFormComponent = (id, value) => {
        updateFormSingleBoxData(id, value, props.index)
    }

    return (
        <Well>
            <Grid>
                {/*Number of Boxes,    Beginning date of records,    Ending date of records*/}
                <Row>
                    <FieldGroup id='boxNumber' type='text' label='Box No.' span={2} value={props.box['boxNumber']}
                        placeholder='12' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <FieldGroup id='beginningRecordsDate' type='text' label='Start date of records' span={2} value={props.box['beginningRecordsDate']}
                        placeholder='12/2/2015' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <FieldGroup type='text' label='End date of records' span={2} placeholder='12/2/2015' value={props.box['endRecordsDate']}
                        id='endRecordsDate' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <Col lg={1} md={1} sm={1}>
                        <Button onClick={() => removeBoxFromCurrentForm(props.index)} id='removeBoxButton' bsStyle='danger'>remove box</Button>
                    </Col>
                </Row>

                {/*Record Type,     Retention,     Destroy*/}
                <Row>
                    <FieldGroup type='text' label='Record Type' span={2} placeholder='financial' value={props.box['recordType']}
                        id='recordType' onChange={updateBoxFormComponent} />
                    <FieldGroup type='text' label='Retention' span={2} placeholder='3 years' value={props.box['retention']}
                        id='retention' onChange={updateBoxFormComponent} />
                    <FieldGroup type='select' label='Destroy' span={2} placeholder='select disposition' value={props.box['disposition']}
                        options={['yes', 'no']} id='disposition' onChange={updateBoxFormComponent} />
                </Row>

                {/* Description */}
                <Row>
                    <FieldGroup type='textarea' label='Description' span={8} placeholder='description' value={props.box['description']}
                        id='description' onChange={updateBoxFormComponent} validation={validateComponent} />
                </Row>
            </Grid>
        </Well>
    )
}
