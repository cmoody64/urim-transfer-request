import React from 'react'
import UserStore from '../stores/userStore.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { RequestsList } from '../components/RequestsList.js'
import { NewRequestModule } from '../components/NewRequestModule.js'
import { FormModal } from '../components/FormModal.js'
import { clearCurrentForm } from '../actions/currentFormActionCreators.js'

export const UserLayout = React.createClass({
    getInitialState() {
        return {
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit()
        }
    },

    updateComponent() {
        this.setState({
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit()
        })
    },

    componentWillMount() {
        UserStore.on('change', this.updateComponent.bind(this))
        CurrentFormStore.on('change', this.updateComponent.bind(this))
    },

    componentWillUnmount() {
        UserStore.removeListener('change', this.updateComponent.bind(this))
        CurrentFormStore.removeListener('change', this.updateComponent.bind(this))
    },

    render() {
        return (
            <div className='userLayout'>
                <div>{`Hello ${this.state.currentUser}`}</div>
                { // render requestsAwaitingReview if necessary
                    this.state.requestsAwaitingReview.length &&
                    (
                        <div>
                            <h2>Finished Requests <small>waiting on administrator approval</small></h2>
                            <div className='requestsListContainer'>
                                <RequestsList requests={this.state.requestsAwaitingReview} style='info' />
                            </div>
                        </div>
                    )
                }
                { // render pending requests if necessary
                    this.state.pendingRequests.length &&
                    (
                        <div>
                            <h2>Returned Requests <small>waiting on your revision</small></h2>
                            <div className='requestsListContainer'>
                                <RequestsList requests={this.state.pendingRequests} />
                            </div>
                        </div>
                    )
                }
                {/* always render the new request module  */}
                <div className='newRequestModuleContainer'>
                    <NewRequestModule />
                </div>
                {/* Transfer Sheet Modal */}
                <FormModal type='user' show={this.state.showFormModal} close={clearCurrentForm} submit={() => console.log('submit form')} />
            </div>
        )
    }
})
