var stfuser = 0;
var CustomerBox = React.createClass({
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

    handleCustomerSubmit: function (customer) {
    
        $.ajax({
            url: '/customer/',
            dataType: 'json',
            type: 'POST',
            data: customer,
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
            <div className="CustomerBox">
                <h1>Patients</h1>
                <Customerform2 onCustomerSubmit = {this.handleCustomerSubmit} />
            </div>
        );}
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customerfirstname:"",
            customerlastname: "",
            customeraddress: "",
            customeremail:"",
            customerphone:"",
            customerzip: "",
            customerstate:"",
            customerispatient:"",
            customerpw: "",
            customerpw2: ""
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var customerfirstname = this.state.customerfirstname.trim();
        var customerlastname = this.state.customerlastname.trim();
        var customeraddress = this.state.customeraddress.trim();
        var customeremail = this.state.customeremail.trim();
        var customerphone = this.state.customerphone.trim();
        var customerzip = this.state.customerzip.trim();
        var customerstate = this.state.customerstate;
        var customerispatient = this.state.selectedOption
        var customerpw = this.state.customerpw.trim();
        var customerpw2 = this.state.customerpw2.trim();

        if(!this.validateEmail(customeremail)) {
            console.log("Bad Email!!!" + this.validateEmail(customeremail));
            return;
        }
        if(isNaN(customerzip)) {
            console.log("Not a number: " + customerzip);
            return;
        }

        if (customerpw != customerpw2) {
            console.log("Passwords do not match!!");
            alert("Passwords do not match!!");
            return;
        }

        if(!customerfirstname || !customerlastname || !customeremail || !customerpw || !customerpw2) {
            console.log("Field Missing");
            return;
        }

        this.props.onCustomerSubmit({
            customerfirstname: customerfirstname,
            customerlastname: customerlastname,
            customeraddress: customeraddress,
            customeremail: customeremail,
            customerphone: customerphone,
            customerzip: customerzip,
            customerstate: customerstate,
            customerispatient: customerispatient,
            customerpw: customerpw
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
                <h2>Insert New Patient Info</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.customerfirstname}
                                    uniqueName="customerfirstname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerfirstname')}
                                    errorMessage="Patient Name is invalid"
                                    emptyMessage="Patient Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.customerlastname}
                                    uniqueName="customerlastname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerlastname')}
                                    errorMessage="Patient Name is invalid"
                                    emptyMessage="Patient Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient E-Mail</th>
                            <td>
                                <TextInput
                                    value={this.state.customeremail}
                                    uniqueName="customeremail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'customeremail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                                <TextInput
                                    value={this.state.customeraddress}
                                    uniqueName="customeraddress"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customeraddress')}
                                    errorMessage="Patient Address is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.customerphone}
                                    uniqueName="customerphone"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerphone')}
                                    errorMessage="Invalid Phone"
                                    emptyMessage="Phone Number Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zip</th>
                            <td>
                                <TextInput
                                    value={this.state.customerzip}
                                    uniqueName="customerzip"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerzip')}
                                    errorMessage=""
                                    emptyMessage="" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                                <TextInput
                                    value={this.state.customerstate}
                                    uniqueName="customerstate"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerstate')}
                                    errorMessage="Did not enter a state"
                                    emptyMessage="" />
                            </td>
                        </tr>
                        <tr>
                            <th>Is the patient a customer?</th>
                            <td>
                                <input 
                                    type = "radio" 
                                    name = "custpatient" 
                                    id = "custpatientno" 
                                    value = "0" 
                                    checked = {this.state.selectedOption === "0"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> Yes
                                   <input 
                                    type = "radio" 
                                    name = "custpatient" 
                                    id = "custpatientyes" 
                                    value = "1" 
                                    checked = {this.state.selectedOption === "1"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> No
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.customerpw}
                                    uniqueName="customerpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerpw')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.customerpw2}
                                    uniqueName="customerpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'customerpw2')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Insert Patient" />
               
            </form>
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
    <CustomerBox />,
    document.getElementById('content')
);