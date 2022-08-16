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
    loadCustomerFromServer: function () {

        var patientvalue = 2;
        if (patientyes.checked){
            patientvalue = 1;
        }
        if (patientno.checked){
            patientvalue = 0;
        }
        console.log(patientvalue);

        $.ajax({
            url: '/searchcustomers/',
            data: {
                'customerfirstname': customerfirstname.value,
                'customerlastname': customerlastname.value,
                'customeraddress': customeraddress.value,
                'customerphone': customerphone.value,
                'customerzip': customerzip.value,
                'customerstate': customerstate.value,
                'customeremail': customeremail.value,
                'customerispatient': patientvalue,
            },
            
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
    updateSingleCustomerFromServer: function (customer) {
        
        $.ajax({
            url: '/updatesinglecustomer/',
            dataType: 'json',
            data: customer,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadCustomerFromServer();
       // setInterval(this.loadCustomersFromServer, this.props.pollInterval);
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
        }else{        return (
            <div>
                <h1>Update Customer</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomerFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th></th>
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <CustomerUpdateform onUpdateSubmit={this.updateSingleCustomerFromServer} />
                    </div>                
                </div>
            </div>
        );}
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            customerkey: "",
            customerfirstname: "",
            customerlastname: "",
            customeraddress:"",
            customerphone:"",
            customerzip:"",
            customerstate:"",
            customeremail: "",
            customerispatient: "",
            
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var customerfirstname= this.state.customerfirstname.trim();
        var customerlastname= this.state.customerlastname.trim();
        var customeraddress= this.state.customeraddress.trim();
        var customerphone= this.state.customerphone.trim();
        var customerzip = this.state.customerzip.trim();
        var customerstate = this.state.customerstate.trim();
        var customeremail = this.state.customeremail.trim();
        var customerispatient = this.state.selectedOption;
        

        this.props.onCustomerSubmit({ 
            customerfirstname: customerfirstname, 
            customerlastname: customerlastname, 
            customeraddress: customeraddress,
            customerphone: customerphone,
            customerzip: customerzip,
            customerstate: customerstate,
            customeremail: customeremail, 
            customerispatient: customerispatient,
        });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
        <div>
            <div id = "theform">
            <form onSubmit={this.handleSubmit}>
                <h2>Customer</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Customer ID</th>
                            <td>
                                <input type="text" name="customerid" id="customerid" value={this.state.customerid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer First Name</th>
                            <td>
                                <input name="customerfirstname" id="customerfirstname" value={this.state.customerfirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Last Name</th>
                            <td>
                                <input name="customerlastname" id="customerlastname" value={this.state.customerlastname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Phone</th>
                            <td>
                                <input name="customerphone" id="customerphone" value={this.state.customerphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer State</th>
                            <td>
                                <input name="customerstate" id="customerstate" value={this.state.customerstate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient?</th>
                            <td>
                                <input 
                                    type = "radio" 
                                    name = "cuspatient" 
                                    id = "patientyes" 
                                    value = "1" 
                                    checked = {this.state.selectedOption === "1"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> Yes
                                   <input 
                                    type = "radio" 
                                    name = "cuspatient" 
                                    id = "patientno" 
                                    value = "0" 
                                    checked = {this.state.selectedOption === "0"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> No
                            </td>
                        </tr> 
                           
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />

            </form>
            </div>
            <div>
                    <br />
                    <form onSubmit={this.getInitialState}>
                        <input type="submit" value="Clear Form" />
                    </form>
            </div>
        </div>
        );
    }
});

var CustomerUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upcustomerkey: "",
            upcustomerfirstname: "",
            upcustomerlastname: "",
            upcustomeraddress: "",
            upcustomerphone: "",
            upcustomerzip:"",
            upcustomerstate:"",
            upcustomeremail: "",
            upcustomerispatient: ","
            
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var upcustomerkey = upcuskey.value;
        var upcustomerfirstname = upcusfirst.value;
        var upcustomerlastname = upcuslast.value;
        var upcustomeraddress = upcusaddress.value;
        var upcustomerphone = upcusphone.value;
        var upcustomerzip = upcuszip.value;
        var upcustomerstate = upcusstate.value;
        var upcustomeremail = upcusemail.value;
        var upcustomerispatient = this.state.upselectedOption;

        this.props.onUpdateSubmit({
            upcustomerkey: upcustomerkey,
            upcustomerfirstname: upcustomerfirstname,
            upcustomerlastname: upcustomerlastname,
            upcustomeraddress: upcustomeraddress,
            upcustomerphone: upcustomerphone,
            upcustomerzip: upcustomerzip,
            upcustomerstate: upcustomerstate,
            upcustomeremail: upcustomeremail,
            upcustomerispatient: upcustomerispatient
        });
    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>

                    <table>
                    <tbody>
                        <tr>
                            <th>Customer First Name</th>
                            <td>
                                <input name="upcusfirst" id="upcusfirst" value={this.state.upcusfirst} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Last Name</th>
                            <td>
                                <input name="upcuslast" id="upcuslast" value={this.state.upcuslast} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Address</th>
                            <td>
                                <input name="upcusaddress" id="upcusaddress" value={this.state.upcusaddress} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Phone</th>
                            <td>
                                <input name="upcusphone" id="upcusphone" value={this.state.upcusphone} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Zip</th>
                            <td>
                                <input name="upcuszip" id="upcuszip" value={this.state.upcuszip} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer State</th>
                            <td>
                                <input name="upcusstate" id="upcusstate" value={this.state.upcusstate} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Email</th>
                            <td>
                                <input name="upcusemail" id="upcusemail" value={this.state.upcusemail} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient?</th>
                            <td>
                                <input 
                                    type = "radio" 
                                    name = "upcuspatient" 
                                    id = "uppatientyes" 
                                    value = "1" 
                                    checked = {this.state.upselectedOption === "1"}
                                    onChange = {this.handleUpOptionChange}
                                    className="form-check-input"
                                /> Yes
                                   <input 
                                    type = "radio" 
                                    name = "upcuspatient" 
                                    id = "uppatientno" 
                                    value = "0" 
                                    checked = {this.state.upselectedOption === "0"}
                                    onChange = {this.handleUpOptionChange}
                                    className="form-check-input"
                                /> No
                            </td>
                        </tr>
                        
                    </tbody>
                </table><br />
                        <input type="hidden" name="upcuskey" id="upcuskey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Customer" />
                    </form>
                </div>
            </div>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            return (
                <Customer
                    key={customer.customer_key}
                    cuskey={customer.customer_key}
                    cusfirstname={customer.customer_firstname}
                    cuslastname={customer.customer_lastname}
                    cusemail={customer.customer_email}
                >
                </Customer>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {customerNodes}
            </tbody>
        );
    }
});

var Customer = React.createClass({
    getInitialState: function () {
        return {
            upcuskey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupcuskey = this.props.cuskey;
        
        this.loadSingleEmp(theupcuskey);
    },
    loadSingleEmp: function (theupcuskey) {
        $.ajax({
            url: '/getsinglecustomer',
            data: {
                'upcuskey': theupcuskey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateStf = this.state.singledata.map(function (customer) {
                    upcuskey.value = theupcuskey;
                    upcusfirst.value = customer.customer_firstname;
                    upcuslast.value = customer.customer_lastname;
                    upcusaddress.value = customer.customer_address;
                    upcusphone.value = customer.customer_phone;
                    upcuszip.value = customer.customer_zip;
                    upcusstate.value = customer.customer_state;
                    upcusemail.value = customer.customer_email;
                    if (customer.customer_ispatient == 1){
                        uppatientyes.checked = true;
                    } else{
                        uppatientno.checked = true;
                    }

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        
    },

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.cuskey} 
                            </td>
                            <td>
                                {this.props.cusfirstname}
                            </td>
                            <td>
                                {this.props.cuslastname}
                            </td>
                            <td>
                                {this.props.cusemail}
                            </td>
                            <td>
                                <form onSubmit={this.updateRecord}>
                                    <input type="submit" value="Update Record" />
                                </form>
                            </td>
                </tr>
        );
    }
});


ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);