import React from 'react'
import CurrentFormStore from '../stores/currentFormStore.js'
import { FieldGroup } from './FieldGroup.js'
import { Grid, Row, Col, Well, Button } from 'react-bootstrap'
import { updateFormSingleBoxData, removeBoxFromCurrentForm } from '../actions/currentFormActionCreators.js'

export const BoxForm = (props) => {

    const validateComponent = (componentId, value) => {
        if(CurrentFormStore.isSubmissionAttempted()) {
            if(componentId === 'beginningRecordsDate' || componentId === 'endRecordsDate') {
                return /^(0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-]\d{4}$/.test(value) ? null : 'error'
            } else if(componentId === 'boxNumber') {
                return isNaN(value) ? 'error' : null
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
                    <FieldGroup id='boxNumber' type='text' label='Box No.*' span={2} value={props.box['boxNumber']}
                        placeholder='12' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <FieldGroup id='beginningRecordsDate' type='text' label='Start date of records*' span={2} value={props.box['beginningRecordsDate']}
                        placeholder='mm/dd/yyyy' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <FieldGroup type='text' label='End date of records*' span={2} placeholder='mm/dd/yyyy' value={props.box['endRecordsDate']}
                        id='endRecordsDate' onChange={updateBoxFormComponent} validation={validateComponent} />
                    <Col lg={1} md={1} sm={1}>
                        <Button onClick={() => removeBoxFromCurrentForm(props.index)} id='removeBoxButton' bsStyle='danger'>remove box</Button>
                    </Col>
                </Row>

                {/*Record Type,     Retention,     Destroy*/}
                <Row>
                    <FieldGroup type='select' label='Retention Category' span={2} placeholder='financial' value={props.box['retentionCategory']}
                        options={CurrentFormStore.getRetentionCategoryNames()} id='retentionCategory' onChange={updateBoxFormComponent} />
                    <FieldGroup type='select' label='Permanent' span={2} placeholder='select y/n' value={props.box['permanent']}
                        options={[null, 'Yes', 'No']} id='permanent' onChange={updateBoxFormComponent} />
                    {
                        props.box['permanent'] === 'Yes'
                        ? (
                            <FieldGroup type='text' label='Permanent Review Period (years)' span={3} placeholder='3 years' value={props.box['permanentReviewPeriod']}
                                id='permanentReviewPeriod' onChange={updateBoxFormComponent} />
                        )
                        : ( <div>
                                <FieldGroup type='text' label='Retention (years)' span={2} placeholder='3' value={props.box['retention']}
                                    id='retention' onChange={updateBoxFormComponent} />
                                <FieldGroup type='text' label='Review Date' span={2} placeholder='' value={props.box['reviewDate']}
                                    id='reviewDate' onChange={ function(){} } /> {/* NOTE review date has dummy on change function because it is a non-editable calculated value */}
                            </div>
                        )
                    }
                </Row>

                {/* Description */}
                <Row>
                    <FieldGroup type='textarea' label='Description*' span={8} placeholder='description' value={props.box['description']}
                        id='description' onChange={updateBoxFormComponent} validation={validateComponent} />
                </Row>
            </Grid>
        </Well>
    )
}
