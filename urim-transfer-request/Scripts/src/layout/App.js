import React from 'react'
import { Button } from 'react-bootstrap'
import { AppNavigation } from '../components/AppNavigation'
import { ErrorMessage } from '../components/ErrorMessage.js'
import UserStore from '../stores/userStore.js'
import AppStore from '../stores/appStore.js'
import { SuccessMessage } from '../components/SuccessMessage.js'

export const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    updateAppData() {
        this.setState({
            isAdminLoggedIn: UserStore.isAdminLoggedIn(),
            userPermissionError: AppStore.getUserPermissionError(),
            showSuccessMessage: AppStore.isShowingSuccessMessage()
        })
    },

    getInitialState() {
        return {
            isAdminLoggedIn: UserStore.isAdminLoggedIn(),
            userPermissionError: AppStore.getUserPermissionError(),
            showSuccessMessage: AppStore.isShowingSuccessMessage()
        }
    },

    componentWillMount() {
        UserStore.on('change', this.updateAppData)
        AppStore.on('change', this.updateAppData)
    },

    componentWillUnmount() {
        UserStore.removeLister('change', this.updateAppData)
        AppStore.removeListener('change', this.updateAppData)
    },

    render() {
        return (
            <div className='appContainer'>
                <AppNavigation
                    isAdminLoggedIn={this.state.isAdminLoggedIn}
                    router={this.context.router}
                    displayedSubPath={this.props.location.pathname}
                 />
                {this.state.userPermissionError && <ErrorMessage errorText={this.state.userPermissionError} />}
                {this.state.showSuccessMessage && <SuccessMessage messageText='Changes successfully saved' />}
                {this.props.children}
                <Button className='homeLink' href="https://urim-department.byu.edu/records_transfers">Return to Records Transfers Home</Button>
            </div>
        )
    }
})
