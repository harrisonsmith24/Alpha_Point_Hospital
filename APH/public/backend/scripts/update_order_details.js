var stfuser = 0;
var OrderDetailBox = React.createClass({
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
    loadOrderDetailFromServer: function () {

        $.ajax({
            url: '/getod/',
            data: {
                'orderdetailid': orderdetailid.value,
                'orderid': ordid.value,
                'odprice': odprice.value,
                'odquantity': odquantity.value,
                'productid': proid.value,
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

    updateSingleAppDetFromServer: function (order) {
        
        $.ajax({
            url: '/updatesingleorderdetail/',
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
        this.loadOrderDetailFromServer();
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
                <h1>Order Details</h1>
                <OrderDetailform2 onOrderDetailSubmit={this.loadOrderDetailFromServer} />
                <br />
                <div id = "theresults">
                    <div id = "theleft">
                    <table>
                        <thead>
                            <tr>
                                <th>Order Detail Key</th>
                                <th>Order Detail ID</th>
                                <th>Order ID</th>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                         </thead>
                        <OrderDetailList data={this.state.data} />
                    </table>
                    </div>
                    <div id="theright">
                        <OrderDetailUpdateform onUpdateSubmit={this.updateSingleAppDetFromServer} />
                    </div> 
                    </div>
            </div>
        );}
    }
});


var OrderDetailform2 = React.createClass({
    getInitialState: function () {
        return {

            orderdetailid:"",
            orderid:[],
            odquantity:"",
            productid:[],
            odprice:"",
            
        };

    },

    loadProducts: function(){
        $.ajax({
            url: '/getproduct/',
            dataType: 'json',
            cache: false,
            success: function (productid) {
                this.setState({ productid: productid });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    loadOrders: function(){
        $.ajax({
            url: '/getorder/',
            dataType: 'json',
            cache: false,
            success: function (orderid) {
                this.setState({ orderid: orderid });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadProducts();
        this.loadOrders();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var orderdetailid = this.state.orderdetailid.trim();
        var orderid = ordid.value
        var odquantity = this.state.odquantity.trim();
        var productid =  proid.value
        var odprice = this.state.odprice.trim();

        this.props.onOrderDetailSubmit({

            orderdetailid: orderdetailid,
            orderid: orderid,
            odquantity: odquantity,
            odprice: odprice,
            productid: productid
            
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
                <h2>Order Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Order Detail ID</th>
                            <td>
                                <input type="text" name="orderdetailid" id="orderdetailid" value={this.state.orderdetailid} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order ID</th>
                            <td><SelectOrderList data = {this.state.orderid} /></td>    
                        </tr> 
                        <tr>
                            <th>Product ID</th>
                            <td><SelectProductList data = {this.state.productid} /></td>    
                        </tr>  
                        <tr>
                            <th>Quantity</th>
                            <td>
                                <input type="text" name="odquantity" id="odquantity" value={this.state.odquantity} onChange={this.handleChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Price</th>
                            <td>
                                <input type="text" name="odprice" id="odprice" value={this.state.odprice} onChange={this.handleChange} />
                            </td>
                        </tr> 
                                
                    </tbody>
                </table>
                <input type="submit" value="Search OrderDetail" />

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

var OrderDetailUpdateform = React.createClass({
    getInitialState: function () {
        return {

            uporderdetailid:"",
            uporderid:[],
            upodquantity:"",
            upproductid:[],
            upodprice:"",
        };

    },

    loadProducts: function(){
        $.ajax({
            url: '/getproduct/',
            dataType: 'json',
            cache: false,
            success: function (productid) {
                this.setState({ upproductid: productid });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    loadOrders: function(){
        $.ajax({
            url: '/getorder/',
            dataType: 'json',
            cache: false,
            success: function (orderid) {
                this.setState({ uporderid: orderid });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadProducts();
        this.loadOrders();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var uporderdetailkey = upodkey.value;
        var uporderdetailid = upodid.value;
        var uporderid = upordid.value;
        var upproductid = upproid.value;
        var upodquantity = upodqnty.value;
        var upodprice = upodprc.value;
        

        this.props.onUpdateSubmit({

            uporderdetailkey: uporderdetailkey,
            uporderdetailid: uporderdetailid,
            uporderid: uporderid,
            upproductid: upproductid,
            upodquantity: upodquantity,
            upodprice: upodprice
            
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
                <h2>Order Details</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Order Detail ID</th>
                            <td>
                                <input type="text" name="upodid" id="upodid" value={this.state.upodid} onChange={this.handleUpChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Order ID</th>
                            <td><UpSelectOrderList data = {this.state.uporderid} /></td>    
                        </tr> 
                        <tr>
                            <th>Product ID</th>
                            <td><UpSelectProductList data = {this.state.upproductid} /></td>    
                        </tr>   
                        <tr>
                            <th>Quantity</th>
                            <td>
                                <input type="text" name="upodqnty" id="upodqnty" value={this.state.upodqnty} onChange={this.handleUpChange} />
                            </td>
                        </tr> 
                        <tr>
                            <th>Price</th>
                            <td>
                                <input type="text" name="upodprc" id="upodprc" value={this.state.upodprc} onChange={this.handleUpChange} />
                            </td>
                        </tr>   
                    </tbody>
                </table>
                <br />
                        <input type="hidden" name="upodkey" id="upodkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Order Details" />
                    </form>
                </div>
            </div>
        );
    }
});

var SelectProductList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (productList){
            return (
                <option
                    key = {productList.product_id}
                    value = {productList.product_id}
                    >
                        {productList.product_name + " " + productList.product_price + " " + productList.product_id}
                    </option>
            );
        });
        return (
            <select name = "proid" id = "proid">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var UpSelectOrderList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (orderList){
            return (
                <option
                    key = {orderList.order_id}
                    value = {orderList.order_id}
                    >
                        {orderList.order_id}
                    </option>
            );
        });
        return (
            <select name = "upordid" id = "upordid">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var UpSelectProductList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (productList){
            return (
                <option
                    key = {productList.product_id}
                    value = {productList.product_id}
                    >
                        {productList.product_name + " " + productList.product_price + " " + productList.product_id}
                    </option>
            );
        });
        return (
            <select name = "upproid" id = "upproid">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var SelectOrderList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (orderList){
            return (
                <option
                    key = {orderList.order_id}
                    value = {orderList.order_id}
                    >
                        {orderList.order_id}
                    </option>
            );
        });
        return (
            <select name = "ordid" id = "ordid">
                <option value ="0"></option>
                {optionNodes}
            </select>
        );
    }
});

var OrderDetailList = React.createClass({
    render: function () {
        var orderNodes = this.props.data.map(function (od) {
            //map the data to individual donations
            return (
                <OrderDetail
                    key={od.orderdetail_key}
                    odkey={od.orderdetail_key}
                    odid={od.orderdetail_id}
                    ordid={od.order_id}
                    proid={od.product_id}
                    odq={od.orderdetail_quantity}
                    odp={od.orderdetail_totalprice} 
                >
                </OrderDetail>
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

var OrderDetail = React.createClass({
    getInitialState: function () {
        return {
            upodkey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupodkey = this.props.odkey;
        
        this.loadSingleEmp(theupodkey);
    },
    loadSingleEmp: function (theupodkey) {
        $.ajax({
            url: '/getsingleorderdet',
            data: {
                'upodkey': theupodkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateApp = this.state.singledata.map(function (od) {
                    upodkey.value = theupodkey;
                    upodid.value = od.orderdetail_id;
                    upordid.value = od.order_id;
                    upproid.value = od.product_id;
                    upodqnty.value = od.orderdetail_quantity;
                    upodprc.value = od.orderdetail_price;
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
                                {this.props.odkey}
                            </td>
                             <td>
                                {this.props.odid} 
                            </td>
                            <td>
                                {this.props.ordid}
                            </td>
                            <td>
                                {this.props.proid}
                            </td>
                            <td>
                                {this.props.odq}
                            </td>
                            <td>
                                {this.props.odp}
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
    <OrderDetailBox />,
    document.getElementById('content')
);