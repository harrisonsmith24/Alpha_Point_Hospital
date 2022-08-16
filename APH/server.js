'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 5000

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "hsmith24",
    password: "",
    database: "hsmith24_Alpha_Point_Hospital",
});

con.connect(function (err){
    if (err) throw err;
    console.log("Connected!");
});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/public/backend/emp_login.html'));
});

app.get('/getloggedout/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    res.send({ redirect: '/backend/emp_login.html'});
});

app.get('/getloggedin/', function (req, res) {

    var viewpage = 0;
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            console.log('payload new:', payload.skey);
            viewpage = payload.skey;
          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
            viewpage = 0;
            console.log("NVT3");
          }
    }
    
    console.log("View: " + viewpage);
    
    return res.send(JSON.stringify(viewpage));
    
});

app.get('/getloggedinuser/', function (req, res) {

    var viewpage = 0;
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey);
            console.log('payload new:', payload.ckey);
            viewpage = payload.ckey;
          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
            viewpage = 0;
            console.log("NVT3");
          }
    }
    
    console.log("View: " + viewpage);
    
    return res.send(JSON.stringify(viewpage));
    
});

app.post('/loginstaff/', function (req, res) {
    var semail = req.body.staffemail;
    var spw = req.body.staffpw;

    var sqlsel = 'select * from ap_staff where staff_email = ?';

    var inserts = [semail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    console.log(semail + " " + spw);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            var skey=data[0].staff_key;
            console.log(data[0].staff_key);

            bcrypt.compare(spw, data[0].staff_password, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ skey }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                      });
                    
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/backend/b_index.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});

app.post('/loginuser/', function (req, res) {
    var cemail = req.body.customeremail;
    var cpw = req.body.customerpw;

    var sqlsel = 'select * from ap_customer where customer_email = ?';

    var inserts = [cemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);
    console.log(cemail + " " + cpw);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            var ckey=data[0].customer_key;
            console.log(data[0].customer_key);

            bcrypt.compare(cpw, data[0].customer_password, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ ckey }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                      });
                    
                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/frontend/index.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});

app.post('/customer/', function (req, res) {
    var cfname = req.body.customerfirstname;
    var clname = req.body.customerlastname;
    var caddress = req.body.customeraddress;
    var cemail = req.body.customeremail;
    var cphone = req.body.customerphone;
    var czip = req.body.customerzip;
    var cstate = req.body.customerstate;
    var cispatient = req.body.customerispatient;
    var cpw = req.body.customerpw;
    console.log("PW: " + cpw);

    var saltRounds = 10;
    var theHashedPW = '';

    bcrypt.hash(cpw, saltRounds, function (err, hashedPassword) {

        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            
            theHashedPW = hashedPassword;
            console.log("Password Enc: " + theHashedPW);

            var sqlins = "INSERT INTO ap_customer (customer_firstname, customer_lastname, customer_address, customer_email, "
            + " customer_phone, customer_zip, customer_state, customer_ispatient, customer_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            var inserts = [cfname, clname, caddress, cemail, cphone, czip, cstate, cispatient, theHashedPW];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('/backend/insert_customer.html');
                res.end();
            });
        }
    });
});

app.post('/staff/', function (req, res, ){

    var sfname = req.body.stafffirstname;
    var slname = req.body.stafflastname
    var saddress = req.body.staffaddress;
    var sphone = req.body.staffphone; 
    var szip = req.body.staffzip;
    var sstate = req.body.staffstate;
    var semail = req.body.staffemail;
    var stype = req.body.stafftype;
    var ssalary = req.body.staffsalary;
    var spw = req.body.staffpw;
    
    console.log(sfname + slname);
    console.log('pw: ' + spw);

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(spw, saltRounds, function (err, hashedPassword){
        if (err) {
            console.log("Bad");
            return
        } 
        else {
            theHashedPW = hashedPassword;
            console.log("Password 1: " + theHashedPW);
    
        var sqlins = "INSERT INTO ap_staff( staff_firstname, staff_lastname, staff_address, staff_phone, staff_zip, staff_state, staff_email, staff_position, staff_salary, staff_password) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var inserts = [ sfname, slname, saddress, sphone, szip, sstate, semail, stype, ssalary, theHashedPW];

        var sql = mysql.format(sqlins, inserts);

        con.execute(sql, function (err,result){
            if (err) throw err;
            console.log("1 record inserted");
            res.redirect('/backend/insert_staff.html');
            res.end();
            });
        }       
    });
});

