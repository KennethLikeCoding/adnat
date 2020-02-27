import React from 'react'

import "./edit-organisation.css";
const axios = require('axios');
const env = require('../../../environment').environment;

export class EditOrganisationComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
           name: this.props.org.name,
           hourlyRate: this.props.org.hourlyRate,
        };
    }

    onNameChange = (event) => {
        this.setState({...this.state, name: event.target.value});
    }

    onSalaryChange = (event) => {
        this.setState({...this.state, hourlyRate: event.target.value});
    }

    getHeaders() {
        return {headers: {'Authorization': this.props.sessionId, 'content-type': 'application/json'}};
    }

    handleUpdate = (event) => {
        event.preventDefault()
        axios.put(env.BASE_URL + 'organisations/' + this.props.org.id, this.state, this.getHeaders()).then(
            resp => {
                this.props.onSubmit(this.state);
        })
    }

    handleCancel = () => {
        this.props.onSubmit();
    }

    render() {
        return (
            <form className="ui form edit-form">
                <div className="field">
                    <label>Organisation</label>
                    <input onChange={this.onNameChange} type="text" value={this.state.name} />
                </div>
                <div className="field">
                    <label>Hourly Rate</label>
                    <input onChange={this.onSalaryChange} type="number" value={this.state.hourlyRate}/>
                </div>
                <button onClick={this.handleUpdate} className="ui green basic button">Update</button>
                <button onClick={this.handleCancel} className="ui grey basic button">Cancel</button>
            </form>
        )
    }
}