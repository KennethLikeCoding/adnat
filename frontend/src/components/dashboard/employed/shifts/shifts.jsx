import React from 'react';

const axios = require('axios');
const env = require('../../../../environment').environment;

export class ShiftsComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            shifts: this.props.shifts,
            rate: this.props.rate,
            //new shift
            date: null,
            start: null,
            finish: null,
            breakLength: 0,
            //edit shift
            editShift: false,
            shiftId: null,
            shiftIndex: null,
            //buttons
            edit: false
        }
    }

//--------------------------------------------------------- listeners -------------------------------------------

    handleHome = (event) => {
        event.preventDefault();
        this.props.onExit();
    }

    submitShift = () => {
        this.createShift();
    }
    
    handleEditShiftSubmit = (event) => {
        event.preventDefault();
        this.updateShift();
    }
    
    editShift(shift_id, i) {
        let shift = this.state.shifts[i];
        const start = shift.start.split(' ');
        const finish = shift.finish.split(' ');
        this.setState({editShift: true, shiftId: shift_id, shiftIndex: i, date: start[0], start: start[1], finish: finish[1], breakLength: shift.breakLength});
    }
// -------------------------------------------------- End of listeners ----------------------------------------------------


 // ---------------------------- helpers --------------------------------------------------------------------------

    calculateHoursNCost (start, finish, breakLength) {
        const startHM = start[1].split(':');
        const finishHM = finish[1].split(':');
        const startHour = parseInt(startHM[0]) + parseInt(startHM[1])/60
        const endHour = parseInt(finishHM[0]) + parseInt(finishHM[1])/60
        let hours = endHour - startHour - breakLength/60;
        let cost = hours * this.state.rate;

        const day1 = start[0].split('-');
        
        const d1 = new Date(day1[0], day1[1] - 1, day1[2], 0, 0, 0, 0)
        let overnight = false;
        // calculate hours and cost (no penalty) for overnight shift
          if (hours < 0) {
            overnight = true;
            hours = 24 - startHour + endHour - breakLength/60;
            cost = this.state.rate * hours;
        }

        // There are three cases where penalty rates may apply, which will overwrite the cost calculation above
        
        // case 1: start and finish are both on the same day (Sunday)
        if (!overnight && d1.getDay()===0) {
            cost *= 2;
        }
        // case 2: start on Sunday, finish on Monday
        if (overnight && d1.getDay()===0) {
            const normalHours = endHour - breakLength/60;
            let penaltyHours = 24 - startHour;
            if (normalHours < 0) {
                penaltyHours += normalHours;
                cost = penaltyHours * this.state.rate * 2;
            } else {
                cost = this.state.rate * (normalHours + penaltyHours * 2)
            }
        }
        // case 3: start on Saturday, finish on Sunday
        if (overnight && d1.getDay()===6) {
            const penaltyHours = endHour - breakLength/60;
            let normalHours = 24 - startHour;
            if (penaltyHours < 0) {
                normalHours += penaltyHours;
                cost = normalHours * this.state.rate;
            } else {
                cost = this.state.rate * (normalHours + penaltyHours * 2)
            }
        }
        cost = cost.toFixed(2);
        const j = hours.toString().indexOf('.');
        if (j !== -1 && hours.toString().split('.')[1].length > 1) {
            hours = hours.toFixed(2)    
        }
        return [hours, cost];
    }

    // ------------------------------ requests -----------------------------------------------
   
    createShift() {
        let body = {
            userId: this.props.user.id,
            start: this.state.date + " " + this.state.start,
            finish: this.state.date + " " +this.state.finish,
            breakLength: this.state.breakLength
        }
        axios.post(env.BASE_URL + 'shifts', body, this.props.headers).then(
            (resp) => {
                let shiftsCopy =[...this.state.shifts];
                resp.data['username'] = this.props.user.name;
                shiftsCopy.push(resp.data);
                this.setState({shifts: shiftsCopy});
            }
        )
    }

    deleteShift(shift_id, i) {
        axios.delete(env.BASE_URL + 'shifts/'+shift_id, this.props.headers).then(
            resp => {
                let shifts = [...this.state.shifts];
                shifts.splice(i, 1);
                this.setState({shifts: shifts});
            }
        )
    }

    updateShift() {
        const start = this.state.date + " " + this.state.start;
        const finish = this.state.date + " " + this.state.finish;
        const shift = {start: start, finish: finish, breakLength: this.state.breakLength};
        axios.put(env.BASE_URL + 'shifts/' + this.state.shiftId, shift, this.props.headers).then(
            (resp) => {
                let shifts = [...this.state.shifts];
                const i = this.state.shiftIndex;
                shifts[i].start = start;
                shifts[i].finish = finish;
                shifts[i].breakLength = this.state.breakLength;
                this.setState({editShift: false, shifts: shifts, start: null, finish: null, breakLength: 0});
            }
        )
    }

