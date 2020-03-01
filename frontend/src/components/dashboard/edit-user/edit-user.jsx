import React from 'react'

const axios = require('axios')
const env = require('../../../environment').environment;

export class EditUserComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: this.props.user.name,
            email: this.props.user.email,
            // passwords
            currentPassword: "",
            newPassword: "",
            newPasswordConfirmation: "",
            // buttons
            changeProfile: false,
            changePassword: false
        };
    }

    // --------------------------------------------------- Listeners ---------------------------------------
    handleUpdate = (event) => {
        event.preventDefault();
        const body = {name: this.state.name, email: this.state.email};
        axios.put(env.BASE_URL + 'users/me', body, this.props.headers).then(
            resp => {
                this.setState({changeProfile: false});
                this.props.onUserChange(body);
        })
    }

    handleCancel = () => {
        this.setState({changeProfile: false, name: this.props.user.name, email: this.props.user.email})
    }

    handleSubmitPwReset = (event) => {
        event.preventDefault();
        const body = {
            "oldPassword": this.state.currentPassword, 
            "newPassword": this.state.newPassword,
            "newPasswordConfirmation": this.state.newPasswordConfirmation
        }
        axios.put(env.BASE_URL + 'users/me/change_password', body, this.props.headers).then(
            resp => {
                this.setState({changePassword: false});
        })
    }

    handleCancelPwReset = () => {
        this.setState({changePassword: false, currentPassword: "", newPassword: "", newPasswordConfirmation: "",});
    }

    // -------------------------------------- end of listeners -------------------------------------------------------------



    // --------------------------------------- render functions -------------------------------------------------------------
    renderEditForm() {
        if (this.state.changeProfile) {
            return (
                <form className="ui form edit-form pt--2">
                    <h3 className="ui dividing header">Update Profile</h3>
                    <div className="field">
                        <label>Name</label>
                        <input onChange={(e)=>this.setState({name: e.target.value})} type="text" value={this.state.name} />
                    </div>
                    <div className="field">
                        <label>Email</label>
                        <input onChange={(e)=>this.setState({email: e.target.value})} type="text" value={this.state.email} />
                    </div>
                    <button onClick={this.handleUpdate} className="ui green basic button">Update</button>
                    <button onClick={this.handleCancel} className="ui grey basic button">Cancel</button>
                </form>
            )
        }
    }

    renderChangePasswordForm() {
        if (this.state.changePassword) {
            return (
                <form className="ui form edit-form pt--2">
                    <h3 className="ui dividing header">Reset Password</h3>
                    <div className="field">
                        <label>Current password</label>
                        <input onChange={(e)=>this.setState({currentPassword: e.target.value})} type="password" />
                    </div>
                    <div className="field">
                        <label>New password</label>
                        <input onChange={(e)=>this.setState({newPassword: e.target.value})} type="password" value={this.state.newPassword}/>
                    </div>
                    <div className="field">
                        <label>New password confirmation</label>
                        <input onChange={(e)=>this.setState({newPasswordConfirmation: e.target.value})} type="password" value={this.state.newPasswordConfirmation}/>
                    </div>
                    <button onClick={this.handleSubmitPwReset} className="ui green basic button">Submit</button>
                    <button onClick={this.handleCancelPwReset} className="ui grey basic button">Cancel</button>
                </form>
            )
        }
    }

    render() {
        return (
            <div>
                <div className="ui buttons">
                    <button onClick={()=>this.props.onExit()} className="ui grey basic button">Back</button>
                    {!this.state.changeProfile && !this.state.changePassword && (<button onClick={()=>this.setState({changeProfile: true})} className="ui green basic button">Update profile</button>)}
                    {!this.state.changeProfile && !this.state.changePassword && (<button onClick={()=>this.setState({changePassword: true})} className="ui blue basic button">Change password</button>)}   
                </div>
                {this.renderEditForm()}
                {this.renderChangePasswordForm()}
            </div>
        )
    }
}