app.get('/searchstaff/', function (req, res) {
    var sfname = req.query.stafffirstname;
    var slname = req.query.stafflastname;
    var saddress = req.query.staffaddress;
    var sphone = req.query.staffphone; 
    var szip = req.query.staffzip;
    var sstate = req.query.staffstate;
    var semail = req.query.staffemail;
    var sposition = req.query.staffposition;
    var ssalary = req.query.staffsalary;
    
    console.log("Position: " + sposition);

    if (sposition > 0) {
        var positionaddon = ' and staff_position = ?';
        var positionaddonvar = sposition;
    } else {
        var positionaddon = ' and staff_position Like ?';
        var positionaddonvar = '%%';
    }

    var sqlsel = 'Select ap_staff.*, ap_staff_positions.position_name from ap_staff inner join ap_staff_positions on ap_staff_positions.position_id = ap_staff.staff_position where staff_firstname Like ? and staff_lastname Like ? and staff_address Like ? and staff_phone Like ? and staff_zip Like ? and staff_state Like ? and staff_email Like ?' + positionaddon + ' and staff_salary Like ?';
    var inserts = ['%' + sfname + '%', '%' + slname + '%', '%' + saddress + '%', '%' + sphone + '%', '%' + szip + '%', '%' + sstate + '%', '%' + semail + '%', positionaddonvar, '%' + ssalary + '%',];
    
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error!" + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchcustomers/', function (req, res) {
    
    var cfname = req.query.customerfirstname;
    var clname = req.query.customerlastname;
    var caddress = req.query.customeraddress;
    var cphone = req.query.customerphone; 
    var czip = req.query.customerzip;
    var cstate = req.query.customerstate;
    var cemail = req.query.customeremail;
    var cispatient = req.query.customerispatient;
    
    
    console.log("Patient Value: " + cispatient);

    if (cispatient == 1 || cispatient == 0){
        var patientaddon = ' and customer_ispatient = ?';
        var patientaddonvar = cispatient;
    } else {
        var patientaddon = ' and customer_ispatient Like ?';
        var patientaddonvar = '%%';
    }

   var sqlsel = 'SELECT * FROM ap_Search where customer_firstname Like ? and customer_lastname Like ? and customer_address Like ? and customer_phone Like ? and customer_zip Like ? and customer_state Like ? and customer_email Like ?' + patientaddon;
   var inserts = [ '%' + cfname + '%', '%' + clname + '%', '%' + caddress + '%', '%' + cphone + '%', '%' + czip + '%', '%' + cstate + '%', '%' + cemail + '%', patientaddonvar]; 

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error!");
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsinglecustomer/', function (req, res){
    var ckey = req.query.upcuskey

    var sqlsel = 'select * from ap_customer where customer_key = ?';
    var inserts = [ckey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglecustomer/', function (req, res, ){
    var cfname = req.body.upcustomerfirstname;
    var clname = req.body.upcustomerlastname;
    var cadd = req.body.upcustomeraddress;
    var cphone = req.body.upcustomerphone;
    var czip = req.body.upcustomerzip;
    var cstate = req.body.upcustomerstate;
    var cemail = req.body.upcustomeremail;
    var cpatient = req.body.upcustomerispatient;
    var ckey = req.body.upcustomerkey;

    var sqlins = "UPDATE ap_customer SET customer_firstname = ?, customer_lastname = ?, " +
        "customer_address = ?, customer_phone = ?, customer_zip = ?, customer_state = ?, customer_email = ?, customer_ispatient = ? " +
        "WHERE customer_key = ? ";
    var inserts = [ cfname, clname, cadd, cphone, czip, cstate, cemail, cpatient, ckey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/searchorders/', function (req, res) {

    var odate = req.query.orderdate;
    var cusname = req.query.customerlastname;
    var proname = req.query.productname;
    var proprice = req.query.productprice;
    var odquantity = req.query.orderdetailquantity;
    var odtotal = req.query.totalprice;
    
    var sqlsel = 'SELECT O.order_date, C.customer_lastname, P.product_name, P.product_price, I.orderdetail_quantity, I.orderdetail_totalprice ' 
    + 'From ap_order O JOIN ap_orderdetail I ON O.order_key = I.order_key '
    + 'JOIN ap_store_inventory P ON P.product_key = I.product_key '
    + 'JOIN ap_customer C ON O.customer_key= C.customer_key '
    + 'WHERE O.order_date LIKE ? and C.customer_lastname LIKE ? and '
    + 'P.product_name LIKE ? and P.product_price LIKE ? and I.orderdetail_quantity LIKE ? '
    + 'and I.orderdetail_totalprice LIKE ? '
    + 'ORDER BY O.order_date'


    
    var inserts = ['%' + odate + '%', '%' + cusname + '%', '%' + proname + '%', '%' + proprice + '%', '%' + odquantity + '%', '%' + odtotal + '%'];
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error! " + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchordertable/', function (req, res){

    var sqlsel = 'select * from ap_order';

    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleorder/', function (req, res, ){
    var odate = req.body.uporderdate;
    var otime = req.body.upordertime;
    var ocust = req.body.upcustomerlastname;
    var ostf = req.body.upstafflastname;
    var okey = req.body.uporderkey;

    var sqlins = "UPDATE ap_order SET order_date = ?, order_time = ?, customer_key = ?, staff_key = ? "
       + "WHERE order_key = ? ";
    var inserts = [ odate, otime, ocust, ostf, okey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/searchproducts/', function (req, res) {

    var pname = req.query.productname;
    var pprice = req.query.productprice;
    var pquantity = req.query.productquantity;
    
    var sqlsel = 'SELECT * FROM ap_store_inventory '
                + 'WHERE product_name LIKE ? and'
                +' product_quantity LIKE ? and product_price LIKE ?'

    var inserts = [ '%' + pname + '%', '%' + pprice + '%', '%' + pquantity + '%'];
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error! " + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/searchappointments/', function (req, res) {

    var aid = req.query.appointmentid;
    var adate = req.query.appointmentdate;
    var atime = req.query.appointmenttime;
    var cname = req.query.customerlastname;
    var sname = req.query.stafflastname;
    
    var sqlsel = 'SELECT A.appointment_id, A.appointment_date, A.appointment_time, C.customer_lastname, S.staff_lastname  '
                + 'FROM ap_appointments A '
                + 'JOIN ap_customer C ON C.customer_id = A.customer_id '
                + 'JOIN ap_staff S ON A.staff_id = S.staff_id  '
                + 'WHERE S.staff_position=4 and customer_ispatient=0 and A.appointment_id LIKE ? and A.appointment_date LIKE ? and '
                + 'A.appointment_time LIKE ? and C.customer_lastname LIKE ? and S.staff_lastname LIKE ?'

    var inserts = ['%' + aid + '%', '%' + adate + '%', '%' + atime + '%' , '%' + cname + '%', '%' + sname + '%'];
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error! " + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleappointment/', function (req, res){
    var akey = req.query.upappkey

    var sqlsel = 'select * from ap_appointments where appointment_key = ?';
    var inserts = [akey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/searchapps/', function (req, res){

    var sqlsel = 'select * from ap_appointments';

    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleappointment/', function (req, res, ){
    var aid = req.body.upappointmentid;
    var adate = req.body.upappointmentdate;
    var atime = req.body.upappointmenttime;
    var acust = req.body.upcustomerlastname;
    var astf = req.body.upstafflastname;
    var akey = req.body.upappointmentkey;

    var sqlins = "UPDATE ap_appointments SET appointment_id = ?, appointment_date = ?, appointment_time = ?, customer_id = ?, staff_id = ? "
       + "WHERE appointment_key = ? ";
    var inserts = [aid, adate, atime, acust, astf, akey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/searchad/', function (req, res) {

    var aid = req.query.appointmentid;
    var adate = req.query.appointmentdate;
    var pname = req.query.patientlastname;
    var adbp = req.query.adbloodpressure;
    var adw = req.query.adweight;
    var adp = req.query.adpulse;
    var adv = req.query.advision;
    var adh = req.query.adheight;
    var adn = req.query.adnotes;
    
    var sqlsel = 'SELECT A.appointmentdetail_key, D.appointment_key, D.appointment_date, C.customer_lastname, '
                + 'A.appointmentdetail_bloodpressure, A.appointmentdetail_weight, A.appointmentdetail_pulse, '
                + 'A.appointmentdetail_vision, A.appointmentdetail_height, A.appointmentdetail_notes '
                + 'FROM ap_appointments D '
                + 'JOIN ap_appointment_details A ON A.appointment_key = D.appointment_key '
                + 'JOIN ap_customer C ON C.customer_key = D.customer_key  '
                + 'WHERE D.appointment_key LIKE ? '
                + 'and D.appointment_date LIKE ? and C.customer_lastname LIKE ? and A.appointmentdetail_bloodpressure LIKE ? '
                + 'and A.appointmentdetail_weight LIKE ? and A.appointmentdetail_pulse LIKE ? and A.appointmentdetail_vision LIKE ? '
                + 'and A.appointmentdetail_height LIKE ? and A.appointmentdetail_notes LIKE ? '

    var inserts = [ '%' + aid + '%', '%' + adate + '%', '%' + pname + '%' , '%' + adbp + '%', '%' + adw + '%', '%' + adp + '%', '%' + adv + '%', '%' + adh + '%', '%' + adn + '%'];
    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error! " + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getdoctors/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_staff WHERE staff_position=4';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,data) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});


app.get('/getstaffpositions/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_staff_positions';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,data) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getsinglestaff/', function (req, res){
    var skey = req.query.upstfkey

    var sqlsel = 'select * from ap_staff where staff_key = ?';
    var inserts = [skey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesinglestaff/', function (req, res, ){
    var sfname = req.body.upstafffirstname;
    var slname = req.body.upstafflastname;
    var sadd = req.body.upstaffaddress;
    var sphone = req.body.upstaffphone;
    var szip = req.body.upstaffzip;
    var sstate = req.body.upstaffstate;
    var semail = req.body.upstaffemail;
    var stype = req.body.upstaffposition;
    var ssalary = req.body.upstaffsalary;
    var skey = req.body.upstaffkey;

    var sqlins = "UPDATE ap_staff SET staff_firstname = ?, staff_lastname = ?, " +
        "staff_address = ?, staff_phone = ?, staff_zip = ?, staff_state = ?, staff_email = ?, staff_position = ?, staff_salary = ? " +
        "WHERE staff_key = ? ";
    var inserts = [ sfname, slname, sadd, sphone, szip, sstate, semail, stype, ssalary, skey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/getpatients/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_customer WHERE customer_ispatient=0';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,customer_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(customer_id));
    });
});

app.get('/getcustomers/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_customer';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,customer_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(customer_id));
    });
});

app.get('/getcashier/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_staff WHERE staff_position=2 OR staff_position=3 OR staff_position=1';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,customer_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(customer_id));
    });
});

