import React from 'react'
import './dashboard.css';

const axios = require('axios')
const env = require('../../environment').environment;


export class DashboardComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            sessionId: props.location.state.sessionId
        };
    }

    componentDidMount() {
        if (this.state.sessionId) {
            let headers = {headers: {'Authorization': this.state.sessionId, 'content-type': 'application/json'}}
            axios.get(env.BASE_URL + 'users/me', headers).then(
                resp => {
                    console.log(resp)
            })
        }
    }

    render() {
        return (
            <div>Dashboard works!</div>
        )
    }
}