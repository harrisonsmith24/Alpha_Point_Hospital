var stfuser = 0;
var ProductBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
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
    loadProductFromServer: function () {

        $.ajax({
            url: '/searchproducts/',
            data: {
                'productname': productname.value,
                'productquantity': productquantity.value,
                'productprice': productprice.value, 
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
        this.loadProductFromServer();
       // setInterval(this.loadProductFromServer, this.props.pollInterval);
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
                <h1>Product</h1>
                <Productform2 onProductSubmit={this.loadProductFromServer} />
                <br />
                <table>
                        <thead>
                            <tr>
                                <th>Product Key</th>
                                <th>Product Name</th>
                                <th>Product Quantity</th>
                                <th>Product Price</th>
                            </tr>
                         </thead>
                        <ProductList data={this.state.data} />
                    </table>
                
            </div>
        );}
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            productname: "",
            productquantity:"",
            productprice:"",
        };
    },

    handleOptionChange: function (e){
        this.setState({
            selectedOption: e.target.value
        });
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var productname = this.state.productname.trim();
        var productquantity = this.state.productquantity.trim()
        var productprice = this.state.productprice.trim();

        this.props.onProductSubmit({
            productname: productname,
            productquantity: productquantity,
            productprice: productprice,
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
                <h2>Product</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input name="productname" id="productname" value={this.state.productname} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input name="productquantity" id="productquantity" value={this.state.productquantity} onChange={this.handleChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input name="productprice" id="productprice" value={this.state.productprice} onChange={this.handleChange}  />
                            </td>
                        </tr>         
                    </tbody>
                </table>
                <input type="submit" value="Search Product" />

            </form>
        );
    }
});

var ProductList = React.createClass({
    render: function () {
        var productNodes = this.props.data.map(function (product) {
            //map the data to individual donations
            return (
                <Product
                    key={product.product_key}
                    prokey={product.product_key}
                    proname={product.product_name}
                    proquantity={product.product_quantity}
                    proprice={product.product_price}
                >
                </Product>
            );             
        });
        
        //print all the nodes in the list
        return (
             <tbody>
                {productNodes}
            </tbody>
        );
    }
});

var Product = React.createClass({

    render: function () {

        return (

            <tr>
                            <td>
                                {this.props.prokey} 
                            </td>
                            <td>
                                {this.props.proname}
                            </td>
                            <td>
                                {this.props.proquantity}
                            </td>
                            <td>
                                {this.props.proprice}
                            </td>
                </tr>
        );
    }
});

ReactDOM.render(
    <ProductBox />,
    document.getElementById('content')
);