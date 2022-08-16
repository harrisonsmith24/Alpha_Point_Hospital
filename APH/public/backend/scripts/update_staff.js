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
    loadStaffFromServer: function () {

        $.ajax({
            url: '/searchstaff/',
            data: {
                'stafffirstname': stafffirstname.value,
                'stafflastname': stafflastname.value,
                'staffaddress': staffaddress.value,
                'staffphone': staffphone.value,
                'staffzip':staffzip.value,
                'staffstate':staffstate.value,
                'staffemail': staffemail.value,
                'staffposition': staffpos.value,
                'staffsalary': staffsalary.value,
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
    updateSingleStaffFromServer: function (staff) {
        
        $.ajax({
            url: '/updatesinglestaff/',
            dataType: 'json',
            data: staff,
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
        this.loadStaffFromServer();
       // setInterval(this.loadStaffsFromServer, this.props.pollInterval);
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
                <h1>Update Staff</h1>
                <Staffform2 onStaffSubmit={this.loadStaffFromServer} />
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
                        <StaffList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <StaffUpdateform onUpdateSubmit={this.updateSingleStaffFromServer} />
                    </div>                
                </div>
            </div>
        );}
    }
});

var Staffform2 = React.createClass({
    getInitialState: function () {
        return {
            staffkey: "",
            stafffirstname: "",
            stafflastname: "",
            staffaddress: "",
            staffphone: "",
            staffzip:"",
            staffstate:"",
            staffemail: "",
            data: [],
            staffsalary: "",
            
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loadStaffPositions: function () {
        $.ajax({
            url: '/getstaffpositions',
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
        this.loadStaffPositions();
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var stafffirstname = this.state.stafffirstname.trim();
        var stafflastname = this.state.stafflastname.trim();
        var staffaddress = this.state.staffaddress.trim();
        var staffphone = this.state.staffphone.trim();
        var staffzip = this.state.staffzip.trim();
        var staffstate = this.state.staffstate.trim();
        var staffemail = this.state.staffemail.trim();
        var staffposition = staffpos.value;
        var staffsalary = this.state.staffsalary;

        this.props.onStaffSubmit({ 
            stafffirstname: stafffirstname,
            stafflastname: stafflastname,
            staffaddress: staffaddress,
            staffphone: staffphone,
            staffzip: staffzip,
            staffstate: staffstate,
            staffemail: staffemail,
            staffposition: staffposition,
            staffsalary: staffsalary,
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
                <h2>Staff</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Staff First Name</th>
                            <td>
                                <input name="stafffirstname" id="stafffirstname" value={this.state.stafffirstname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Last Name</th>
                            <td>
                                <input name="stafflastname" id="stafflastname" value={this.state.stafflastname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Address</th>
                            <td>
                                <input name="staffaddress" id="staffaddress" value={this.state.staffaddress} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Phone</th>
                            <td>
                                <input name="staffphone" id="staffphone" value={this.state.staffphone} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Zip</th>
                            <td>
                                <input name="staffzip" id="staffzip" value={this.state.staffzip} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff State</th>
                            <td>
                                <input name="staffstate" id="staffstate" value={this.state.staffstate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Email</th>
                            <td>
                                <input name="staffemail" id="staffemail" value={this.state.staffemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Position</th>
                            <td><SelectList data = {this.state.data} /></td>
                        </tr>
                        <tr>
                            <th>Staff Salary</th>
                            <td>
                                <input name="staffsalary" id="staffsalary" value={this.state.staffsalary} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Staff" />

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

var StaffUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upstaffkey: "",
            upstafffirstname: "",
            upstafflastname: "",
            upstaffaddress: "",
            upstaffphone: "",
            upstaffzip:"",
            upstaffstate:"",
            upstaffemail: "",
            updata: [],
            upstaffsalary: "",
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadStaffPositions: function () {
        $.ajax({
            url: '/getstaffpositions',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ updata: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loadStaffPositions();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upstaffkey = upstfkey.value;
        var upstafffirstname = upstffirst.value;
        var upstafflastname = upstflast.value;
        var upstaffaddress = upstfaddress.value;
        var upstaffphone = upstfphone.value;
        var upstaffzip = upstfzip.value;
        var upstaffstate = upstfstate.value;
        var upstaffemail = upstfemail.value;
        var upstaffposition = upstaffpos.value;
        var upstaffsalary = upstfsalary.value;

        this.props.onUpdateSubmit({
            upstaffkey: upstaffkey,
            upstafffirstname: upstafffirstname,
            upstafflastname: upstafflastname,
            upstaffaddress: upstaffaddress,
            upstaffphone: upstaffphone,
            upstaffzip: upstaffzip,
            upstaffstate: upstaffstate,
            upstaffemail: upstaffemail,
            upstaffposition: upstaffposition,
            upstaffsalary: upstaffsalary,
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
                            <th>Staff First Name</th>
                            <td>
                                <input name="upstffirst" id="upstffirst" value={this.state.upstffirst} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Last Name</th>
                            <td>
                                <input name="upstflast" id="upstflast" value={this.state.upstflast} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Address</th>
                            <td>
                                <input name="upstfaddress" id="upstfaddress" value={this.state.upstfaddress} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Phone</th>
                            <td>
                                <input name="upstfphone" id="upstfphone" value={this.state.upstfphone} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Zip</th>
                            <td>
                                <input name="upstfzip" id="upstfzip" value={this.state.upstfzip} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff State</th>
                            <td>
                                <input name="upstfstate" id="upstfstate" value={this.state.upstfstate} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Email</th>
                            <td>
                                <input name="upstfemail" id="upstfemail" value={this.state.upstfemail} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Staff Position</th>
                            <td><SelectUpdateList data = {this.state.updata} /></td>
                        </tr>
                        <tr>
                            <th>Staff Salary</th>
                            <td>
                                <input name="upstfsalary" id="upstfsalary" value={this.state.upstfsalary} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                    </tbody>
                </table><br />
                        <input type="hidden" name="upstfkey" id="upstfkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Staff" />
                    </form>
                </div>
            </div>
        );
    }
});

var StaffList = React.createClass({
    render: function () {
        var staffNodes = this.props.data.map(function (staff) {
            return (
                <Staff
                    key={staff.staff_key}
                    stfkey={staff.staff_key}
                    stffirstname={staff.staff_firstname}
                    stflastname={staff.staff_lastname}
                    stfemail={staff.staff_email}
                >
                </Staff>
            );
                       
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {staffNodes}
            </tbody>
        );
    }
});

var Staff = React.createClass({
    getInitialState: function () {
        return {
            upstfkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupstfkey = this.props.stfkey;
        
        this.loadSingleEmp(theupstfkey);
    },
    loadSingleEmp: function (theupstfkey) {
        $.ajax({
            url: '/getsinglestaff',
            data: {
                'upstfkey': theupstfkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateStf = this.state.singledata.map(function (staff) {
                    upstfkey.value = theupstfkey;
                    upstffirst.value = staff.staff_firstname;
                    upstflast.value = staff.staff_lastname;
                    upstfaddress.value = staff.staff_address;
                    upstfphone.value = staff.staff_phone;
                    upstfzip.value = staff.staff_zip;
                    upstfstate.value = staff.staff_state;
                    upstfemail.value = staff.staff_email;
                    upstaffpos.value = staff.staff_position;
                    upstfsalary.value = staff.staff_salary;

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
                                {this.props.stfkey} 
                            </td>
                            <td>
                                {this.props.stffirstname}
                            </td>
                            <td>
                                {this.props.stflastname}
                            </td>
                            <td>
                                {this.props.stfemail}
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

var SelectList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (stfTypes) {
            return (
                <option
                    key = {stfTypes.position_id}
                    value= {stfTypes.position_id}
                >
                    {stfTypes.position_name}        
                </option>
            );
        });
        return (
            <select name = "staffpos" id = "staffpos">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectUpdateList = React.createClass({
    render: function () {
            var optionNodes = this.props.data.map(function (stfTypes) {
                return (
                    <option
                        key = {stfTypes.position_id}
                        value= {stfTypes.position_id}
                    >
                        {stfTypes.position_name}        
                    </option>
                );
            });
            return (
                <select name = "upstaffpos" id = "upstaffpos">
                    <option value ="0"></option>
                    {optionNodes}
                </select>
            );
        }
});

ReactDOM.render(
    <StaffBox />,
    document.getElementById('content')
);