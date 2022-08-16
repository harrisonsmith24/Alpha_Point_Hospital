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
            url: '/searchstaff',
            data: {
                'stafffirstname': stafffirstname.value,
                'stafflastname': stafflastname.value,
                'staffaddress': staffaddress.value,
                'staffphone': staffphone.value,
                'staffzip': staffzip.value,
                'staffstate': staffstate.value,
                'staffemail': staffemail.value,
                'staffposition': staffpos.value,
                'staffsalary': staffsalary.value
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
        this.loadStaffFromServer();
       // setInterval(this.loadStaffFromServer, this.props.pollInterval);
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
                <h1>Staff</h1>
                <Staffform2 onStaffSubmit={this.loadStaffFromServer} />
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
                                <th>Position</th>
                                <th>Salary</th>
                            </tr>
                         </thead>
                        <StaffList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var Staffform2 = React.createClass({
    getInitialState: function () {
        return {
            stafffirstname: "",
            stafflastname: "",
            staffaddress:"",
            staffphone:"",
            staffzip:"",
            staffstate:"",
            staffemail: "",
            data: [],
            staffsalary: "",
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

    handleSubmit: function (e) {
        e.preventDefault();

        var stafffirstname= this.state.stafffirstname.trim();
        var stafflastname= this.state.stafflastname.trim();
        var staffaddress= this.state.staffaddress.trim();
        var staffphone= this.state.staffphone.trim();
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
                                <input name="staffaddress" id="staffaddress" value={this.state.staffaddress} onChange={this.handleChange} />
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
                                <input name="staffemail" id="staffemail" value={this.state.staffemail} onChange={this.handleChange}  />
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
        );
    }
});

var StaffList = React.createClass({
    render: function () {
        var staffNodes = this.props.data.map(function (staff) {
            //map the data to individual donations
            return (
                <Staff
                    key={staff.staff_key}
                    stfkey={staff.staff_key}
                    stfid={staff.staff_key}
                    stffirstname={staff.staff_firstname}
                    stflastname={staff.staff_lastname}
                    stfaddress={staff.staff_address}
                    stfphone={staff.dbstaffphone}
                    stfzip={staff.staff_zip}
                    stfstate={staff.staff_state}
                    stfemail={staff.staff_email}
                    stfposition={staff.position_name}
                    stfsalary={staff.staff_salary}
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
                                {this.props.stfaddress}
                            </td>
                            <td>
                                {this.props.stfphone}
                            </td>
                            <td>
                                {this.props.stfzip}
                            </td>
                            <td>
                                {this.props.stfstate}
                            </td>
                            <td>
                                {this.props.stfemail}
                            </td>
                            <td>
                                {this.props.stfposition}
                            </td>
                            <td>
                                {this.props.stfsalary}
                            </td>
                </tr>
        );
    }
});

var SelectList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (stfTypes){
            return (
                <option
                    key = {stfTypes.position_id}
                    value = {stfTypes.position_id}
                    >
                        {stfTypes.position_name}
                    </option>
            );
        });
        return (
            <select name = "staffpos" id = "staffpos">
                <option value = "0"></option>
                {optionNodes}
            </select>
        );
    }
});

ReactDOM.render(
    <StaffBox />,
    document.getElementById('content')
);