app.get('/getproduct/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_store_inventory';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,product_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(product_id));
    });
});

app.get('/getorder/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_order';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,order_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(order_id));
    });
});

app.post('/inventory/', function (req, res) {
    var iid = req.body.productid;
    var iname = req.body.productname;
    var iquantity = req.body.productquantity;
    var iprice = req.body.productprice;

    var sqlins = "INSERT INTO ap_store_inventory (product_id, product_name, product_quantity, product_price) VALUES (?, ?, ?, ?)";

    var inserts = [iid, iname, iquantity, iprice];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/backend/insert_items.html');
        res.end();
    });   
});

app.post('/updatesingleproduct/', function (req, res, ){
    var pname = req.body.upproductname;
    var pquantity = req.body.upproductquantity;
    var pprice = req.body.upproductprice;
    var pkey = req.body.upproductkey;

    var sqlins = "UPDATE ap_store_inventory SET product_name = ?, product_quantity = ?, product_price = ? "
        + "WHERE product_key = ? ";
    var inserts = [ pname, pquantity, pprice, pkey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/getsingleproduct/', function (req, res){
    var pkey = req.query.upprokey

    var sqlsel = 'select * from ap_store_inventory where product_key = ?';
    var inserts = [pkey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/appointment/', function (req, res) {
    var aid = req.body.appointmentid;
    var adate = req.body.appointmentdate;
    var atime = req.body.appointmenttime;
    var cid = req.body.customer_id;
    var sid = req.body.staff_id;

    var sqlins = "INSERT INTO ap_appointments (appointment_id, appointment_date, appointment_time, customer_id, staff_id) VALUES (?, ?, ?, ?, ?)";

    var inserts = [aid, adate, atime, cid, sid];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/backend/insert_appointment.html');
        res.end();
    });   
});

