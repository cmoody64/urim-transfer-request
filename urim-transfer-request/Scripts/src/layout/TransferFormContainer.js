import React from 'react'
import { FieldGroup } from '../components/FieldGroup.js'
import { Grid, Row, Col, Button } from 'react-bootstrap'

export const TransferFormContainer = React.createClass({
    getInitialState() {
        return {
            formData: {},
            submissionAttempted: false,
        }
    },

    updateFormState(e) {
        e.preventDefault()
        this.setState({
            formData: {...this.state.formData, [e.target.id]: e.target.value}
        })
    },

    validateComponent(componentId) {
        if(this.state.submissionAttempted) {
            if(this.state.formData[componentId]) {
                return 'success'
            }
            return 'warning'
        }
        return null
    },

    render() {
        debugger
        return (
            <Grid>
                {/*Dep. Number,    Date of prep,    Num. of boxes*/}
                <Row><h3>Department Information</h3></Row>
                <Row>
                    <FieldGroup type='text' label='Department Number' span={3} placeholder='9892' id='depNumber' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department name' span={3} placeholder='Records Management' id='depName' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department Phone #' span={3} placeholder='801-555-5555 ext 3' id='depPhone' onChange={this.updateFormState} validation={this.validateComponent} />
                </Row>

                <Row>
                    <FieldGroup type='text' label='Name of Person Preparing Records for Storage' span={4} id='prepPersonName' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Name of Person Responsable for Records in the Department' span={5}
                        id='responsablePersonName' onChange={this.updateFormState} validation={this.validateComponent} />
                </Row>

                {/*Dep name,   Dep Number,    Dep address*/}
                <Row>
                    <FieldGroup type='text' label=' Department Address' span={3} placeholder='' id='depAddress' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Date of Preparation' span={3} placeholder='12/2/2015' id='dateOfPrep' onChange={this.updateFormState} validation={this.validateComponent} />
                </Row>

                <Row><h3>Add Boxes to Request</h3></Row>

                {/*Beginning date of records,    Ending date of records*/}
                <Row>
                    <FieldGroup id='numBoxes' type='text' label='Number of Boxes' span={3} placeholder='12' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup id='begRecordsDate' type='text' label='Beginning date of records' span={3} placeholder='12/2/2015' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Ending date of records' span={3} placeholder='12/2/2015' id='endRecordsDate' onChange={this.updateFormState} validation={this.validateComponent} />
                </Row>

                <Row>
                    <FieldGroup type='text' label='Record Type' span={3} placeholder='financial' id='recordType' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Retention' span={3} placeholder='3 years' id='retention' onChange={this.updateFormState} validation={this.validateComponent} />
                    <FieldGroup type='select' label='Final Disposition' span={3} placeholder='select disposition'
                        options={['destroy', 'permanent']} id='depNumber' onChange={this.updateFormState} validation={this.validateComponent} />
                </Row>

                <Row>
                    <Col lg={1} md={1} sm={1}></Col>
                    <Button onClick={() => this.setState({submissionAttempted: true})}>Add Boxes</Button>
                </Row>
            </Grid>
        )
    }
})
