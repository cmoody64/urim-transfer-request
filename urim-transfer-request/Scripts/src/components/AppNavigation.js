import React from 'react'
import { Nav, NavItem } from 'react-bootstrap'
import { postUserPermissionError } from '../actions/userActionCreators.js'

const handleSelect = (eventKey, props) => {
    switch(eventKey) {
        case 1:
            props.router.push('/')
            break
        case 2:
            props.isAdminLoggedIn ? props.router.push('admin') : postUserPermissionError()
            break
        case 3:
            console.log('routing to settings')
            break
    }
}

const determineActiveTabFromPath = (path = '/') => {
    let activeTabKey = 1
    switch(path) {
        case '/':
            activeTabKey = 1
            break
        case '/admin':
            activeTabKey = 2
            break
    }
    return activeTabKey
}

export const AppNavigation = (props) => (
    <Nav bsStyle='tabs'
        activeKey={determineActiveTabFromPath(props.displayedSubPath)}
        onSelect={(eventKey) => handleSelect(eventKey, props)}
    >
        <NavItem eventKey={1}>Manage Records</NavItem>
        <NavItem eventKey={2}>Admin</NavItem>
        <NavItem eventKey={3}>Settings</NavItem>
    </Nav>
)
