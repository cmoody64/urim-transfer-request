import React from 'react'
import AdminStore from '../stores/adminStore.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { RequestsList } from '../components/RequestsList.js'
import { FormModal } from '../components/FormModal.js'
import { clearCurrentForm,
    archiveCurrentForm,
    returnCurrentFormToUser,
    displayCommentInput
} from '../actions/currentFormActionCreators.js'

export const AdminLayout = React.createClass({
    getInitialState() {
        return {
            pendingRequests: AdminStore.getAdminPendingRequests(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit(),
            canAdminReturnToUser: CurrentFormStore.canAdminReturnToUser(),
            isSubmittingToServer: CurrentFormStore.isSubmittingToServer()
        }
    },

    updateComponent() {
        this.setState({
            pendingRequests: AdminStore.getAdminPendingRequests(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit(),
            canAdminReturnToUser: CurrentFormStore.canAdminReturnToUser(),
            isSubmittingToServer: CurrentFormStore.isSubmittingToServer()
        })
    },

    componentWillMount() {
        this.updateComponent = this.updateComponent.bind(this)
        AdminStore.on('change', this.updateComponent)
        CurrentFormStore.on('change', this.updateComponent)
    },

    componentWillUnmount() {
        AdminStore.removeListener('change', this.updateComponent)
        CurrentFormStore.removeListener('change', this.updateComponent)
    },

    onReturnCurrentForm() {
        if(this.state.canSubmitForm) {
            returnCurrentFormToUser(CurrentFormStore.getFormData())
        }
    },

    onApproveCurrentForm() {
        if(this.state.canSubmitForm) {
            archiveCurrentForm(CurrentFormStore.getFormData())
        }
    },

    render() {
        return (
          <div className='adminLayout'>
              <div>Transfer Request Administration</div>
              {
                  this.state.pendingRequests.length ?
                  (
                      <div>
                          <h2>Pending Requests <small>approve or reject submitted requests</small></h2>
                          <div className='requestsListContainer'>
                              <RequestsList localList='admin-pending' requests={this.state.pendingRequests} style='info' />
                          </div>
                      </div>
                  ) : null
              }

              {/* Transfer Sheet Modal */}
              <FormModal type='admin' show={this.state.showFormModal} close={clearCurrentForm} canAdminReturnToUser={this.state.canAdminReturnToUser}
                  approve={this.onApproveCurrentForm} return={this.onReturnCurrentForm} addComments={displayCommentInput} isSubmittingToServer={this.state.isSubmittingToServer} />
          </div>
        )
    }
})
