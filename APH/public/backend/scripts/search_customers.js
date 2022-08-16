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
    
    componentDidMount: function () {
        this.loadCustomerFromServer();
       // setInterval(this.loadCustomerFromServer, this.props.pollInterval);
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
            <div>
                <h1>Search Patients</h1>
                <Customerform2 onCustomerSubmit={this.loadCustomerFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Key</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Zip</th>
                                <th>State</th>
                                <th>Email</th>
                                <th>Are they a customer?</th>
                                
                            </tr>
                         </thead>
                        <CustomerList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
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

    handleOptionChange: function (e){
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
            <form onSubmit={this.handleSubmit}>
                <h2>Patient</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Patient First Name</th>
                            <td>
                                <input name="customerfirstname" id="customerfirstname" value={this.state.customerfirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Last Name</th>
                            <td>
                                <input name="customerlastname" id="customerlastname" value={this.state.customerlastname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Address</th>
                            <td>
                                <input name="customeraddress" id="customeraddress" value={this.state.customeraddress} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Zip</th>
                            <td>
                                <input name="customerzip" id="customerzip" value={this.state.customerzip} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient State</th>
                            <td>
                                <input name="customerstate" id="customerstate" value={this.state.customerstate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Phone</th>
                            <td>
                                <input name="customerphone" id="customerphone" value={this.state.customerphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Email</th>
                            <td>
                                <input name="customeremail" id="customeremail" value={this.state.customeremail} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Is the patient a customer?</th>
                            <td>
                                <input 
                                    type = "radio" 
                                    name = "cuspatient" 
                                    id = "patientno" 
                                    value = "1" 
                                    checked = {this.state.selectedOption === "1"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> No
                                   <input 
                                    type = "radio" 
                                    name = "cuspatient" 
                                    id = "patientyes" 
                                    value = "0" 
                                    checked = {this.state.selectedOption === "0"}
                                    onChange = {this.handleOptionChange}
                                    className="form-check-input"
                                /> Yes
                            </td>
                        </tr> 
                           
                    </tbody>
                </table>
                <input type="submit" value="Search Patient" />

            </form>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var customerNodes = this.props.data.map(function (customer) {
            //map the data to individual donations
            return (
                <Customer
                    key={customer.customer_key}
                    cuskey={customer.customer_key}
                    cusid={customer.customer_key}
                    cusfirstname={customer.customer_firstname}
                    cuslastname={customer.customer_lastname}
                    cusaddress={customer.customer_address}
                    cusphone={customer.customer_phone}
                    cuszip={customer.customer_zip}
                    cusstate={customer.customer_state}
                    cusemail={customer.customer_email}
                    cuspatient={customer.customer_ispatient}
                    
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

    render: function () {

        if (this.props.cuspatient == 1) {
            var thepatient = "YES";
        } else{
            var thepatient = "NO";
        }

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
                                {this.props.cusaddress}
                            </td>
                            <td>
                                {this.props.cusphone}
                            </td>
                            <td>
                                {this.props.cuszip}
                            </td>
                            <td>
                                {this.props.cusstate}
                            </td>
                            <td>
                                {this.props.cusemail}
                            </td>
                            <td>
                                {thepatient}
                            </td>
                            
                </tr>
        );
    }
});

ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);