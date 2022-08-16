var stfuser = 0;
var StaffBox = React.createClass({
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
    handleStaffSubmit: function (staff) {

        $.ajax({
            url: '/staff/',
            dataType: 'json',
            type: 'POST',
            data: staff,
            success: function (data){
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err){
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
            <div className="StaffBox">
                <h1>Staff</h1>
                <Staffform2 onStaffSubmit={this.handleStaffSubmit}/>
            </div>
        );}
    }
});

var Staffform2 = React.createClass({
    getInitialState: function () {
        return {
            stafffirstname:"",
            stafflastname: "",
            staffaddress:"",
            staffphone: "",
            staffzip: "",
            staffstate: '',
            staffemail: "",
            data:[],
            staffsalary: "",
            staffpw: "",
            staffpw2: "",
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadStaffTypes: function(){
        $.ajax({
            url: '/getstaffpositions/',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadStaffTypes();
    },

    handleSubmit: function (e){

        e.preventDefault();

        var stafffirstname = this.state.stafffirstname.trim();
        var stafflastname = this.state.stafflastname.trim();
        var staffaddress= this.state.staffaddress.trim();
        var staffphone = this.state.staffphone.trim();
        var staffzip = this.state.staffzip.trim();
        var staffstate= this.state.staffstate.trim();
        var staffemail = this.state.staffemail.trim();
        var stafftype = stype.value;
        var staffsalary = this.state.staffsalary;
        var staffpw = this.state.staffpw.trim();
        var staffpw2 = this.state.staffpw2.trim();
        console.log("PW: " + staffpw);

        if (staffpw != staffpw2) {
            alert("Passwords do not match!");
            return;
        }
        if (!this.validateEmail(staffemail)) {
            console.log("Bad Email " + this.validateEmail(staffemail));
            return;
        }
        if (isNaN(staffsalary)) {
            console.log("Not a number" + staffsalary);
            return;
        }
        if (!stafffirstname || !staffemail || !staffsalary){
            console.log("Field Missing!");
            return;
        }

        this.props.onStaffSubmit({
            stafffirstname: stafffirstname,
            stafflastname: stafflastname,
            staffaddress: staffaddress,
            staffphone: staffphone,
            staffzip: staffzip,
            staffstate: staffstate,
            staffemail: staffemail,
            stafftype: stafftype,
            staffsalary: staffsalary, 
            staffpw: staffpw   
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
    validateNumber: function (value) {
        if (isNaN(value)){
            return ("Not a number");
        };

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
            <form className="StaffForm" onSubmit={this.handleSubmit}>
                <h2>Staffs</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Staff First Name</th>
                            <td>
                                <TextInput
                                    value={this.state.stafffirstname}
                                    uniqueName="stafffirstname"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'stafffirstname')}
                                    errorMessage="Staff Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Last Name</th>
                            <td>
                                <TextInput
                                    value={this.state.stafflastname}
                                    uniqueName="stafflastname"
                                    textArea={false}
                                    required={false}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'stafflastname')}
                                    errorMessage="Staff Name is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Address</th>
                            <td>
                                <TextInput
                                    value={this.state.staffaddress}
                                    uniqueName="staffaddress"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'staffaddress')}
                                    errorMessage="Staff Address is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Phone</th>
                            <td>
                                <TextInput
                                    value={this.state.staffphone}
                                    uniqueName="staffphone"
                                    textArea={false}
                                    required={false}
                                    minCharacters={6}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'staffphone')}
                                    errorMessage="Staff Phone is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Zip</th>
                            <td>
                                <TextInput
                                    value={this.state.staffzip}
                                    uniqueName="staffzip"
                                    textArea={false}
                                    required={true}
                                    minCharacters={5}
                                    maxCharacters={5}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'staffzip')}
                                    errorMessage="Zip is wrong"
                                    emptyMessage="required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff State</th>
                            <td>
                                <TextInput
                                    value={this.state.staffstate}
                                    uniqueName="staffstate"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'staffstate')}
                                    errorMessage="State is wrong"
                                    emptyMessage="required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff E-Mail</th>
                            <td>
                                <TextInput
                                    value={this.state.staffemail}
                                    uniqueName="staffemail"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'staffemail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Type</th>
                            <td><SelectList data = {this.state.data} /></td>    
                        </tr> 
                        <tr>
                            <th>Staff Salary</th>
                            <td>
                                <TextInput
                                    value={this.state.staffsalary}
                                    uniqueName="staffsalary"
                                    textArea={false}
                                    required={false}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'staffsalary')}
                                    errorMessage="Did not enter a correct salary value"
                                    emptyMessage="Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.staffpw}
                                    uniqueName="staffpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'staffpw')}
                                    errorMessage="Invlid Password" 
                                    emptyMessage="Password is required"/>
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.staffpw2}
                                    uniqueName="staffpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'staffpw2')}
                                    errorMessage="Invlid Password" 
                                    emptyMessage="Password is required"/>
                            </td>
                        </tr>   
                        
                    </tbody>
                </table>
                <input type="submit" value="Insert Staff" />
            </form>
        );
    }
});

var SelectList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (staffTypes){
            return (
                <option
                    key = {staffTypes.position_id}
                    value = {staffTypes.position_id}
                    >
                        {staffTypes.position_name}
                    </option>
            );
        });
        return (
            <select name = "stype" id = "stype">
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
    <StaffBox />,
    document.getElementById('content')
);
