var stfuser = 0;
var AppointmentDetailBox = React.createClass({
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
    loadAppointmentDetailFromServer: function () {

        $.ajax({
            url: '/searchad/',
            data: {
                'appointmentid': appointmentid.value,
                'appointmentdate': appointmentdate.value,
                'patientlastname': custname.value,
                'adbloodpressure': adbloodpressure.value,
                'adweight': adweight.value,
                'adpulse': adpulse.value,
                'advision': advision.value, 
                'adheight': adheight.value,
                'adnotes':adnotes.value
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
        this.loadAppointmentDetailFromServer();
       // setInterval(this.loadAppointmentDetailFromServer, this.props.pollInterval);
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
                <h1>Appointment Details</h1>
                <AppointmentDetailform2 onAppointmentDetailSubmit={this.loadAppointmentDetailFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>App Detail Key</th>
                                <th>Appointment Key</th>
                                <th>Appointment Date</th>
                                <th>Patient Name</th>
                                <th>Blood Pressure</th>
                                <th>Weight</th>
                                <th>Pulse</th>
                                <th>Vision</th>
                                <th>Height</th>
                                <th>Notes</th>
                            </tr>
                         </thead>
                        <AppointmentDetailList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var AppointmentDetailform2 = React.createClass({
    getInitialState: function () {
        return {

            appointmentid:"",
            appointmentdate: "",
            data:[],
            adbloodpressure:"",
            adweight:"",
            adpulse:"",
            advision:"",
            adheight:"",
            adnotes:"",
            
        };

    },

    loadCustomers: function(){
        $.ajax({
            url: '/getpatients/',
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

    componentDidMount: function() {
        this.loadCustomers();
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var appointmentid = this.state.appointmentid.trim();
        var appointmentdate = this.state.appointmentdate.trim();
        var patientlastname = custname.value
        var adbloodpressure = this.state.adbloodpressure.trim();
        var adweight = this.state.adweight.trim();
        var adpulse = this.state.adpulse.trim();
        var advision = this.state.advision.trim();
        var adheight = this.state.adheight.trim();
        var adnotes = this.state.adnotes.trim();

        this.props.onAppointmentDetailSubmit({

            appointmentid: appointmentid,
            appointmentdate: appointmentdate,
            patientlastname: patientlastname,
            adbloodpressure: adbloodpressure,
            adweight: adweight,
            adpulse: adpulse,
            advision: advision,
            adheight: adheight,
            adnotes: adnotes
            
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
                                <input name="appointmentdate" id="appointmentdate" value={this.state.appointmentdate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Patient Name</th>
                            <td><SelectCustomerList data = {this.state.data} /></td>    
                        </tr> 
                        <tr>
                            <th>Blood Pressure</th>
                            <td>
                                <input type="text" name="adbloodpressure" id="adbloodpressure" value={this.state.adbloodpressure} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Weight</th>
                            <td>
                                <input type="text" name="adweight" id="adweight" value={this.state.adweight} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Pulse</th>
                            <td>
                                <input type="text" name="adpulse" id="adpulse" value={this.state.adpulse} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Vision</th>
                            <td>
                                <input type="text" name="advision" id="advision" value={this.state.advision} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Height</th>
                            <td>
                                <input type="text" name="adheight" id="adheight" value={this.state.adheight} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Notes</th>
                            <td>
                                <input type="text" name="adnotes" id="adnotes" value={this.state.adnotes} onChange={this.handleChange} />
                            </td>
                        </tr>
                                
                    </tbody>
                </table>
                <input type="submit" value="Search AppointmentDetail" />

            </form>
        );
    }
});

var AppointmentDetailList = React.createClass({
    render: function () {
        var appointmentNodes = this.props.data.map(function (ad) {
            //map the data to individual donations
            return (
                <AppointmentDetail
                    key={ad.appointmentdetail_key}
                    adkey={ad.appointmentdetail_key}
                    appid={ad.appointment_key}
                    appdate={ad.appointment_date}
                    patname={ad.customer_lastname}
                    adbp={ad.appointmentdetail_bloodpressure}
                    adw={ad.appointmentdetail_weight}
                    adp={ad.appointmentdetail_pulse}
                    adv={ad.appointmentdetail_vision}
                    adh={ad.appointmentdetail_height}
                    adn={ad.appointmentdetail_notes} 
                >
                </AppointmentDetail>
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

var AppointmentDetail = React.createClass({

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.adkey} 
                            </td>
                            <td>
                                {this.props.appid}
                            </td>
                            <td>
                                {this.props.appdate}
                            </td>
                            <td>
                                {this.props.patname}
                            </td>
                            <td>
                                {this.props.adbp}
                            </td>
                            <td>
                                {this.props.adw}
                            </td>
                            <td>
                                {this.props.adp}
                            </td>
                            <td>
                                {this.props.adv}
                            </td>
                            <td>
                                {this.props.adh}
                            </td>
                            <td>
                                {this.props.adn}
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
            <select name ="custname" id ="custname">
                <option></option>
                {optionNodes}
            </select>
        );
    }
});


ReactDOM.render(
    <AppointmentDetailBox />,
    document.getElementById('content')
);