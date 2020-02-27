import React from 'react';

import { EditOrganisationComponent } from '../edit-organisation/edit-organisation';

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
            edit: false
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
        this.setState({...this.state, viewShift: true, edit: false});
    }

    handleEdit = () => {
        this.setState({...this.state, viewShift: false, edit: true});
    }

    handleLeave = () => {
        axios.post(env.BASE_URL + 'organisations/leave', null, this.getHeaders()).then(
            (resp) => {
                this.props.onOrgChange(null);             
            }
        )
    }

    renderShifts() {
        if (this.state.viewShift) {
            return (
                <p>You are viewing shifts</p>
            )
        }
    }

    handleUpdatedOrg = (org) => {
        this.setState({...this.state, edit: false, orgName: org.name, rate: org.hourlyRate});
    }

    renderEditForm() {
        if (this.state.edit) {
            let org = {name: this.state.orgName, hourlyRate: this.state.rate, id: this.state.orgId};
            return (<EditOrganisationComponent org={org} sessionId={this.state.sessionId} onSubmit={this.handleUpdatedOrg} />)
        }
    }

    render() {
        return (
            <div>
                <h1><strong>{this.state.orgName}</strong></h1>
                <div className="ui buttons">
                    <button onClick={this.handleViewShift} className="ui green basic button"><i className="calendar outline icon"></i>View Shifts</button>
                    <button onClick={this.handleEdit} className="ui blue basic button"><i className="edit outline icon"></i>Edit</button>
                    <button onClick={this.handleLeave} className="ui red basic button"><i className="user times icon"></i>Leave</button>
                </div>
                {this.renderShifts()}
                {this.renderEditForm()}
            </div>
        )
    }
}