app.post('/requestappointment/', function (req, res) {
    var rname = req.body.requestname;
    var remail = req.body.requestemail;
    var rphone = req.body.requestphone;
    var rdate = req.body.requestdate;
    var rtime = req.body.requesttime;

    var sqlins = "INSERT INTO ap_request (request_name, request_email, request_phone, request_date, request_time) VALUES (?, ?, ?, ?, ?)";

    var inserts = [rname, remail, rphone, rdate, rtime];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/frontend/appointments.html');
        res.end();
    });   
});

app.get('/searchrequest/', function (req, res) {
    var rname = req.query.requestname;
    var remail = req.query.requestemail;
    var rphone = req.query.requestphone;
    var rdate = req.query.requestdate;
    var rtime = req.query.requesttime;

    var sqlins = 'SELECT * FROM ap_request '
                + 'WHERE request_name LIKE ? and request_email LIKE ? and'
                +' request_phone LIKE ? and request_date LIKE ? and request_time Like ?'

    var inserts = ['%' + rname + '%', '%' + remail + '%', '%' + rphone + '%' , '%' + rdate + '%', '%' + rtime + '%'];
    var sql = mysql.format(sqlins, inserts);

    console.log(sql);

    con.query(sql, function (err,data) {
        if (err){
            console.log("Error! " + err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });   
});

app.post('/order/', function (req, res) {
    var odate = req.body.orderdate;
    var otime = req.body.ordertime;
    var sid = req.body.staff_id;
    var cid = req.body.customer_id

    var sqlins = "INSERT INTO ap_order ( order_date, order_time, staff_key, customer_key) VALUES ( ?, ?, ?, ?)";

    var inserts = [odate, otime, sid, cid];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/public/backend/insert_orders.html');
        res.end();
    });   
});

