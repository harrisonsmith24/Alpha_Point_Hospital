var stfuser = 0;
var RequestBox = React.createClass({
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
    loadRequestFromServer: function () {

        $.ajax({
            url: '/searchrequest/',
            data: {
                'requestname': requestname.value,
                'requestemail': requestemail.value,
                'requestphone': requestphone.value,
                'requestdate': requestdate.value,
                'requesttime': reqTimes.value, 
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
        this.loadRequestFromServer();
       // setInterval(this.loadRequestFromServer, this.props.pollInterval);
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
                <h1>Request</h1>
                <Requestform2 onRequestSubmit={this.loadRequestFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Request Name</th>
                                <th>Request Email</th>
                                <th>Request Phone</th>
                                <th>Request Date</th>
                                <th>Request Time</th>
                            </tr>
                         </thead>
                        <RequestList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var Requestform2 = React.createClass({
    getInitialState: function () {
        return {
            requestname:"",
            requestemail: "",
            requestphone: "",
            requestdate: "",
            requesttime:"",
        };

    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var requestname = this.state.requestname.trim();
        var requestemail = this.state.requestemail.trim();
        var requestphone = this.state.requestphone.trim();
        var requestdate = this.state.requestdate.trim();
        var requesttime = reqTimes.value;

        this.props.onRequestSubmit({
            requestname: requestname,
            requestemail: requestemail,
            requestphone: requestphone,
            requestdate: requestdate,
            requesttime: requesttime,
            
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
                <h2>Request</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Request Name</th>
                            <td>
                                <input type="text" name="requestname" id="requestname" value={this.state.requestname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Request Email</th>
                            <td>
                                <input type="text" name="requestemail" id="requestemail" value={this.state.requestemail} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Request Name</th>
                            <td>
                                <input type="text" name="requestphone" id="requestphone" value={this.state.requestphone} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Request Date</th>
                            <td>
                                <input type='date' name="requestdate" id="requestdate" value={this.state.requestdate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Request Time</th>
                            <td><SelectTime data = {this.state.requesttime} /></td>    
                        </tr>  
                                
                    </tbody>
                </table>
                <input type="submit" value="Search Request" />

            </form>
        );
    }
});

var RequestList = React.createClass({
    render: function () {
        var requestNodes = this.props.data.map(function (request) {
            //map the data to individual donations
            return (
                <Request
                    key={request.request_key}
                    appkey={request.request_key}
                    rname={request.request_name}
                    remail={request.request_email}
                    rphone={request.request_phone}
                    rdate={request.request_date}
                    rtime={request.request_time} 
                >
                </Request>
            );             
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {requestNodes}
            </tbody>
        );
    }
});

var Request = React.createClass({

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.rname} 
                            </td>
                            <td>
                                {this.props.remail} 
                            </td>
                            <td>
                                {this.props.rphone} 
                            </td>
                            <td>
                            {new Intl.DateTimeFormat("en-US", {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit'
                                }).format(new Date(this.props.rdate))}
                            </td>
                            <td>
                                {this.props.rtime}
                            </td>
                            
                </tr>
        );
    }
});

var SelectTime = React.createClass ({
    render: function () {
        return (
            <select name = "reqTimes" id = "reqTimes">
                <option></option>
                <option value="8:00am-9:00am">8am-9am</option>,
                <option value="9:00am-10:00am">9am-10am</option>
                <option value="10:00am-9:00am">10am-11am</option>,
                <option value="11:00am-12:00pm">11am-12pm</option> 
                <option value="12:00pm-1:00pm">12pm-1pm</option>
                <option value="1:00pm-2:00pm">1pm-2pm</option>,
                <option value="2:00pm-3:00pm">2pm-3pm</option> 
                <option value="3:00pm-4:00pm">3pm-4pmm</option>,
                <option value="4:00pm-5:00pm">4pm-5pm</option>  
            </select>
        );
    }
});

ReactDOM.render(
    <RequestBox />,
    document.getElementById('content')
);