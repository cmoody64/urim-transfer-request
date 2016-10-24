import React from 'react'
import UserStore from '../stores/userStore.js'
import { RequestsList } from '../components/RequestsList.js'
import { NewRequestModule } from '../components/NewRequestModule.js'
import { FormModal } from '../components/FormModal.js'

export const UserLayout = React.createClass({
    getInitialState() {
        return {
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview(),
            showFormModal: false
        }
    },

    updateComponent() {
        this.setState({
            currentUser: UserStore.getCurrentUser(),
            pendingRequests: UserStore.getUserPendingRequests(),
            requestsAwaitingReview: UserStore.getUserRequestsAwaitingReview()
        })
    },

    componentWillMount() {
        UserStore.on('change', this.updateComponent.bind(this))
    },

    componentWillUnmount() {
        UserStore.removeListener('change', this.updateComponent.bind(this))
    },

    closeFormModal() {
        this.setState({showFormModal: false})
    },

    openFormModal() {
        this.setState({showFormModal: true})
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
                                <RequestsList action={this.openFormModal} requests={this.state.requestsAwaitingReview} style='info' />
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
                                <RequestsList action={this.openFormModal} requests={this.state.pendingRequests} />
                            </div>
                        </div>
                    )
                }
                {/* always render the new request module  */}
                <div className='newRequestModuleContainer'>
                    <NewRequestModule onClick={this.openFormModal} />
                </div>
                {/* Transfer Sheet Modal */}
                <FormModal type='user' show={this.state.showFormModal} close={this.closeFormModal} submit={() => console.log('submit form')} />
            </div>
        )
    }
})