app.post('/appointment_details/', function (req, res) {
    var aid = req.body.appointment_key;
    var adblood = req.body.appointmentdetail_bloodpressure;
    var adweight = req.body.appointmentdetail_weight;
    var adpulse = req.body.appointmentdetail_pulse;
    var advision = req.body.appointmentdetail_vision;
    var adheight = req.body.appointmentdetail_height;
    var adnotes = req.body.appointmentdetail_notes;
    

    var sqlins = "INSERT INTO ap_appointment_details (appointment_key, appointmentdetail_bloodpressure, appointmentdetail_weight, appointmentdetail_pulse, appointmentdetail_vision, appointmentdetail_height, appointmentdetail_notes) VALUES (?, ?, ?, ?, ?, ?, ?)";

    var inserts = [ aid, adblood, adweight, adpulse, advision, adheight, adnotes];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/backend/insert_appointment_details.html');
        res.end();
    });   
});

app.get('/getad/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_appointment_details';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,order_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(order_id));
    });
});

app.post('/updatesingleappdet/', function (req, res, ){
    var adid = req.body.upappointmentdetailid;
    var appid = req.body.upappointmentid;
    var adbp = req.body.upadbloodpressure;
    var adw = req.body.upadweight;
    var adp = req.body.upadpulse;
    var adv = req.body.upadvision;
    var adh = req.body.upadheight;
    var adq = req.body.upadnotes;
    var adkey = req.body.upappointmentdetailkey;

    var sqlins = "UPDATE ap_appointment_details SET appointmentdetail_id = ?, appointment_id = ?, appointmentdetail_bloodpressure = ?, appointmentdetail_weight = ?, appointmentdetail_pulse = ?, appointmentdetail_vision = ?, appointmentdetail_height = ?, appointmentdetail_notes = ? "
       + "WHERE appointmentdetail_key = ? ";
    var inserts = [adid, appid, adbp, adw, adp, adv, adn, adh, adq, adkey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});

app.get('/getsingleappointmentdet/', function (req, res){
    var adkey = req.query.upadkey

    var sqlsel = 'select * from ap_appointment_details where appointmentdetail_key = ?';
    var inserts = [adkey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getappointments/', function (req, res) {

    var sqlsel = 'SELECT * FROM ap_appointments';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err,appointment_id) {
        if (err){
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(appointment_id));
    });
});

