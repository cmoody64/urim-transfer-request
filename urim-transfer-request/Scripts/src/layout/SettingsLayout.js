import React from 'react'
import SettingsStore from '../stores/settingsStore.js'
import { PageHeader, Button, InputGroup, FormGroup, FormControl } from 'react-bootstrap'
import { saveNextObjectNumberToServer } from '../actions/settingsActionCreators.js'

export const SettingsLayout = React.createClass({
    getInitialState() {
        return {
            nextObjectNumber: SettingsStore.getNextObjectNumber(),
            objectNumberInputVal: SettingsStore.getNextObjectNumber(),
            isInputValid: true
        }
    },

    updateComponent() {
        this.setState({
            nextObjectNumber: SettingsStore.getNextObjectNumber(),
            objectNumberInputVal: SettingsStore.getNextObjectNumber()
        })
    },

    processNewInput(e) {
        this.setState({
            objectNumberInputVal: e.target.value,
            isInputValid: !isNaN(e.target.value)
        })
    },

    onSaveChanges() {
        if(this.state.isInputValid) {
            saveNextObjectNumberToServer(this.state.objectNumberInputVal)
        }
    },

    componentWillMount() {
        this.updateComponent = this.updateComponent.bind(this)
        SettingsStore.on('change', this.updateComponent)
    },

    componentWillUnmount() {
        SettingsStore.removeListener('change', this.updateComponent)
    },

    render() {
        return (
            <div className='settingsLayout'>
                <PageHeader>Settings <small>manage transfer request settings</small></PageHeader>
                <div id='nextObjectNumberContainer' >
                    <h3>Next Object Number</h3>
                    <FormGroup validationState={this.state.isInputValid ? null : 'error'}>
                        <InputGroup>
                            <FormControl onChange={this.processNewInput} type='text' value={this.state.objectNumberInputVal} />
                            { /* add save button if user has edited the object number */
                                this.state.objectNumberInputVal === this.state.nextObjectNumber
                                ? null
                                : (
                                    <InputGroup.Button>
                                        <Button disabled={!this.state.isInputValid} onClick={this.onSaveChanges}>Save Changes</Button>
                                    </InputGroup.Button>
                                )
                            }
                        </InputGroup>
                    </FormGroup>
                </div>
            </div>
        )
    }
})