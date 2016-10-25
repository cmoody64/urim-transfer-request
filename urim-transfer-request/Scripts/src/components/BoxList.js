import React from 'react'
import { Panel, Button } from 'react-bootstrap'
import { toggleBoxListVisibilty } from '../actions/currentFormActionCreators.js'

export const BoxList = (props) => {
    debugger
    return (
        <div>
            <Button onClick={toggleBoxListVisibilty} className='boxListButton' >Show Boxes</Button>
            <Panel collapsible expanded={props.expanded} className='boxListPanel'>
                <div>
                    {
                        props.boxes.map((box, index) => (
                            <div>{box.number}</div>
                        ))
                    }
                </div>
            </Panel>
        </div>
    )
}
