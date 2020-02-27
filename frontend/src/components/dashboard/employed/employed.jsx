import React from 'react';

import { Button } from 'semantic-ui-react';

const axios = require('axios');
const env = require('../../../environment').environment;

export class EmployedComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: props.sessionId,
            orgId: props.org.id,
            orgName: props.org.name,
            rate: props.org.rate,
            shifts: [],
            //buttons
            viewShift: false,
            edit: false,
            leave: false
        };
    }

    getHeaders() {
        return {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}};
    }

    componentDidMount() {
        axios.get(env.BASE_URL + 'shifts', this.getHeaders()).then(
            (resp) => {
                this.setState({...this.state, shifts: resp.data})
            }
        )
    }

    handleViewShift = () => {
        this.setState({...this.state, viewShift: true, edit: false, leave: false});
    }

    handleEdit = () => {
        this.setState({...this.state, viewShift: false, edit: true, leave: false});
    }

    handleLeave = () => {
        this.setState({...this.state, viewShift: false, edit: false, leave: true});
    }


    renderShifts() {
        if (this.state.viewShift) {
            return (
                <p>You are viewing shifts</p>
            )
        }
    }

    render() {
        return (
            <div>
                <h1><strong>{this.state.orgName}</strong></h1>
                <div class="ui buttons">
                    <button onClick={this.handleViewShift} className="ui green basic button"><i class="calendar outline icon"></i>View Shifts</button>
                    <button onClick={this.handleEdit} className="ui blue basic button"><i class="edit outline icon"></i>Edit</button>
                    <button onClick={this.handleLeave} className="ui red basic button"><i class="user times icon"></i>Leave</button>
                </div>
                {this.renderShifts()}
            </div>
        )
    }
}