import React from 'react'
import { Panel, Button } from 'react-bootstrap'
import { toggleBoxListVisibilty } from '../actions/currentFormActionCreators.js'
import { BoxForm } from './BoxForm.js'

export const BoxList = (props) => {
    debugger
    return (
        <div>
            <Button onClick={toggleBoxListVisibilty} className='boxListButton' >Show Boxes</Button>
            <Panel collapsible expanded={props.expanded} className='boxListPanel'>
                <div>
                    {
                        props.boxes.map((box, index) => (
                            <Panel key={index}>
                                <BoxForm box={box}></BoxForm>
                            </Panel>
                        ))
                    }
                </div>
            </Panel>
        </div>
    )
}
