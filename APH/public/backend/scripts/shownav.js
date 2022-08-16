var ShowNav = React.createClass({
    render: function() {
        return (
        <div> 
            <a id="home" href="b_index.html">Home</a>
            <a id="home" href="request.html">Appointment Request</a>
            <div id="selector1">
                <h3 id="navTab">Add New</h3>
                <img id="arrow1" src="images/arrow.png"></img>
            </div>
            <div id="insertsTabs">
                    <a href="insert_customer.html">Insert Patient</a> 
                    <a href="insert_staff.html">Insert Staff</a>            
                    <a href="insert_order.html">Insert Order</a> 
                    <a href="insert_appointment.html">Insert Appointment</a>            
                    <a href="insert_items.html">Insert Items</a>            
                    <a href="insert_appointment_details.html">Insert Appointment Details</a> 
                    <a href="insert_order_details.html">Insert Order Details</a>
            </div>
            <div id="selector2">
                <h3 id="navTab">Search</h3>
                <img id="arrow2" src="images/arrow.png"></img>
            </div>
            <div id="searchTabs">
                    <a href="search_customer.html">Search Patient</a> 
                    <a href="search_staff.html">Search Staff</a>             
                    <a href="search_order.html">Search Order</a> 
                    <a href="search_appointment.html">Search Appointment</a>
                    <a href="search_items.html">Search Items</a>             
                    <a href="search_appointment_details.html">Search Appointment Details</a> 
            </div>
            <div id="selector3">
                <h3 id="navTab">Update</h3>
                <img id="arrow3" src="images/arrow.png"></img>
            </div>
            <div id="updateTabs">
                    <a href="update_customer.html">Update Patient</a> 
                    <a href="update_staff.html">Update Staff</a> 
                    <a href="update_order.html">Update Order</a> 
                    <a href="update_appointment.html">Update Appointment</a> 
                    <a href="update_items.html">Update Items</a>
                    <a href="update_appointment_details.html">Update Appointment Details</a> 
                    <a href="update_order_details.html">Update Order Details</a> 
            </div>
            <a href="logout.html">Logout</a>
        </div>
        );
    }
});

ReactDOM.render (
    <ShowNav/>,
    document.getElementById('thenav')
);