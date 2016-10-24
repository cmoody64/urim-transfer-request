import React from 'react'
import { AppNavigation } from '../components/AppNavigation'
import { ErrorMessage } from '../components/ErrorMessage.js'
import UserStore from '../stores/userStore.js'
import { fetchStartupData } from '../actions/appActionCreators.js'

export const App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    updateAppData() {
        this.setState({
            isAdminLoggedIn: UserStore.isAdminLoggedIn(),
            userPermissionError: UserStore.isUserPermissionError()
        })
    },

    getInitialState() {
        return {
            isAdminLoggedIn: UserStore.isAdminLoggedIn(),
            userPermissionError: UserStore.isUserPermissionError()
        }
    },

    componentWillMount() {
        UserStore.on('change', this.updateAppData)
        fetchStartupData()
    },

    componentWillUnmount() {
        UserStore.removeLister('change', this.updateAppData)
    },

    render() {
        return (
            <div className='appContainer'>
                <AppNavigation
                    isAdminLoggedIn={this.state.isAdminLoggedIn}
                    router={this.context.router}
                    displayedSubPath={this.props.location.pathname}
                 />
                {this.state.userPermissionError && <ErrorMessage errorText='You must be an administrator to enter this part of the app' />}
                {this.props.children}
            </div>
        )
    }
})
