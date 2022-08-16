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
            url: '/getad/',
            data: {
                'appointmentdetailid': appointmentdetailid.value,
                'appointmentid': appointmentid.value,
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

    updateSingleAppDetFromServer: function (appointment) {
        
        $.ajax({
            url: '/updatesingleappdet/',
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
        this.loadAppointmentDetailFromServer();
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
                <h1>Appointment Details</h1>
                <AppointmentDetailform2 onAppointmentDetailSubmit={this.loadAppointmentDetailFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment Detail Key</th>
                                <th>Appointment Detail ID</th>
                                <th>Appointment ID</th>
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
                    <div id="theright">
                        <AppointmentDetailUpdateform onUpdateSubmit={this.updateSingleAppDetFromServer} />
                    </div> 
                    </div>
            </div>
        );}
    }
});


var AppointmentDetailform2 = React.createClass({
    getInitialState: function () {
        return {

            appointmentdetailid:"",
            appointmentid:"",
            adbloodpressure:"",
            adweight:"",
            adpulse:"",
            advision:"",
            adheight:"",
            adnotes:"",
            
        };

    },

    handleSubmit: function (e) {

        e.preventDefault();

        var appointmentdetailid = this.state.appointmentdetailid.trim();
        var appointmentid = this.state.appointmentid.trim();
        var adbloodpressure = this.state.adbloodpressure.trim();
        var adweight = this.state.adweight.trim();
        var adpulse = this.state.adpulse.trim();
        var advision = this.state.advision.trim();
        var adheight = this.state.adheight.trim();
        var adnotes = this.state.adnotes.trim();

        this.props.onAppointmentDetailSubmit({

            appointmentdetailid: appointmentdetailid,
            appointmentid: appointmentid,
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
            <div>
            <form onSubmit={this.handleSubmit}>
                <h2>Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment Detail ID</th>
                            <td>
                                <input type="text" name="appointmentdetailid" id="appointmentdetailid" value={this.state.appointmentdetailid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <input type="text" name="appointmentid" id="appointmentid" value={this.state.appointmentid} onChange={this.handleChange} />
                            </td>
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
                <input type="submit" value="Search Appointment Details" />

            </form>
        
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

var AppointmentDetailUpdateform = React.createClass({
    getInitialState: function () {
        return {

            upappointmentdetailid:"",
            upappointmentid:"",
            upadbloodpressure:"",
            upadweight:"",
            upadpulse:"",
            upadvision:"",
            upadheight:"",
            upadnotes:"",
            
        };

    },

    handleSubmit: function (e) {

        e.preventDefault();

        var upappointmentdetailkey = upadkey.value;
        var upappointmentdetailid = upadid.value;
        var upappointmentid = upappid.value;
        var upadbloodpressure = upadblood.value;
        var upadweight = upadwght.value;
        var upadpulse = upadpls.value;
        var upadvision = upadvis.value ;
        var upadheight = upadhgt.value;
        var upadnotes = upadnts.value;

        this.props.onAppointmentDetailSubmit({

            upappointmentdetailkey: upappointmentdetailkey,
            upappointmentdetailid: upappointmentdetailid,
            upappointmentid: upappointmentid,
            upadbloodpressure: upadbloodpressure,
            upadweight: upadweight,
            upadpulse: upadpulse,
            upadvision: upadvision,
            upadheight: upadheight,
            upadnotes: upadnotes
            
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
            <form onSubmit={this.handleSubmit}>
                <h2>Appointment Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Appointment Detail ID</th>
                            <td>
                                <input type="text" name="upadid" id="upadid" value={this.state.upadid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Appointment ID</th>
                            <td>
                                <input type="text" name="appid" id="appid" value={this.state.appid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Blood Pressure</th>
                            <td>
                                <input type="text" name="upadblood" id="upadblood" value={this.state.upadblood} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Weight</th>
                            <td>
                                <input type="text" name="upadwght" id="upadwght" value={this.state.upadwght} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Pulse</th>
                            <td>
                                <input type="text" name="upadpls" id="upadpls" value={this.state.adpls} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Vision</th>
                            <td>
                                <input type="text" name="upadvis" id="upadvis" value={this.state.upadvis} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Height</th>
                            <td>
                                <input type="text" name="upadhgt" id="upadhgt" value={this.state.upadhgt} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Notes</th>
                            <td>
                                <input type="text" name="upadnts" id="upadnts" value={this.state.adnotes} onChange={this.handleChange} />
                            </td>
                        </tr>
                                
                    </tbody>
                </table>
                <br />
                        <input type="hidden" name="upadkey" id="upadkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Appointment Details" />
                    </form>
                </div>
            </div>
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
                    adid={ad.appointmentdetail_id}
                    appid={ad.appointment_id}
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
    getInitialState: function () {
        return {
            upadkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupadkey = this.props.adkey;
        
        this.loadSingleEmp(theupadkey);
    },
    loadSingleEmp: function (theupadkey) {
        $.ajax({
            url: '/getsingleappointmentdet',
            data: {
                'upadkey': theupadkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateApp = this.state.singledata.map(function (ad) {
                    upadkey.value = theupadkey;
                    upadid.value = ad.appointmentdetail_id;
                    upappid.value = ad.appointment_id;
                    upadblood.value = ad.appointmentdetail_bloodpressure;
                    upadwght.value = ad.appointmentdetail_weight;
                    upadpls.value = ad.appointmentdetail_pulse;
                    upadvis.value = ad.appointmentdetail_vision;
                    upadhgt.value = ad.appointmentdetail_height;
                    upadnts.value = ad.appointmentdetail_notes;
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
                                {this.props.adkey}
                            </td>
                             <td>
                                {this.props.adid} 
                            </td>
                            <td>
                                {this.props.appid}
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
    <AppointmentDetailBox />,
    document.getElementById('content')
);