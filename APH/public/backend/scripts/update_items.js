var stfuser = 0;
var ProductBox = React.createClass({
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

    updateSingleProductFromServer: function (product) {
        
        $.ajax({
            url: '/updatesingleproduct/',
            dataType: 'json',
            data: product,
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
            <h1>Update Staff</h1>
            <Productform2 onProductSubmit={this.loadProductFromServer} />
            <br />
            <div id = "theresults">
                <div id = "theleft">
                <table>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Product Name</th>
                            <th>Product Quantity</th>
                            <th>Product Price</th>
                            <th></th>
                        </tr>
                     </thead>
                    <ProductList data={this.state.data} />
                </table>
                </div>
                <div id="theright">
                    <ProductUpdateForm onUpdateSubmit={this.updateSingleProductFromServer} />
                </div>                
            </div>
        </div>
        );}
    }
});

var Productform2 = React.createClass({
    getInitialState: function () {
        return {
            productkey: "",
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

var ProductUpdateForm = React.createClass({
    getInitialState: function () {
        return {
            upproductkey: "",
            upproductname: "",
            upproductquantity:"",
            upproductprice:"",
        };
    },

    handleUpSubmit: function (e) {

        e.preventDefault();
        var upproductkey = upprokey.value;
        var upproductname = upproname.value;
        var upproductquantity = upproquantity.value;
        var upproductprice = upproprice.value;

        this.props.onUpdateSubmit({
            upproductkey: upproductkey,
            upproductname: upproductname,
            upproductquantity: upproductquantity,
            upproductprice: upproductprice,
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
            <div id = "theform">
            <form onSubmit={this.handleUpSubmit}>
                <h2>Product</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <input name="upproname" id="upproname" value={this.state.upproname} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <input name="upproquantity" id="upproquantity" value={this.state.upproquantity} onChange={this.handleUpChange}  />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <input name="upproprice" id="upproprice" value={this.state.upproprice} onChange={this.handleUpChange}  />
                            </td>
                        </tr>         
                    </tbody>
                </table>
                    <br />
                        <input type="hidden" name="upprokey" id="upprokey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Product" />
                    </form>
            </div>
        </div>
        
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

    getInitialState: function () {
        return {
            upprokey: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var theupprokey = this.props.prokey;
        
        this.loadSinglePro(theupprokey);
    },
    loadSinglePro: function (theupprokey) {
        $.ajax({
            url: '/getsingleproduct',
            data: {
                'upprokey': theupprokey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populatePro = this.state.singledata.map(function (product) {
                    upprokey.value = theupprokey;
                    upproname.value = product.product_name;
                    upproquantity.value = product.product_quantity;
                    upproprice.value = product.product_price;
                    

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
    <ProductBox />,
    document.getElementById('content')
);