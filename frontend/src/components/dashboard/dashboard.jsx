import React from 'react'
import './dashboard.css';

import { EmployedComponent } from './employed/employed';
import { NotEmployedComponent } from './not-employed/not-employed';
import { EditUserComponent } from './edit-user/edit-user';

const axios = require('axios')
const env = require('../../environment').environment;

export class DashboardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: props.location.state.sessionId,
            username: null,
            userId: null,
            email: null,
            orgId: null,
            orgName: null,
            rate: null,
            //edit user screen
            editUser: false
        };
    }

    getHeaders() {
        return {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}};
    }

    componentDidMount() {
        if (this.state.sessionId) {
            let headers = this.getHeaders();
            axios.get(env.BASE_URL + 'users/me', headers).then(
                resp => {
                    this.setState({
                        ...this.state, 
                        username: resp.data.name,
                        userId: resp.data.id,
                        email: resp.data.email,
                    })
                    let orgId = resp.data.organisationId
                    if (orgId) {
                        axios.get(env.BASE_URL + 'organisations/'+orgId, headers).then(
                            resp => {
                                let org = resp.data;
                                this.setState({...this.state, orgId: org.id, orgName: org.name, rate: org.hourlyRate});
                            }
                        )
                    }
            })
        }
    }

    renderMainContent() {
        if (this.state.editUser) {
            return;
        }
        if (!this.state.orgId) {
            return (<NotEmployedComponent sessionId={this.state.sessionId} onOrgChange={this.handleOrgChange} />)
        }
        let org = {id: this.state.orgId, name: this.state.orgName, rate: this.state.rate};
        let user = {id: this.state.userId, name: this.state.username}
        return (<EmployedComponent sessionId={this.state.sessionId} org={org} user={user} onOrgChange={this.handleOrgChange}/>)
    }

    handleOrgChange = (org) => {
        if (org) {
            this.setState({...this.state, orgId: org.id, orgName: org.name, rate: org.hourlyRate});
        } else {
            this.setState({...this.state, orgId: null, orgName: null, rate: null});
        }        
    }

    handleLogout = () => {
        axios.delete(env.BASE_URL + 'auth/logout', this.getHeaders()).then(
            resp => {
                this.props.history.push('/');
            }
        )
    }

    handleEdit = () => {
        this.setState({...this.state, editUser: true});
    }

    handleUserChange = (user) => {
        this.setState({...this.state, username: user.name, email: user.email});
    }

    handleExitEditPage = () => {
        this.setState({...this.state, editUser: false});
    }
    renderEditUser() {
        if (this.state.editUser) {
            const user = {id: this.state.userId, name: this.state.username, email: this.state.email};
            return (<EditUserComponent user={user} onUserChange={this.handleUserChange} onExit={this.handleExitEditPage} headers={this.getHeaders()}/>)
        }
    }

    render() {
        if (this.state.username) {
            return (
                <div className="ui container pt--2">
                    <h1 className="adnat-title">Adnat</h1>
                    <p>
                        Logged in as {this.state.username}
                        {(!this.state.editUser) && (<span className="ml--2"><button onClick={this.handleEdit} className="ui blue basic mini button">Edit</button></span>)}
                        <span className="ml--2"><button onClick={this.handleLogout} className="ui grey basic mini button">Logout</button></span>
                    </p>
                    {this.renderMainContent()}
                    {this.renderEditUser()}
                </div>
            )
        }
        return (
            <div>Loading ...</div>
        )
    }
}