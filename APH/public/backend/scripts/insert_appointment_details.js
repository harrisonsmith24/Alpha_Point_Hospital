var stfuser = 0;
var AppointmentDetailsBox = React.createClass({
    getInitialState: function () {
        return { data: [],
                viewthepage: 0 };
    },
    loadAllowLogin: function () {
        $.ajax({
            url: '/getloggedin',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ viewthepage: data });
                stfuser = this.state.viewthepage;
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleAppointmetDetailsSubmit: function (appointment_details) {
    
        $.ajax({
            url: '/appointment_details/',
            dataType: 'json',
            type: 'POST',
            data: appointment_details,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },

    componentDidMount: function(){
        this.loadAllowLogin();
    },

    render: function () {
        if(this.state.viewthepage == 0) {
            return(
                <div>
                    <h1>You are not logged in!</h1>
                    <h2>To view the page information, use a login or check with your system administrator.</h2>
                </div>
            );
        }else{
        return (
            <div className="AppointmetDetailsBox">
                <h1>Appointmet Details</h1>
                <AppointmetDetailsform2 onAppointmetDetailsSubmit = {this.handleAppointmetDetailsSubmit} />
            </div>
        );}
    }
});

var AppointmetDetailsform2 = React.createClass({
    getInitialState: function () {
        return {
            appointment_key: [],
            appointmentdetail_bloodpressure: "",
            appointmentdetail_weight: "",
            appointmentdetail_pulse: "",
            appointmentdetail_vision: "",
            appointmentdetail_height: "",
            appointmentdetail_notes: "",
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadAppointments: function(){
        $.ajax({
            url: '/getappointments/',
            dataType: 'json',
            cache: false,
            success: function (appointment_key) {
                this.setState({ appointment_key: appointment_key });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadAppointments();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var appointment_key = appID.value
        var appointmentdetail_bloodpressure = this.state.appointmentdetail_bloodpressure.trim();
        var appointmentdetail_weight = this.state.appointmentdetail_weight.trim();
        var appointmentdetail_pulse = this.state.appointmentdetail_pulse.trim();
        var appointmentdetail_vision = this.state.appointmentdetail_vision.trim();
        var appointmentdetail_height = this.state.appointmentdetail_height.trim();
        var appointmentdetail_notes = this.state.appointmentdetail_notes.trim();

        this.props.onAppointmetDetailsSubmit({
            appointment_key: appointment_key,
            appointmentdetail_bloodpressure: appointmentdetail_bloodpressure,
            appointmentdetail_weight: appointmentdetail_weight,
            appointmentdetail_pulse: appointmentdetail_pulse,
            appointmentdetail_vision: appointmentdetail_vision,
            appointmentdetail_height: appointmentdetail_height,
            appointmentdetail_notes: appointmentdetail_notes
            
        });

    },

    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Appointmet Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Select Appointment Key</th>
                            <td><SelectAppointment data = {this.state.appointment_key} /></td>    
                        </tr> 
                        <tr>
                            <th>Blood Pressure</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_bloodpressure}
                                    uniqueName="appointmentdetail_bloodpressure"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_bloodpressure')}
                                    errorMessage="Blood Pressure is invalid"
                                    emptyMessage="Blood Pressure is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_weight}
                                    uniqueName="appointmentdetail_weight"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_weight')}
                                    errorMessage="Weight is invalid"
                                    emptyMessage="Weight is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Pulse</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_pulse}
                                    uniqueName="appointmentdetail_pulse"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_pulse')}
                                    errorMessage="Pulse is invalid"
                                    emptyMessage="Pulse is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Vision</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_vision}
                                    uniqueName="appointmentdetail_vision"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_vision')}
                                    errorMessage="Vision is invalid"
                                    emptyMessage="Vision is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Height</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_height}
                                    uniqueName="appointmentdetail_height"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_height')}
                                    errorMessage="Height is invalid"
                                    emptyMessage="Height is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Notes</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentdetail_notes}
                                    uniqueName="appointmentdetail_notes"
                                    textArea={true}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdetail_notes')}
                                    errorMessage="Notes are invalid"
                                    emptyMessage="Notes are required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment" />
               
            </form>
        );
    }
});

var SelectAppointment = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (appointmentList){
            return (
                <option
                    key = {appointmentList.appointment_key}
                    value = {appointmentList.appointment_key}
                    >
                        {appointmentList.appointment_key}
                    </option>
            );
        });
        return (
            <select name = "appID" id = "appID">
                {optionNodes}
            </select>
        );
    }
});

var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <AppointmentDetailsBox />,
    document.getElementById('content')
);