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
    loadOrderFromServer: function () {

        $.ajax({
            url: '/searchordertable/',
            data: {
                'orderdate': orderdate.value,
                'ordertime': ordertime.value,
                'customerlastname': custname.value,
                'stafflastname': stfname.value, 
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

    updateSingleAppFromServer: function (order) {
        
        $.ajax({
            url: '/updatesingleorder/',
            dataType: 'json',
            data: order,
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
        this.loadOrderFromServer();
       // setInterval(this.loadOrderFromServer, this.props.pollInterval);
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
                <h1>Order</h1>
                <Orderform2 onOrderSubmit={this.loadOrderFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Order Key</th>
                                <th>Order Date</th>
                                <th>Order Time</th>
                                <th>Customer Key</th>
                                <th>Staff Key</th>
                            </tr>
                         </thead>
                        <OrderList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <OrderUpdateform onUpdateSubmit={this.updateSingleAppFromServer} />
                    </div> 
                    </div>
            </div>
        );}
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdate: "",
            ordertime:"",
            customerdata:[],
            staffdata:[]
        };

    },

    loadCustomers: function(){
        $.ajax({
            url: '/getpatients/',
            dataType: 'json',
            cache: false,
            success: function (customerdata) {
                this.setState({ customerdata: customerdata});
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
            success: function (staffdata) {
                this.setState({ staffdata: staffdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    componentDidMount: function(){
        this.loadStaff();
        this.loadCustomers();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var orderdate = this.state.orderdate.trim();
        var ordertime = this.state.ordertime.trim()
        var customerlastname = custname.value;
        var stafflastname = stfname.value;

        this.props.onOrderSubmit({
            orderdate: orderdate,
            ordertime: ordertime,
            customerlastname: customerlastname,
            stafflastname: stafflastname
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
                <h2>Order</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Order Date</th>
                            <td>
                                <input type='date' name="orderdate" id="orderdate" value={this.state.orderdate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Time</th>
                            <td>
                                <input name="ordertime" id="ordertime" value={this.state.ordertime} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Select Patient</th>
                            <td><SelectCustomerList data = {this.state.customerdata} /></td>    
                        </tr> 
                        <tr>
                            <th>Select Doctor</th>
                            <td><SelectStaffList data = {this.state.staffdata} /></td>    
                        </tr> 
                                
                    </tbody>
                </table>
                <input type="submit" value="Search Order" />

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

var OrderUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uporderdate: "",
            upordertime:"",
            upcustomerdata:[],
            upstaffdata:[]
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadCustomers: function(){
        $.ajax({
            url: '/getpatients/',
            dataType: 'json',
            cache: false,
            success: function (customerdata) {
                this.setState({ upcustomerdata: customerdata });
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
            success: function (staffdata) {
                this.setState({ upstaffdata: staffdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadStaff();
        this.loadCustomers();
    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var uporderkey = upodrkey.value;
        var uporderdate = upodrdate.value;
        var upordertime = upodrtime.value;
        var upcustomerlastname = upcustname.value;
        var upstafflastname = upstfname.value;

        this.props.onUpdateSubmit({
            uporderkey: uporderkey,
            uporderdate: uporderdate,
            upordertime: upordertime,
            upcustomerlastname: upcustomerlastname,
            upstafflastname: upstafflastname
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
                            <th>Order Date</th>
                            <td>
                                <input type='date' name="upodrdate" id="upodrdate" value={this.state.upodrdate} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Time</th>
                            <td>
                                <input name="upodrtime" id="upodrtime" value={this.state.upodrtime} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Select Patient</th>
                            <td><SelectUpdateCustomerList data = {this.state.upcustomerdata} /></td>    
                        </tr> 
                        <tr>
                            <th>Select Doctor</th>
                            <td><SelectUpdateStaffList data = {this.state.upstaffdata} /></td>    
                        </tr> 
                                
                    </tbody>
                </table><br />
                        <input type="hidden" name="upodrkey" id="upodrkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Orders" />
                    </form>
                </div>
            </div>
        );
    }
});

var OrderList = React.createClass({
    render: function () {
        var orderNodes = this.props.data.map(function (order) {
            return (
                <Order
                    key={order.order_key}
                    odrkey={order.order_key}
                    odrid={order.order_key}
                    odrdate={order.order_date}
                    odrtime={order.order_time}
                    custid = {order.customer_key}
                    stfid = {order.staff_key}
                >
                </Order>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {orderNodes}
            </tbody>
        );
    }
});

var Order = React.createClass({
    getInitialState: function () {
        return {
            upodrkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupodrkey = this.props.odrkey;
        
        this.loadSingleEmp(theupodrkey);
    },
    loadSingleEmp: function (theupodrkey) {
        $.ajax({
            url: '/getsingleorder',
            data: {
                'upodrkey': theupodrkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateApp = this.state.singledata.map(function (order) {
                    upodrkey.value = theupodrkey;
                    upodrdate.value = order.order_date;
                    upodrtime.value = order.order_time;
                    upcustname.value = order.customer_key;
                    upstfname.value = order.staff_key;
                   

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
                                {this.props.odrkey} 
                            </td>
                            <td>
                                {this.props.odrdate}
                            </td>
                            <td>
                                {this.props.odrtime}
                            </td>
                            <td>
                                {this.props.custid}
                            </td>
                            <td>
                                {this.props.stfid}
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

var SelectStaffList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (stfTypes) {
            return (
                <option
                key = {stfTypes.staff_key}
                value= {stfTypes.staff_key}
            >
                {stfTypes.staff_firstname + " " + stfTypes.staff_lastname}           
                </option>
            );
        });
        return (
            <select name = "stfname" id = "stfname">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateStaffList = React.createClass({
    render: function () {
            var optionNodes = this.props.data.map(function (stfTypes) {
                return (
                    <option
                        key = {stfTypes.staff_key}
                        value= {stfTypes.staff_key}
                    >
                        {stfTypes.staff_firstname + " " + stfTypes.staff_lastname}        
                    </option>
                );
            });
            return (
                <select name = "upstfname" id = "upstfname">
                    <option value ="0"></option>
                    {optionNodes}
                </select>
            );
        }
});

var SelectCustomerList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (cusTypes) {
            return (
                <option
                    key = {cusTypes.customer_key}
                    value= {cusTypes.customer_key}
                >
                    {cusTypes.customer_firstname + ' ' + cusTypes.customer_lastname}        
                </option>
            );
        });
        return (
            <select name = "custname" id = "custname">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateCustomerList = React.createClass({
    render: function () {
            var optionNodes = this.props.data.map(function (cusTypes) {
                return (
                    <option
                        key = {cusTypes.customer_key}
                        value= {cusTypes.customer_key}
                    >
                        {cusTypes.customer_firstname + ' ' + cusTypes.customer_lastname}        
                    </option>
                );
            });
            return (
                <select name = "upcustname" id = "upcustname">
                    <option value ="0"></option>
                    {optionNodes}
                </select>
            );
        }
});

ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);