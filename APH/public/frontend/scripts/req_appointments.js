var RequestBox = React.createClass({
    handleRequestSubmit: function (request) {
    
        $.ajax({
            url: '/requestappointment/',
            dataType: 'json',
            type: 'POST',
            data: request,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    render: function () {
        return (
            <div className="RequestBox">
                <h1>Request Appointment</h1>
                <Requestform2 onRequestSubmit = {this.handleRequestSubmit} />
            </div>
        );
    }
});

var Requestform2 = React.createClass({
    getInitialState: function () {
        return {
            requestname:"",
            requestemail: "",
            requestphone: "",
            requestdate: "",
            requesttime: "",
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var requestname = this.state.requestname.trim();
        var requestemail = this.state.requestemail.trim();
        var requestphone = this.state.requestphone.trim();
        var requestdate = this.state.requestdate;
        var requesttime = reqTimes.value;


        this.props.onRequestSubmit({
            requestname: requestname,
            requestemail: requestemail,
            requestphone: requestphone,
            requestdate: requestdate,
            requesttime: requesttime,
            
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
                <h2>Request</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Your Name</th>
                            <td>
                                <TextInput
                                    value={this.state.requestid}
                                    uniqueName="requestname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'requestname')}
                                    errorMessage="Name is invalid"
                                    emptyMessage="Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Your Email</th>
                            <td>
                                <TextInput
                                    value={this.state.requestemail}
                                    uniqueName="requestemail"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'requestemail')}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Your Phone Number</th>
                            <td>
                                <TextInput
                                    value={this.state.requestphone}
                                    uniqueName="requestphone"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'requestphone')}
                                    errorMessage="Phone Number is invalid"
                                    emptyMessage="Phone Number is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Request a Date</th>
                            <td>
                                <TextInput
                                    inputType= 'Date'
                                    value={this.state.requestdate}
                                    uniqueName="requestdate"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'requestdate')}
                                    errorMessage="Request ID is invalid"
                                    emptyMessage="Request ID is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Request a Time</th>
                            <td><SelectTime data = {this.state.reques} /></td>    
                        </tr>  
                       
                    </tbody>
                </table>
                <input type="submit" value="Insert Request" />
               
            </form>
        );
    }
});

var SelectTime = React.createClass ({
    render: function () {
        return (
            <select name = "reqTimes" id = "reqTimes">
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
    <RequestBox />,
    document.getElementById('content')
);