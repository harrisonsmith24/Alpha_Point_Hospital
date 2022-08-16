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
            url: '/searchorders/',
            data: {
                'orderdate': orderdate.value,
                'customerlastname': customerlastname.value,
                'productname': productname.value,
                'productprice': productprice.value,
                'orderdetailquantity': orderdetailquantity.value,
                'totalprice': totalprice.value  
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
        }else{        return (
            <div>
                <h1>Order</h1>
                <Orderform2 onOrderSubmit={this.loadOrderFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Order Date</th>
                                <th>Customer Name</th>
                                <th>Product Name</th>
                                <th>Product Price</th>
                                <th>Order Quantity</th>
                                <th>Total Price</th>
                            </tr>
                         </thead>
                        <OrderList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdate: "",
            customerlastname: "",
            productname: "",
            productprice:"",
            orderdetailquantity: "",
            totalprice:""
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var orderdate = this.state.orderdate;
        var customerlastname = this.state.customerlastname.trim();
        var productname = this.state.productname.trim();
        var productprice = this.state.productprice.trim();
        var orderdetailquantity = this.state.orderdetailquantity.trim();
        var totalprice = this.state.totalprice;

        this.props.onOrderSubmit({
            orderdate: orderdate,
            customerlastname: customerlastname,
            productname: productname,
            productprice: productprice,
            orderdetailquantity: orderdetailquantity,
            totalprice: totalprice,
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
                <h2>Order</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Order Date</th>
                            <td>
                                <input name="orderdate" id="orderdate" value={this.state.orderdate} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Customer Last Name</th>
                            <td>
                                <input name="customerlastname" id="customerlastname" value={this.state.customerlastname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input name="productname" id="productname" value={this.state.productname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input name="productprice" id="productprice" value={this.state.productprice} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Quantity</th>
                            <td>
                                <input name="orderdetailquantity" id="orderdetailquantity" value={this.state.orderdetailquantity} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Total Price</th>
                            <td>
                                <input name="totalprice" id="totalprice" value={this.state.totalprice} onChange={this.handleChange}  />
                            </td>
                        </tr>
                      
                    </tbody>
                </table>
                <input type="submit" value="Search Order" />

            </form>
        );
    }
});

var OrderList = React.createClass({
    render: function () {
        var orderNodes = this.props.data.map(function (order) {
            //map the data to individual donations
            return (
                <Order
                    key={order.order_key}
                    odrkey={order.order_key}
                    odrid={order.order_key}
                    odrdate={order.order_date}
                    cusname={order.customer_lastname}
                    proname={order.product_name}
                    proprice={order.product_price}
                    odrquantity={order.orderdetail_quantity}
                    totprice = {order.orderdetail_totalprice}

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

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.odrdate}
                            </td>
                            <td>
                                {this.props.cusname}
                            </td>
                            <td>
                                {this.props.proname}
                            </td>
                            <td>
                                {this.props.proprice}
                            </td>
                            <td>
                                {this.props.odrquantity}
                            </td>
                            <td>
                                {this.props.totprice}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);