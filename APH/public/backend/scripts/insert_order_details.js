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
    handleOrderDetailSubmit: function (order) {
    
        $.ajax({
            url: '/order_details/',
            dataType: 'json',
            type: 'POST',
            data: order,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
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
            <div className="OrderDetailBox">
                <h1>Order Details</h1>
                <OrderDetailform2 onOrderDetailSubmit = {this.handleOrderDetailSubmit} />
            </div>
        );}
    }
});

var OrderDetailform2 = React.createClass({
    getInitialState: function () {
        return {
            orderdetail_totalprice: "",
            orderdetail_quantity: "",
            product_id: [],
            order_id: [],
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    loadProducts: function(){
        $.ajax({
            url: '/getproduct/',
            dataType: 'json',
            cache: false,
            success: function (product_id) {
                this.setState({ product_id: product_id });
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
            success: function (order_id) {
                this.setState({ order_id: order_id });
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

        var orderdetail_totalprice = this.state.orderdetail_totalprice.trim();
        var orderdetail_quantity = this.state.orderdetail_quantity.trim();
        var product_id = productid.value;
        var order_id = orderid.value;

        this.props.onOrderDetailSubmit({
            orderdetail_totalprice: orderdetail_totalprice,
            orderdetail_quantity: orderdetail_quantity,
            product_id: product_id,
            order_id: order_id,
        });

        
    },

    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    commonValidate: function () {
        return true;
    },
    setValue: function (field, event) {
        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h2>OrderDetails</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Select Product</th>
                            <td><SelectProductList data = {this.state.product_id} /></td>    
                        </tr> 
                        <tr>
                            <th>Order Detail Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.orderdetail_quantity}
                                    uniqueName="orderdetail_quantity"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'orderdetail_quantity')}
                                    errorMessage="Order Quantity is invalid"
                                    emptyMessage="Order Quantity is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Detail Total Price</th>
                            <td>
                                <TextInput
                                    value={this.state.orderdetail_totalprice}
                                    uniqueName="orderdetail_totalprice"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'orderdetail_totalprice')}
                                    errorMessage="Order Price is invalid"
                                    emptyMessage="Order Price is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Select Order</th>
                            <td><SelectOrderList data = {this.state.order_id} /></td>    
                        </tr> 
                       
                    </tbody>
                </table>
                <input type="submit" value="Insert Order Detail" />
               
            </form>
        );
    }
});

var SelectProductList = React.createClass ({
    render: function () {
        var optionNodes = this.props.data.map(function (productList){
            return (
                <option
                    key = {productList.product_key}
                    value = {productList.product_key}
                    >
                        {productList.product_name + " " + productList.product_price + " " + productList.product_key}
                    </option>
            );
        });
        return (
            <select name = "productid" id = "productid">
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
                    key = {orderList.order_key}
                    value = {orderList.order_key}
                    >
                        {orderList.order_key}
                    </option>
            );
        });
        return (
            <select name = "orderid" id = "orderid">
                {optionNodes}
            </select>
        );
    }
});



var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
                <td> {this.props.errorMessage} </td>
        )
    }
});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: "",
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },

    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        type={this.props.inputType}
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});

ReactDOM.render(
    <OrderDetailBox />,
    document.getElementById('content')
);