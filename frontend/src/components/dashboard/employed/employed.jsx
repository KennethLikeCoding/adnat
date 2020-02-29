import React from 'react';
import { EditOrganisationComponent } from '../edit-organisation/edit-organisation';

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
            shifts: [],
            //buttons
            viewShift: false,
            edit: false,
            //new shift
            date: null,
            start: null,
            finish: null,
            break: 0
        };
    }

    getHeaders() {
        return {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}};
    }

    componentDidMount() {
        axios.get(env.BASE_URL + 'shifts', this.getHeaders()).then(
            (resp) => {
                resp.data.forEach(
                    shift => {
                        axios.get(env.BASE_URL + 'users/id/' + shift.userId, this.getHeaders()).then(
                            resp => {
                                shift['username'] = resp.data.name
                            }
                        )
                    }
                )
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

    submitShift = () => {
        let body = {
            userId: this.props.user.id,
            start: this.state.date + " " + this.state.start,
            finish: this.state.date + " " +this.state.finish,
            breakLength: this.state.breakLength
        }
        axios.post(env.BASE_URL + 'shifts', body, this.getHeaders()).then(
            (resp) => {
                let shiftsCopy =[...this.state.shifts];
                shiftsCopy.push(resp.data);
                this.setState({...this.state, shifts: shiftsCopy});
            }
        )
    }

    onDateChange = (event) => {
        this.setState({...this.state, date: event.target.value})
    }

    onStartChange = (event) => {
        this.setState({...this.state, start: event.target.value})
    }

    onFinishChange = (event) => {
        this.setState({...this.state, finish: event.target.value})
    }

    onBreakChange = (event) => {
        this.setState({...this.state, breakLength: event.target.value})
    }

    listShifts() {
        return this.state.shifts.map(
            (shift, i) => {
                const start = shift.start.split(' ');
                const finish = shift.finish.split(' ');
                
                const startHM = start[1].split(':');
                const finishHM = finish[1].split(':');
                const startHour = parseInt(startHM[0]) + parseInt(startHM[1])/60
                const endHour = parseInt(finishHM[0]) + parseInt(finishHM[1])/60
                let hours = endHour - startHour - shift.breakLength/60;
                const j = hours.toString().indexOf('.');
                if (j !== -1 && hours.toString().split('.')[1].length > 1) {
                    hours = hours.toFixed(2)    
                }

                return (
                    <tr key={i}>
                        <td>{shift.username}</td>
                        <td>{start[0]}</td>
                        <td>{start[1]}</td>
                        <td>{finish[1]}</td>
                        <td>{shift.breakLength}</td>
                        <td>{hours}</td>
                        <td>{hours * this.state.rate}</td>
                    </tr>
                )
            }
        )
    }
    
    renderShifts() {
        if (this.state.viewShift) {
            return (
                <table className="ui table">
                    <thead>
                        <tr>
                            <th>Employee name</th>
                            <th>Shift date</th>
                            <th>Start time</th>
                            <th>Finish time</th>
                            <th>Break length (minutes)</th>
                            <th>Hours worked</th>
                            <th>Shift cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.listShifts()}
                        <tr>
                            <td>{this.props.user.name}</td>
                            <td><input onChange={this.onDateChange} type="date" /></td>
                            <td><input onChange={this.onStartChange} type="time" /></td>
                            <td><input onChange={this.onFinishChange} type="time" /></td>
                            <td><input onChange={this.onBreakChange} type="number" /></td>
                            <td><button onClick={this.submitShift} className="mini ui basic button">Create Shift</button></td>
                            <td></td>
                        </tr>
                    </tbody>
                    </table>
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