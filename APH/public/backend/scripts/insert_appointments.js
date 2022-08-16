var stfuser = 0;
var AppointmentBox = React.createClass({
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
    handleAppointmentSubmit: function (appointment) {
    
        $.ajax({
            url: '/appointment/',
            dataType: 'json',
            type: 'POST',
            data: appointment,
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
            <div className="AppointmentBox">
                <h1>Appointments</h1>
                <Appointmentform2 onAppointmentSubmit = {this.handleAppointmentSubmit} />
            </div>
        );}
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid:"",
            appointmentdate: "",
            appointmenttime: "",
            customer_id: [],
            staff_id: [],
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadCustomers: function(){
        $.ajax({
            url: '/getpatients/',
            dataType: 'json',
            cache: false,
            success: function (customer_id) {
                this.setState({ customer_id: customer_id });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    loadStaff: function(){
        $.ajax({
            url: '/getdoctors/',
            dataType: 'json',
            cache: false,
            success: function (staff_id) {
                this.setState({ staff_id: staff_id });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadCustomers();
        this.loadStaff();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentdate = this.state.appointmentdate;
        var appointmenttime = appTimes.value;
        var customer_id = customerid.value;
        var staff_id = staffid.value;

        this.props.onAppointmentSubmit({
            appointmentid: appointmentid,
            appointmentdate: appointmentdate,
            appointmenttime: appointmenttime,
            customer_id: customer_id,
            staff_id: staff_id
        });

    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
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
                <h2>Appointments</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <TextInput
                                    value={this.state.appointmentid}
                                    uniqueName="appointmentid"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentid')}
                                    errorMessage="Appointment ID is invalid"
                                    emptyMessage="Appointment ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                                <TextInput
                                    inputType = 'Date'
                                    value={this.state.appointmentdate}
                                    uniqueName="appointmentdate"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'appointmentdate')}
                                    errorMessage="Appointment Date is invalid"
                                    emptyMessage="Appointment Date is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td><SelectTime data = {this.state.appointmenttime} /></td>    
                        </tr>
                        <tr>
                            <th>Select Patient</th>
                            <td><SelectCustomerList data = {this.state.customer_id} /></td>    
                        </tr> 
                        <tr>
                            <th>Select Doctor</th>
                            <td><SelectStaffList data = {this.state.staff_id} /></td>    
                        </tr> 
                       
                    </tbody>
                </table>
                <input type="submit" value="Insert Appointment" />
               
            </form>
        );
    }
});

var SelectCustomerList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (customerList){
            return (
                <option
                    key = {customerList.customer_id}
                    value = {customerList.customer_id}
                    >
                        {customerList.customer_firstname + " " + customerList.customer_lastname + " " + customerList.customer_id}
                    </option>
            );
        });
        return (
            <select name = "customerid" id = "customerid">
                {optionNodes}
            </select>
        );
    }
});

var SelectStaffList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (staffList){
            return (
                <option
                    key = {staffList.staff_id}
                    value = {staffList.staff_id}
                    >
                        {staffList.staff_firstname + " " + staffList.staff_lastname + " " + staffList.staff_id}
                    </option>
            );
        });
        return (
            <select name = "staffid" id = "staffid">
                {optionNodes}
            </select>
        );
    }
});

var SelectTime = React.createClass ({
    render: function () {
        return (
            <select name = "appTimes" id = "appTimes">
                <option value="8:00am-9:00am">8am-9am</option>,
                <option value="9:00am-10:00am">9am-10am</option>
                <option value="10:00am-9:00am">10am-11am</option>,
                <option value="11:00am-12:00pm">11am-12pm</option> 
                <option value="12:00pm-1:00pm">12pm-1pm</option>
                <option value="1:00pm-2:00pm">1pm-2pm</option>,
                <option value="2:00pm-3:00pm">2pm-3pm</option> 
                <option value="3:00pm-4:00pm">3pm-4pmm</option>,
                <option value="4:00pm-5:00pm">4pm-5pm</option>  
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
    <AppointmentBox />,
    document.getElementById('content')
);