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
            incomplete: false,
            shortPassword: false,
            mismatch: false,
            error: false,
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
        if (this.state.newPassword === "" || this.state.oldPassword ==="" || this.state.newPasswordConfirmation === "") {
            this.setState({incomplete: true})
            return;
        }
        if (this.state.newPassword !== this.state.newPasswordConfirmation) {
            this.setState({mismatch: true})
            return;
        }
        if (this.state.newPassword.length < 6) {
            this.setState({shortPassword: true})
            return;
        }
        const body = {
            "oldPassword": this.state.currentPassword,
            "newPassword": this.state.newPassword,
            "newPasswordConfirmation": this.state.newPasswordConfirmation
        }
        axios.put(env.BASE_URL + 'users/me/change_password', body, this.props.headers).then(
            resp => {
                this.setState({changePassword: false});
        })
        .catch((error) => {
            this.setState({error: true});
        }) 
    }

    handleCancelPwReset = () => {
        this.setState({changePassword: false, currentPassword: "", newPassword: "", newPasswordConfirmation: "",});
    }

    handleCurrPwChange = (event) => {
        this.setState({currentPassword: event.target.value, incomplete: false, mismatch: false, error: false})
    }
    
    handleNewPwChange = (event) => {
        this.setState({newPassword: event.target.value, incomplete: false, shortPassword: false, mismatch: false})
    }

    handleNewPwConfChange = (event) => {
        this.setState({newPasswordConfirmation: event.target.value, incomplete: false, shortPassword: false, mismatch: false})
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

    renderResetPwErrorMsg() {
        if (this.state.incomplete) {
            return(<div className="ui red message">Please complete the form</div>)
        }
        if (this.state.shortPassword) {
            return (<div className="ui red message">Password must contain at least 6 characters</div>)
        }
        if (this.state.mismatch) {
            return (<div className="ui red message">Password don't match</div>)
        }
        if (this.state.error) {
            return (<div className="ui red message">You current password is incorrect</div>)
        }
    }

    renderChangePasswordForm() {
        if (this.state.changePassword) {
            return (
                <div>
                    <form className="ui form edit-form pt--2">
                        <h3 className="ui dividing header">Reset Password</h3>
                        <div className="field">
                            <label>Current password</label>
                            <input onChange={this.handleCurrPwChange} type="password" />
                        </div>
                        <div className="field">
                            <label>New password</label>
                            <input onChange={this.handleNewPwChange} type="password" value={this.state.newPassword}/>
                        </div>
                        <div className="field">
                            <label>New password confirmation</label>
                            <input onChange={this.handleNewPwConfChange} type="password" value={this.state.newPasswordConfirmation}/>
                        </div>
                        <button onClick={this.handleSubmitPwReset} className="ui green basic button">Submit</button>
                        <button onClick={this.handleCancelPwReset} className="ui grey basic button">Cancel</button>
                    </form>
                    {this.renderResetPwErrorMsg()}
                </div>
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
