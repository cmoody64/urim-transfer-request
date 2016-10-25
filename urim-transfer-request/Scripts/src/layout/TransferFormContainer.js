import React from 'react'
import { FieldGroup } from '../components/FieldGroup.js'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import CurrentFormStore from '../stores/currentFormStore.js'
import { updateFormData } from '../actions/currentFormActionCreators.js'

export const TransferFormContainer = React.createClass({
    getInitialState() {
        return {
            formData: CurrentFormStore.getFormData(),
            submissionAttempted: CurrentFormStore.isSubmissionAttempted(),
            canAddBoxes: CurrentFormStore.canAddBoxes()
        }
    },

    updateComponent() {
        this.setState({
            formData: CurrentFormStore.getFormData(),
            submissionAttempted: CurrentFormStore.isSubmissionAttempted(),
            canAddBoxes: CurrentFormStore.canAddBoxes()
        })
    },

    componentWillMount() {
        CurrentFormStore.on('change', this.updateComponent.bind(this))
    },

    componentWillUnmount() {
        CurrentFormStore.removeListener('change', this.updateComponent.bind(this))
    },

    validateComponent(componentId) {
        if(this.state.submissionAttempted) {
            if(this.state.formData.batchData[componentId]) {
                return 'success'
            }
            return 'warning'
        }
        return null
    },

    onAddBoxes() {
        if(!this.state.submissionAttempted) {
            this.setState({submissionAttempted: true})
        }
        if(canAddBoxes) {
            // action to add boxes
        }
    },

    render() {
        debugger
        return (
            <Grid>
                {/*Dep. Number,     Dep. Name,      Dep. Phone*/}
                <Row><h3>Department Information</h3></Row>
                <Row>
                    <FieldGroup type='text' label='Department Number' value={this.state.formData.batchData['departmentNumber']} span={3} placeholder='9892'
                        id='departmentNumber' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department name' value={this.state.formData.batchData['departmentName']} span={3} placeholder='Records Management'
                        id='departmentName' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department Phone #' value={this.state.formData.batchData['departmentPhone']} span={3} placeholder='801-555-5555 ext 3'
                        id='departmentPhone' onChange={updateFormData} validation={this.validateComponent} />
                </Row>

                {/*Person Preparing Records,      Person Responsable for Records */}
                <Row>
                    <FieldGroup type='text' label='Name of Person Preparing Records for Storage' value={this.state.formData.batchData['prepPersonName']} span={4}
                        id='prepPersonName' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Name of Person Responsable for Records in the Department' value={this.state.formData.batchData['responsablePersonName']} span={5}
                        id='responsablePersonName' onChange={updateFormData} validation={this.validateComponent} />
                </Row>

                {/*Dep address,      Date of preparation*/}
                <Row>
                    <FieldGroup type='text' label='Department Address' span={3} placeholder='' value={this.state.formData.batchData['departmentAddress']}
                        id='departmentAddress' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Date of Preparation' span={3} placeholder='12/2/2015' value={this.state.formData.batchData['dateOfPreparation']}
                        id='dateOfPreparation' onChange={updateFormData} validation={this.validateComponent} />
                </Row>

                <Row><h3>Add Boxes to Request</h3></Row>

                {/*Number of Boxes,    Beginning date of records,    Ending date of records*/}
                <Row>
                    <FieldGroup id='numberOfBoxes' type='text' label='Number of Boxes' span={3} value={this.state.formData.batchData['numberOfBoxes']}
                        placeholder='12' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup id='beginningRecordsDate' type='text' label='Beginning date of records' span={3} value={this.state.formData.batchData['beginningRecordsDate']}
                        placeholder='12/2/2015' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Ending date of records' span={3} placeholder='12/2/2015' value={this.state.formData.batchData['endRecordsDate']}
                        id='endRecordsDate' onChange={updateFormData} validation={this.validateComponent} />
                </Row>

                {/*Record Type,     Retention,     Final Disposition*/}
                <Row>
                    <FieldGroup type='text' label='Record Type' span={3} placeholder='financial' value={this.state.formData.batchData['recordType']}
                        id='recordType' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Retention' span={3} placeholder='3 years' value={this.state.formData.batchData['retention']}
                        id='retention' onChange={updateFormData} validation={this.validateComponent} />
                    <FieldGroup type='select' label='Final Disposition' span={3} placeholder='select disposition' value={this.state.formData.batchData['disposition']}
                        options={['destroy', 'permanent']} id='disposition' onChange={updateFormData} validation={this.validateComponent} />
                </Row>

                <Row>
                    <Col lg={1} md={1} sm={1}></Col>
                    <Button onClick={this.onAddBoxes}>Add Boxes</Button>
                </Row>
            </Grid>
        )
    }
})
