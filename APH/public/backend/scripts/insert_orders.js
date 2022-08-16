
var stfuser = 0;
var OrderBox = React.createClass({
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
    handleOrderSubmit: function (order) {
    
        $.ajax({
            url: '/order/',
            dataType: 'json',
            type: 'POST',
            data: order,
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
            <div className="OrderBox">
                <h1>Orders</h1>
                <Orderform2 onOrderSubmit = {this.handleOrderSubmit} />
            </div>
        );}
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdate: "",
            ordertime: "",
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
            url: '/getcustomers/',
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
            url: '/getcashier/',
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

        var orderdate = this.state.orderdate;
        var ordertime = this.state.ordertime;
        var customer_id = customerid.value;
        var staff_id = staffid.value;

        this.props.onOrderSubmit({
            orderdate: orderdate,
            ordertime: ordertime,
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
                <h2>Orders</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Order Date</th>
                            <td>
                                <TextInput
                                    inputType='date'
                                    value={this.state.orderdate}
                                    placeHolder= "mm-dd-yyyy"
                                    uniqueName="orderdate"
                                    minCharacters = "10"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'orderdate')}
                                    errorMessage="Order Date is invalid"
                                    emptyMessage="Order Date is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Time</th>
                            <td>
                                <TextInput
                                    value={this.state.ordertime}
                                    uniqueName="ordertime"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'ordertime')}
                                    errorMessage="Order Time is invalid"
                                    emptyMessage="Order Time is required" />
                            </td>
                        </tr>
                        
                        <tr>
                            <th>Select Customer</th>
                            <td><SelectCustomerList data = {this.state.customer_id} /></td>    
                        </tr> 
                        <tr>
                            <th>Select Staff Member
                            </th>
                            <td><SelectStaffList data = {this.state.staff_id} /></td>    
                        </tr> 
                       
                    </tbody>
                </table>
                <input type="submit" value="Insert Order" />
               
            </form>
        );
    }
});

var SelectCustomerList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (customerList){
            return (
                <option
                    key = {customerList.customer_key}
                    value = {customerList.customer_key}
                    >
                        {customerList.customer_firstname + " " + customerList.customer_lastname + " " + customerList.customer_key}
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
                    key = {staffList.staff_key}
                    value = {staffList.staff_key}
                    >
                        {staffList.staff_firstname + " " + staffList.staff_lastname + " " + staffList.staff_key}
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
    <OrderBox />,
    document.getElementById('content')
);