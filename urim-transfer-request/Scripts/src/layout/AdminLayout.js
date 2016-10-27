import React from 'react'
import AdminStore from '../stores/adminStore.js'
import CurrentFormStore from '../stores/currentFormStore.js'
import { RequestsList } from '../components/RequestsList.js'
import { FormModal } from '../components/FormModal.js'
import { clearCurrentForm } from '../actions/currentFormActionCreators.js'

export const AdminLayout = React.createClass({
    getInitialState() {
        return {
            pendingRequests: AdminStore.getAdminPendingRequests(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit()
        }
    },

    updateComponent() {
        this.setState({
            pendingRequests: AdminStore.getAdminPendingRequests(),
            showFormModal: CurrentFormStore.isDisplayForm(),
            canSubmitForm: CurrentFormStore.canSubmit()
        })
    },

    componentWillMount() {
        AdminStore.on('change', this.updateComponent.bind(this))
        CurrentFormStore.on('change', this.updateComponent.bind(this))
    },

    componentWillUnmount() {
        AdminStore.removeListener('change', this.updateComponent.bind(this))
        CurrentFormStore.removeListener('change', this.updateComponent.bind(this))
    },

    render() {
        return (
          <div className='adminLayout'>
              <div>Transfer Request Administration</div>
              {
                  this.state.pendingRequests.length &&
                  (
                      <div>
                          <h2>Pending Requests <small>approve or reject submitted requests</small></h2>
                          <div className='requestsListContainer'>
                              <RequestsList action={this.openFormModal} requests={this.state.pendingRequests} style='info' />
                          </div>
                      </div>
                  )
              }

              {/* Transfer Sheet Modal */}
              <FormModal type='admin' show={this.state.showFormModal} close={clearCurrentForm}
                  approve={() => console.log('approved form form')} return={() => console.log('returned to user for review')} />
          </div>
        )
    }
})