app.post('/order_details/', function (req, res) {
    var odtotal = req.body.orderdetail_totalprice;
    var odquantity = req.body.orderdetail_quantity;
    var pid = req.body.product_id;
    var oid = req.body.order_id

    var sqlins = "INSERT INTO ap_orderdetail ( orderdetail_totalprice, orderdetail_quantity, product_key, order_key) VALUES ( ?, ?, ?, ?)";

    var inserts = [ odtotal, odquantity, pid, oid];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        res.redirect('/backend/insert_order_details.html');
        res.end();
    });   
});

app.get('/getsingleorder/', function (req, res){
    var ckey = req.query.upodrkey

    var sqlsel = 'select * from ap_order where order_key = ?';
    var inserts = [ckey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleorderdet/', function (req, res){
    var odkey = req.query.upodkey

    var sqlsel = 'select * from ap_orderdetail where orderdetail_key = ?';
    var inserts = [odkey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getod/', function (req, res){

    var sqlsel = 'select * from ap_orderdetail';

    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data){
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/updatesingleorderdetail/', function (req, res, ){
    var odid = req.body.uporderdetailid;
    var oid = req.body.uporderid
    var proid = req.body.upproductid;
    var odq = req.body.upodquantity;
    var odp = req.body.upoprice;
    var odkey = req.body.uporderdetailkey;

    var sqlins = "UPDATE ap_orderdetail SET orderdetail_id = ?, order_id = ?, product_id = ?, orderdetail_quantity = ?, orderdetail_totalprice = ? "
       + "WHERE orderdetail_key = ? ";
    var inserts = [odid, oid, proid, odq, odp, odkey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql,function (err, result){
        console.log("1 record updated");
        res.end();
    });
});



app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
