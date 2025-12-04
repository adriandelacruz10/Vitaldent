$(document).ready(function () {
    var firebaseConfig = {
        apiKey: "AIzaSyD37r-ptUVhFcTwynoVw6ty5nPHVOLDE-E",
        authDomain: "vitaldent-ambato.firebaseapp.com",
        databaseURL: "https://vitaldent-ambato-default-rtdb.firebaseio.com",
        projectId: "vitaldent-ambato",
        storageBucket: "vitaldent-ambato.appspot.com",
        messagingSenderId: "493172445357",
        appId: "1:493172445357:web:a499daab5a27a2d962b624"
    };
    //Inicializar firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    //Variables Globales
    var listaFacturas = [];
    var fechaAct = fechaActual();
    //Llenar el nombre del usuario
    cargarUsuario();
    //Cargas iniciales
    llenarLista();
    
    //EVENTOS CLICK
    $("#btnAño").click(function () {
        
    })
    $("#btnMes").click(function () {
        
    })
    $("#btnHoy").click(function () {
        
    })
    $("#btnTodo").click(function () {
        cargarFacturas();
    })

    //EVENTOS CHANGE
    $("#meses").click(function () {
        cargarFacturas();
    })

    //METODOS
    //Llena la lista con las facturas
    function llenarLista() {
        var referencia = database.ref("Facturas");
        var facturas = [];
        referencia.on("value", function (datos) {
            facturas = datos.val();
            $.each(facturas, function (id, factura) {
                var fac = {
                    cedula: factura.ced_fac,
                    doctor: factura.doc_fac,
                    fecha: factura.fec_fac,
                    paciente: factura.nom_fac,
                    numero: factura.num_fac,
                    total: factura.tot_fac,
                    pagado: factura.pag_fac,
                };
                listaFacturas.push(fac);
            })
            cargarFacturas();
        })
    }
    //Cargar todas las facturas del paciente
    function cargarFacturas() {
        var cadena;
        var facturado = 0;
        var deuda = 0;
        var pagado = 0;
        listaFacturas.forEach(factura =>{
            cadena += "<tr>";
                if (factura.numero == "") {
                    cadena += "<td>S/F</td>"
                } else {
                    cadena += "<td>" + factura.numero + "</td>";
                }
                cadena += "<td>" + factura.fecha + "</td>";
                cadena += "<td>" + factura.paciente + "</td>";
                cadena += "<td>" + factura.doctor + "</td>";
                cadena += "<td>" + factura.total + "</td>";
                cadena += "<td>" + factura.pagado + "</td>";
                var aux = 0;
                if (factura.numero == "Abono") {
                    cadena += "<td>0</td>"
                } else {
                    aux = factura.total - factura.pagado;
                    cadena += "<td>" + aux + "</td>";
                }
                facturado += parseInt(factura.total);
                pagado += parseInt(factura.pagado);
                deuda = facturado - pagado;
                cadena += "</tr>";
        })
        $("#total").html(facturado);
            $("#pagado").html(pagado);
            $("#deuda").html(deuda);
            $("#listado").html(cadena);
            if (deuda == 0) {
                $("#btnAbono").attr("disabled", true);
            } else {
                $("#btnAbono").attr("disabled", false);
            }
    }
    //Obtiene y devuelve la fecha actual
    function fechaActual() {
        var d = new Date();
        var año = d.getFullYear();
        var mes = d.getMonth();
        var dia = d.getDate();
        if (dia < 10) {
            dia = "0" + dia;
        }
        mes = mes + 1;
        if (mes < 10) {
            mes = "0" + mes;
        }
        var fechaActual = año + "-" + mes + "-" + dia;
        return fechaActual;
    }
    //Carga el nombre y la imagen de usuario
    function cargarUsuario() {
        var nombre = "<p>Elizabeth Bastidas</p>";
        $(nombre).appendTo("#usuario");
        $("#btnSalir").click(function () {
            if (confirm("¿Está seguro/a que desea salir?") == true) {
                location.assign("../index.html");
            }
        })
    }
})