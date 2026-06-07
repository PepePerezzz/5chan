const mysql = require("mysql2");

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pinterest"
});

conexion.connect((error) => {
    if(error){
        console.log("Error BD:", error);
    }else{
        console.log("MySQL conectado");
    }
});

module.exports = conexion;