import React from 'react'
import { Panel, Button } from 'react-bootstrap'
import { toggleBoxListVisibilty } from '../actions/currentFormActionCreators.js'
import { BoxForm } from './BoxForm.js'

export const BoxList = (props) => {
    return (
        <div>
            <Button onClick={toggleBoxListVisibilty} className='boxListButton' >Show Boxes</Button>
            <Panel collapsible expanded={props.expanded} className='boxListPanel'>
                <div>
                    {
                        props.boxes.map((box, index) => (
                            <BoxForm key={index} box={box} index={index}></BoxForm>
                        ))
                    }
                </div>
            </Panel>
        </div>
    )
}
