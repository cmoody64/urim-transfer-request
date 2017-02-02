import React from 'react'
import UserStore from '../stores/userStore.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { RequestsList } from '../components/RequestsList.js'
import { NewRequestModule } from '../components/NewRequestModule.js'
import { FormModal } from '../components/FormModal.js'
import { clearCurrentForm } from '../actions/currentFormActionCreators.js'
import { submitCurrentFormForApproval } from '../actions/currentFormActionCreators.js'
import { markSubmissionAttempted, postFormFooterMessage } from '../actions/currentFormActionCreators.js'

export const UserLayout = React.createClass({
    getInitialState() {
        return {
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            isSubmittingToServer: CurrentFormStore.isSubmittingToServer(),
            userDepartments: UserStore.getUserDepartments(),
            isNewRequestDepartmentSelection: UserStore.isNewRequestDepartmentSelection(),
            submissionAttempted: CurrentFormStore.isSubmissionAttempted(),
            formFooterMessage: CurrentFormStore.getFormFooterMessage()
        }
    },

    updateComponent() {
        this.setState({
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            isSubmittingToServer: CurrentFormStore.isSubmittingToServer(),
            userDepartments: UserStore.getUserDepartments(),
            isNewRequestDepartmentSelection: UserStore.isNewRequestDepartmentSelection(),
            submissionAttempted: CurrentFormStore.isSubmissionAttempted(),
            formFooterMessage: CurrentFormStore.getFormFooterMessage()
        })
    },

    componentWillMount() {
        this.updateComponent = this.updateComponent.bind(this)
        UserStore.on('change', this.updateComponent)
        CurrentFormStore.on('change', this.updateComponent)
    },

    componentWillUnmount() {
        UserStore.removeListener('change', this.updateComponent)
        CurrentFormStore.removeListener('change', this.updateComponent)
    },

    onSubmitCurrentForm() {
        if(!this.state.submissionAttempted) {
            markSubmissionAttempted()
        }
        if(CurrentFormStore.canSubmit()) {
            submitCurrentFormForApproval(CurrentFormStore.getFormData())
        } else {
            // if unable to submit, find out why and post appropriate message
                // first check to see if its because no boxes were added
            if(!CurrentFormStore.getFormData().boxes.length) {
                postFormFooterMessage('You need to add boxes to your request.  Fill out the template above and click \'Add Boxes\'', 'danger', 10000)
            } else {
                // if boxes are present, assume user is ubale to submit because not all fields are filled out
                postFormFooterMessage('Fill out all of the required fields before submitting the form', 'danger', 5000)
            }

        }
    },

    render() {
        return (
            <div className='userLayout'>
                <div>{`Hello ${this.state.currentUser}`}</div>
                { // render requestsAwaitingReview if necessary
                    this.state.requestsAwaitingReview.length ?
                    (
                        <div>
                            <h2>Finished Requests <small>waiting on administrator approval</small></h2>
                            <div className='requestsListContainer'>
                                <RequestsList localList='user-awaiting' requests={this.state.requestsAwaitingReview} style='info' />
                            </div>
                        </div>
                    ) : null
                }
                { // render pending requests if necessary
                    this.state.pendingRequests.length ?
                    (
                        <div>
                            <h2>Returned Requests <small>waiting on your revision</small></h2>
                            <div className='requestsListContainer'>
                                <RequestsList localList='user-pending' requests={this.state.pendingRequests} />
                            </div>
                        </div>
                    ) : null
                }
                {/* always render the new request module  */}
                <div className='newRequestModuleContainer'>
                    <NewRequestModule userDepartments={this.state.userDepartments} isNewRequestDepartmentSelection={this.state.isNewRequestDepartmentSelection} />
                </div>
                {/* Transfer Sheet Modal */}
                <FormModal type='user' show={this.state.showFormModal} close={clearCurrentForm} submit={this.onSubmitCurrentForm}
                    isSubmittingToServer={this.state.isSubmittingToServer} formFooterMessage={this.state.formFooterMessage} />
            </div>
        )
    }
})
