import React from 'react'
import { FieldGroup } from '../components/FieldGroup.js'
import { Grid, Row, Col, Button } from 'react-bootstrap'
import CurrentFormStore from '../stores/currentFormStore.js'
import { FormCommentWarning } from '../components/FormCommentWarning.js'
import {
    updateFormBatchData,
    updateFormBoxGroupData,
    updateFormAdminComments,
    markAddBoxesAttempted,
    addBoxesToRequest
 } from '../actions/currentFormActionCreators.js'
 import { BoxList } from '../components/BoxList.js'

export const TransferFormContainer = React.createClass({

    // component state refreshed with every render - saves having to pass store data through components that don't care
    fetchFreshRenderState() {
        this.renderState = {
            formData: CurrentFormStore.getFormData(),
            submissionAttempted: CurrentFormStore.isSubmissionAttempted(),
            addBoxesAttempted: CurrentFormStore.isAddBoxesAttempted(),
            canAddBoxes: CurrentFormStore.canAddBoxes(),
            displayBoxList: CurrentFormStore.isDisplayBoxList(),
            isDisplayCommentInput: CurrentFormStore.isDisplayCommentInput(),
            uncachedAdminComments: CurrentFormStore.getUncachedAdminComments()
        }
    },

    validateComponent(componentId) {
        if(this.renderState.submissionAttempted || this.renderState.addBoxesAttempted) {
            if(this.renderState.formData.batchData[componentId] || this.renderState.formData.boxGroupData[componentId]) {
                return 'success'
            }
            return 'warning'
        }
        return null
    },


    onAddBoxes() {
        if(!this.renderState.submissionAttempted) {
            markAddBoxesAttempted()
        }
        if(this.renderState.canAddBoxes) {
            addBoxesToRequest(this.renderState.formData.boxGroupData.numberOfBoxes)
        }
    },

    render() {
        this.fetchFreshRenderState()

        return (
            <Grid>
                { /* if there are any comments from the administrator, display them at the top of the form */
                    this.renderState.formData.adminComments
                    ? (<Row><Col lg={7} md={7} sm={7} ><FormCommentWarning type={this.props.type} /></Col></Row>)
                    : null
                }

                {/*Dep. Number,     Dep. Name,      Dep. Phone*/}
                <Row><h3>Department Information</h3></Row>
                <Row>
                    <FieldGroup type='text' label='Department Number' value={this.renderState.formData.batchData['departmentNumber']} span={3} placeholder='9892'
                        id='departmentNumber' onChange={updateFormBatchData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department name' value={this.renderState.formData.batchData['departmentName']} span={3} placeholder='Records Management'
                        id='departmentName' onChange={updateFormBatchData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Department Phone #' value={this.renderState.formData.batchData['departmentPhone']} span={3} placeholder='801-555-5555 ext 3'
                        id='departmentPhone' onChange={updateFormBatchData} validation={this.validateComponent} />
                </Row>

                {/*Person Preparing Records,      Person Responsable for Records */}
                <Row>
                    <FieldGroup type='text' label='Name of Person Preparing Records for Storage' value={this.renderState.formData.batchData['prepPersonName']} span={4}
                        id='prepPersonName' onChange={updateFormBatchData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Name of Person Responsable for Records in the Department' value={this.renderState.formData.batchData['responsablePersonName']} span={5}
                        id='responsablePersonName' onChange={updateFormBatchData} validation={this.validateComponent} />
                </Row>

                {/*Dep address,      Date of preparation*/}
                <Row>
                    <FieldGroup type='text' label='Department Address' span={3} placeholder='' value={this.renderState.formData.batchData['departmentAddress']}
                        id='departmentAddress' onChange={updateFormBatchData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Date of Preparation' span={3} placeholder='12/2/2015' value={this.renderState.formData.batchData['dateOfPreparation']}
                        id='dateOfPreparation' onChange={updateFormBatchData} validation={this.validateComponent} />
                </Row>

                <Row><h3>Add Boxes to Request</h3></Row>

                {/*Number of Boxes,    Beginning date of records,    Ending date of records*/}
                <Row>
                    <FieldGroup id='numberOfBoxes' type='text' label='Number of Boxes' span={3} value={this.renderState.formData.boxGroupData['numberOfBoxes']}
                        placeholder='12' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                    <FieldGroup id='beginningRecordsDate' type='text' label='Beginning date of records' span={3} value={this.renderState.formData.boxGroupData['beginningRecordsDate']}
                        placeholder='12/2/2015' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Ending date of records' span={3} placeholder='12/2/2015' value={this.renderState.formData.boxGroupData['endRecordsDate']}
                        id='endRecordsDate' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                </Row>

                {/*Record Type,     Retention,     Final Disposition*/}
                <Row>
                    <FieldGroup type='text' label='Record Type' span={3} placeholder='financial' value={this.renderState.formData.boxGroupData['recordType']}
                        id='recordType' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                    <FieldGroup type='text' label='Retention' span={3} placeholder='3 years' value={this.renderState.formData.boxGroupData['retention']}
                        id='retention' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                    <FieldGroup type='select' label='Final Disposition' span={3} placeholder='select disposition' value={this.renderState.formData.boxGroupData['disposition']}
                        options={['destroy', 'permanent']} id='disposition' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                </Row>

                {/* Description */}
                <Row>
                    <FieldGroup type='textarea' label='Description' span={6} placeholder='description' value={this.renderState.formData.boxGroupData['description']}
                        id='description' onChange={updateFormBoxGroupData} validation={this.validateComponent} />
                </Row>

                <Row>
                    <Col lg={3} md={3} sm={3}></Col>
                    <Button onClick={this.onAddBoxes}>Add Boxes</Button>
                </Row>

                {
                    this.renderState.formData.boxes.length ?
                    (
                        <Row>
                            <BoxList expanded={this.renderState.displayBoxList} boxes={this.renderState.formData.boxes} />
                        </Row>
                    ) : null

                }
                {
                    this.renderState.isDisplayCommentInput ?
                    (
                        <Row>
                            <FieldGroup validation={() => null}  type='textarea' value={this.renderState.uncachedAdminComments}
                                onChange={updateFormAdminComments} label='Add Comments for User Review' span={8} id='adminComments' />
                        </Row>
                    ) : null
                }
            </Grid>
        )
    }
})
