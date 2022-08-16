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
    loadAppointmentFromServer: function () {

        $.ajax({
            url: '/searchapps/',
            data: {
                'appointmentid': appointmentid.value,
                'appointmentdate': appointmentdate.value,
                'appointmenttime': appointmenttime.value,
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

    updateSingleAppFromServer: function (appointment) {
        
        $.ajax({
            url: '/updatesingleappointment/',
            dataType: 'json',
            data: appointment,
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
        this.loadAppointmentFromServer();
       // setInterval(this.loadAppointmentFromServer, this.props.pollInterval);
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
                <h1>Appointment</h1>
                <Appointmentform2 onAppointmentSubmit={this.loadAppointmentFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Key</th>
                                <th>Appointment ID</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th>Customer ID</th>
                                <th>Staff ID</th>
                            </tr>
                         </thead>
                        <AppointmentList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <AppointmentUpdateform onUpdateSubmit={this.updateSingleAppFromServer} />
                    </div> 
                    </div>
            </div>
        );}
    }
});

var Appointmentform2 = React.createClass({
    getInitialState: function () {
        return {
            appointmentid:"",
            appointmentdate: "",
            appointmenttime:"",
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
            url: '/getdoctors/',
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

        var appointmentid = this.state.appointmentid.trim();
        var appointmentdate = this.state.appointmentdate.trim();
        var appointmenttime = this.state.appointmenttime.trim()
        var customerlastname = custname.value;
        var stafflastname = stfname.value;

        this.props.onAppointmentSubmit({
            appointmentid: appointmentid,
            appointmentdate: appointmentdate,
            appointmenttime: appointmenttime,
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
                <h2>Appointment</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <input type="text" name="appointmentid" id="appointmentid" value={this.state.appointmentid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                                <input type='date' name="appointmentdate" id="appointmentdate" value={this.state.appointmentdate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td>
                                <input name="appointmenttime" id="appointmenttime" value={this.state.appointmenttime} onChange={this.handleChange}  />
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
                <input type="submit" value="Search Appointment" />

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

var AppointmentUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upappointmentid:"",
            upappointmentdate: "",
            upappointmenttime:"",
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
            url: '/getdoctors/',
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

        var upappointmentkey = upappkey.value;
        var upappointmentid = upappid.value;
        var upappointmentdate = upappdate.value;
        var upappointmenttime = upapptime.value;
        var upcustomerlastname = upcustname.value;
        var upstafflastname = upstfname.value;

        this.props.onUpdateSubmit({
            upappointmentkey: upappointmentkey,
            upappointmentid: upappointmentid,
            upappointmentdate: upappointmentdate,
            upappointmenttime: upappointmenttime,
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
                            <th>Appointment ID</th>
                            <td>
                                <input type="text" name="upappid" id="upappid" value={this.state.upappid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Date</th>
                            <td>
                                <input type='date' name="upappdate" id="upappdate" value={this.state.upappdate} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment Time</th>
                            <td>
                                <input name="upapptime" id="upapptime" value={this.state.upapptime} onChange={this.handleUpChange}  />
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
                        <input type="hidden" name="upappkey" id="upappkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointments" />
                    </form>
                </div>
            </div>
        );
    }
});

var AppointmentList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (appointment) {
            return (
                <Appointment
                    key={appointment.appointment_key}
                    appkey={appointment.appointment_key}
                    appid={appointment.appointment_id}
                    appdate={appointment.appointment_date}
                    apptime={appointment.appointment_time}
                    custid = {appointment.customer_id}
                    stfid = {appointment.staff_id}
                >
                </Appointment>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {appointmentNodes}
            </tbody>
        );
    }
});

var Appointment = React.createClass({
    getInitialState: function () {
        return {
            upappkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupappkey = this.props.appkey;
        
        this.loadSingleEmp(theupappkey);
    },
    loadSingleEmp: function (theupappkey) {
        $.ajax({
            url: '/getsingleappointment',
            data: {
                'upappkey': theupappkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateApp = this.state.singledata.map(function (appointment) {
                    upappkey.value = theupappkey;
                    upappid.value = appointment.appointment_id;
                    upappdate.value = new Date(appointment.appointment_date).toISOString().slice(0,10);
                    upapptime.value = appointment.appointment_time;
                    upcustname.value = appointment.customer_id;
                    upstfname.value = appointment.staff_id;
                   

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
                                {this.props.appkey} 
                            </td>
                            <td>
                                {this.props.appid}
                            </td>
                            <td>
                                {this.props.appdate}
                            </td>
                            <td>
                                {this.props.apptime}
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
                key = {stfTypes.staff_id}
                value= {stfTypes.staff_id}
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
                        key = {stfTypes.staff_id}
                        value= {stfTypes.staff_id}
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
                    key = {cusTypes.customer_id}
                    value= {cusTypes.customer_id}
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
                        key = {cusTypes.customer_id}
                        value= {cusTypes.customer_id}
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
    <AppointmentBox />,
    document.getElementById('content')
);