// ---------------------------------------------- render functions ----------------------------------------------------------
    renderEditShift() {
        const i = this.state.shiftIndex;
        const shift = this.state.shifts[i];
        if (this.state.editShift) {
            return (
                <form className="ui form edit-form pt--2">
                    <h3 className="ui dividing header">Edit Shift {shift.id}</h3>
                    <div className="field">
                        <label>Employee name</label>
                        <span>{shift.username}</span>
                    </div>
                    <div className="field">
                        <label>Shift date</label>
                        <input type="date" onChange={(e)=>this.setState({date: e.target.value})} value={this.state.date}/>
                    </div>
                    <div className="field">
                        <label>Start time</label>
                        <input type="time" onChange={(e)=>this.setState({start: e.target.value})} value={this.state.start}/>
                    </div>
                    <div className="field">
                        <label>Finish time</label>
                        <input type="time" onChange={(e)=>this.setState({finish: e.target.value})} value={this.state.finish}/>
                    </div>
                    <div className="field">
                        <label>Break length (minutes)</label>
                        <input type="number" onChange={(e)=>this.setState({breakLength: e.target.value})} value={this.state.breakLength}/>
                    </div>
                    <button onClick={this.handleEditShiftSubmit} className="ui green basic button">Submit</button>
                    <button onClick={()=>this.setState({editShift: false})} className="ui grey basic button">Cancel</button>
                </form>
            )
        }
    }

    listShifts() {
        return this.state.shifts.map(
            (shift, i) => {
                const start = shift.start.split(' ');
                const finish = shift.finish.split(' ');
                let hoursCost = this.calculateHoursNCost(start, finish, shift.breakLength);
                return (
                    <tr key={i}>
                        <td>{shift.username}</td>
                        <td>{start[0]}</td>
                        <td>{start[1]}</td>
                        <td>{finish[1]}</td>
                        <td>{shift.breakLength}</td>
                        <td>{hoursCost[0]}</td>
                        <td>${hoursCost[1]}</td>
                        <td className="flex-row">
                            <span><button onClick={()=>this.editShift(shift.id, i)} className="mini ui basic grey button">Edit</button></span>
                            <span><button onClick={()=>this.deleteShift(shift.id, i)} className="mini ui basic brown button">Delete</button></span>
                        </td>
                    </tr>
                )
            }
        )
    }

    renderShifts() {
        if (!this.state.editShift) {
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.listShifts()}
                        <tr>
                            <td>{this.props.user.name}</td>
                            <td><input onChange={(e)=>this.setState({date: e.target.value})} type="date" /></td>
                            <td><input onChange={(e)=>this.setState({start: e.target.value})} type="time" /></td>
                            <td><input onChange={(e)=>this.setState({finish: e.target.value})} type="time" /></td>
                            <td><input onChange={(e)=>this.setState({breakLength: e.target.value})} type="number" /></td>
                            <td><button onClick={this.submitShift} className="mini ui basic button">Create Shift</button></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                    </table>
            )
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.handleHome} className="ui teal basic button">Home</button>
                {this.renderShifts()}
                {this.renderEditShift()}
            </div>
        )
    }
}