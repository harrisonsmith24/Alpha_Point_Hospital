var stfuser = 0;
var InventoryBox = React.createClass({
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
    handleInventorySubmit: function (product) {
    
        $.ajax({
            url: '/inventory/',
            dataType: 'json',
            type: 'POST',
            data: product,
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
            <div className="InventoryBox">
                <h1>Inventory</h1>
                <Inventoryform2 onInventorySubmit = {this.handleInventorySubmit} />
            </div>
        );}
    }
});

var Inventoryform2 = React.createClass({
    getInitialState: function () {
        return {
            productname: "",
            productquantity: "",
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
        var productquantity = this.state.productquantity.trim();
        var productprice = this.state.productprice.trim();

        this.props.onInventorySubmit({
            productname: productname,
            productquantity: productquantity,
            productprice: productprice,    
        });

    },

    validateEmail: function (value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {
        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    validateNumber: function (value) {
        if (isNaN(value)){
            return ("Not a number");
        };

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
                <h2>Inventorys</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Product Name</th>
                            <td>
                                <TextInput
                                    value={this.state.productname}
                                    uniqueName="productname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'productname')}
                                    errorMessage="Product Name is invalid"
                                    emptyMessage="Product Name is required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.productquantity}
                                    uniqueName="productquantity"
                                    textArea={false}
                                    required={false}
                                    minCharacters={1}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'productquantity')}
                                    errorMessage="Product quantity is invalid" />
                            </td>
                        </tr>
                        <tr>
                            <th>Product Price</th>
                            <td>
                                <TextInput
                                    value={this.state.productprice}
                                    uniqueName="productprice"
                                    textArea={false}
                                    required={true}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'productprice')}
                                    errorMessage="Invalid price amount"
                                    emptyMessage="Price is Required" />
                            </td>
                        </tr>
                       
                    </tbody>
                </table>
                <input type="submit" value="Insert Product" />
               
            </form>
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
    <InventoryBox />,
    document.getElementById('content')
);