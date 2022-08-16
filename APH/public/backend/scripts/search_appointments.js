var stfuser = 0;
var AppointmentBox = React.createClass({
    getInitialState: function () {
        return { data: [] ,
                viewthepage: 0};
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
            url: '/searchappointments/',
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
        }else{
        return (
            <div>
                <h1>Appointment</h1>
                <Appointmentform2 onAppointmentSubmit={this.loadAppointmentFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Appointment Date</th>
                                <th>Appointment Time</th>
                                <th>Customer Name</th>
                                <th>Staff Name</th>
                            </tr>
                         </thead>
                        <AppointmentList data={this.state.data} />
                    </table>
                
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
                this.setState({ customerdata: customerdata });
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
        );
    }
});

var AppointmentList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (appointment) {
            //map the data to individual donations
            return (
                <Appointment
                    key={appointment.appointment_key}
                    appkey={appointment.appointment_key}
                    appid={appointment.appointment_id}
                    appdate={appointment.appointment_date}
                    apptime={appointment.appointment_time}
                    cusname={appointment.customer_lastname}
                    stfname={appointment.staff_lastname}  
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

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.appid} 
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.appdate))}
                            </td>
                            <td>
                                {this.props.apptime}
                            </td>
                            <td>
                                {this.props.cusname}
                            </td>
                            <td>
                                {this.props.stfname}
                            </td>
                </tr>
        );
    }
});

var SelectCustomerList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (customerList){
            return (
                <option
                    key = {customerList.customer_id}
                    value = {customerList.customer_lastname}
                    >
                        {customerList.customer_lastname}
                    </option>
            );
        });
        return (
            <select name = "custname" id = "custname">
                <option></option>
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
                    value = {staffList.staff_lastname}
                    >
                        {staffList.staff_lastname}
                    </option>
            );
        });
        return (
            <select name = "stfname" id = "stfname">
                 <option></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <AppointmentBox />,
    document.getElementById('content')
);