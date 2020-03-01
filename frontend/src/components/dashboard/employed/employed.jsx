import React from 'react';
import { EditOrganisationComponent } from '../edit-organisation/edit-organisation';
import { ShiftsComponent } from './shifts/shifts';

import './employed.css'

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
            edit: false,
            viewShift: false,
            shifts: []
        };
    }

    componentDidMount() {
        axios.get(env.BASE_URL + 'shifts', this.getHeaders()).then(
            (resp) => {
                resp.data.forEach(
                    (shift) => {
                        axios.get(env.BASE_URL + 'users/id/' + shift.userId, this.getHeaders()).then(
                            resp => {
                                shift['username'] = resp.data.name
                            }
                        )
                    }
                )
                this.setState({shifts: resp.data})
             }
        )
    }


    // ---------------------------- Listeners -------------------------------------------------
    handleViewShift = () => {
        this.setState({viewShift: true, edit: false});
    }

    handleEdit = () => {
        this.setState({viewShift: false, edit: true});
    }

    handleLeave = () => {
        axios.post(env.BASE_URL + 'organisations/leave', null, this.getHeaders()).then(
            (resp) => {
                this.props.onOrgChange(null);             
            }
        )
    }

    handleUpdatedOrg = (org) => {
        this.setState({edit: false, orgName: org.name, rate: org.hourlyRate});
    }

    handleExitShiftsScreen = () => {
        this.setState({viewShift: false});
    }

    // ------------------------------- End of listeners --------------------------------------------





    // -------------------------------- render functions ---------------------------------------------
    renderEditForm() {
        if (this.state.edit) {
            let org = {name: this.state.orgName, hourlyRate: this.state.rate, id: this.state.orgId};
            return (<EditOrganisationComponent org={org} sessionId={this.state.sessionId} onSubmit={this.handleUpdatedOrg} />)
        }
    }

    // -------------------------------- End of render functions ---------------------------------------------




    // helper
    getHeaders() {
        return {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}};
    }

    render() {
        return (
            <div className="pb--5">
                <h1><strong>{this.state.orgName}</strong></h1>
                {!this.state.viewShift && (
                    <div className="ui buttons">
                        <button onClick={this.handleViewShift} className="ui green basic button"><i className="calendar outline icon"></i>View Shifts</button>
                        <button onClick={this.handleEdit} className="ui blue basic button"><i className="edit outline icon"></i>Edit</button>
                        <button onClick={this.handleLeave} className="ui red basic button"><i className="user times icon"></i>Leave</button>
                    </div>
                )}
                {this.renderEditForm()}
                {this.state.viewShift && (<ShiftsComponent shifts={this.state.shifts} onExit={this.handleExitShiftsScreen} user={this.props.user} headers={this.getHeaders()} rate={this.state.rate}/>)}
            </div>
        )
    }
}