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
    
    //metodo once() carga una sola vez, on() carga en tiempo en real
    //Inicializar firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    //Variables Globales
    var nombrePac = localStorage.getItem("nombrePaciente");
    var cedulaPac = localStorage.getItem("cedulaPaciente");
    var fechaAct = fechaActual();
    //Llenar el nombre del usuario
    cargarUsuario();
    //Cargas iniciales
    cargarFacturas();

    //EVENTOS CLICK
    $("#btnFactura").click(function () {
        location.assign("factura.html");
    })
    $("#btnCita").click(function () {
        location.assign("citas.html");
    })
    $("#btnAbono").click(function () {
        cargarCampos();
    })
    $("#btnOdontograma").click(function () {
        location.assign("odontograma.html");
    });
    $('#btnReiniciar').click(function () {
        reiniciarCaja();
    })

    //METODOS
    //Cargar todas las facturas del paciente
    function cargarFacturas() {
        var referencia = database.ref();
        var facturas = [];
        referencia.child("Facturas").orderByChild("nom_fac").equalTo(nombrePac).on("value", snapshot => {
            var cadena;
            var facturado = 0;
            var deuda = 0;
            var pagado = 0;
            if (snapshot.exists()) {
                facturas = [];
                $.each(snapshot.val(), function (id, factura) {
                    factura.id = id;
                    facturas.push(factura);
                });
                facturas.sort((a, b) => new Date(b.fec_fac) - new Date(a.fec_fac));

                $.each(facturas, function (_, factura) {
                    cadena += "<tr>";
                    if (factura.num_fac == "") {
                        cadena += "<td>S/F</td>"
                    } else {
                        cadena += "<td>" + factura.num_fac + "</td>";
                    }
                    cadena += "<td>" + factura.fec_fac + "</td>";
                    cadena += "<td>" + factura.tip_fac + "</td>";
                    cadena += "<td>" + factura.doc_fac + "</td>";
                    cadena += "<td>" + (factura.obs_fac  || '') + "</td>";
                    var des = factura.des_fac == null ? 0 : factura.des_fac;
                    cadena += "<td>" + (parseFloat(factura.tot_fac) + parseFloat(des)) + "</td>";
                    cadena += "<td>" + des + "</td>";
                    cadena += "<td>" + factura.tot_fac + "</td>";
                    var pag = (factura.pag_fac == "") ? 0 : factura.pag_fac;
                    cadena += "<td>" + pag + "</td>";
                    var aux = 0;
                    if (factura.num_fac == "Abono" || factura.num_fac == "Reiniciar") {
                        cadena += "<td>0</td>"
                        cadena += "<td> <button type='button' class='btn btn-outline-primary btn-sm' disabled>" +
                            "Ver </button> <button type='button' data-toggle='modal' data-target='#modalConfirmarA' class='btnEliminarA btn btn-outline-danger btn-sm' id='" + factura.id + "'>" +
                            "Eliminar </button> </td>";
                    } else {
                        aux = factura.tot_fac - pag;
                        cadena += "<td>" + aux + "</td>";
                        cadena += "<td> <button type='button' data-toggle='modal' data-target='#modalDetalle' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + factura.cod_fac + "'>" +
                            "Ver </button> <button type='button' data-toggle='modal' data-target='#modalConfirmar' class='btnEliminar btn btn-outline-danger btn-sm' id='" + factura.id + "*" + factura.cod_fac + "'>" +
                            "Eliminar </button> </td>";
                    }

                    cadena += "</tr>";
                    facturado += parseInt(factura.tot_fac);
                    pagado += parseInt(pag);
                    deuda = facturado - pagado;
                })
            }
            $("#total").html(facturado);
            $("#pagado").html(pagado);
            $("#deuda").html(deuda);
            $("#listado").html(cadena);
            //Eventos del click
            //Ver detalles de la factura
            $(".btnVer").click(function () {
                var id = this.id;
                mostrarDetalles(id);
            })
            //Elimar facturas y detalles
            $(".btnEliminar").click(function () {
                var id = this.id;
                var datos = id.split("*");
                $("#btnConfirmar").click(function(){
                    eliminarFacturas(datos[0], datos[1]);
                });
                /*if (confirm("¿Seguro que quiere eliminar la factura?") == true) {
                    eliminarFacturas(datos[0], datos[1]);
                }*/
            })
            //Eliminar abonos
            $(".btnEliminarA").click(function () {
                var id = this.id;
                $("#btnConfirmarA").click(function(){
                    eliminarAbonos(id);
                });
            })

            if (deuda == 0) {
                $("#btnAbono").attr("disabled", true);
            } else {
                $("#btnAbono").attr("disabled", false);
            }
        })
        $("#nombre").html("PAGOS (" + nombrePac + ")");
    }

    //Cargar los campos para un abono
    function cargarCampos() {
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Fecha:</label>";
        cadena += "<div class='col-sm-3'>";
        cadena += "<input id='txtFechaAbo' type='date' class='form-control' value='" + fechaAct + "'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Monto($):</label>";
        cadena += "<div class='col-sm-3'>";
        cadena += "<input type='number' class='form-control' id='monto' value='0'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Tipo de pago:</label>";
        cadena += "<div class='col-sm-3'>";
        cadena += "<select class='custom-select' id='tiposA'>";
        cadena += "<option>Efectivo</option>";
        cadena += "<option>Transferencia</option>";
        cadena += "<option>Tarjeta</option>";
        cadena += "</select>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Observación:</label>";
        cadena += "<div class='col-sm-3'>";
        cadena += "<input type='text' class='form-control' id='txtObservacion'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10'>"
        cadena += "<button type='button' class='btn btn-outline-success' id='btnGuardar'>Guardar</button> ";
        cadena += "<button type='button' class='btn btn-outline-danger' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#abono").html(cadena);
        //Eventos click de botones recien creados
        $("#btnGuardar").click(function () {
            guardarAbono();
        })
        $("#btnCancelar").click(function () {
            $("#abono").html("");
        })
    }

    //Muestra los detalles de una factura
    function mostrarDetalles(cod) {
        var referencia = database.ref();
        var facturas = [];
        referencia.child("Detalle_Facturas").orderByChild("cod_det").equalTo(cod).once("value", snapshot => {
            var cadena;
            if (snapshot.exists()) {
                facturas = snapshot.val();
                $.each(facturas, function (id, factura) {
                    cadena += "<tr>";
                    cadena += "<td>" + factura.tra_det + "</td>";
                    cadena += "<td>" + factura.pie_det + "</td>";
                    cadena += "<td>" + factura.can_det + "</td>";
                    cadena += "<td>" + factura.pre_det + "</td>";
                    cadena += "<td>" + factura.tot_det + "</td>";
                    if (factura.est_det == "SI") {
                        cadena += "<td> <input type='checkbox' class='est' checked id='" + id + "*" + factura.tra_det + "'> </td>";
                    } else {
                        cadena += "<td> <input type='checkbox' class='est' id='" + id + "*" + factura.tra_det + "'> </td>";
                    }
                    cadena += "</tr>";
                })
            } else {
                console.log("No exites");
            }
            $("#listadoDet").html(cadena);

            //Evento change del check
            $(".est").change(function () {
                var id = this.id;
                var datos = id.split("*");
                if (this.checked) {
                    if (confirm("¿Seguro que desea cambiar el estado del tratamiento " + datos[1] + "?") == true) {
                        actualizarEstado(datos[0], "SI");
                    } else {
                        this.checked = false;
                    }
                } else {
                    if (confirm("¿Seguro que desea cambiar el estado del tratamiento " + datos[1] + "?") == true) {
                        actualizarEstado(datos[0], "NO");
                    } else {
                        this.checked = true;
                    }
                }
            })
        })
    }

    //Actualizar el estado del tratamiento
    function actualizarEstado(id, est) {
        console.log(id);
        var referencia = database.ref("Detalle_Facturas");
        referencia.child(id).update({
            est_det: est
        })
    }

    //Inserta el abono 
    function guardarAbono() {
        var referencia = database.ref("Facturas");
        referencia.push({
            ced_fac: cedulaPac,
            doc_fac: "",
            fec_fac: $('#txtFechaAbo').val(),
            nom_fac: nombrePac,
            num_fac: "Abono",
            pag_fac: $("#monto").val(),
            tip_fac: $("#tiposA").val(),
            obs_fac: $('#txtObservacion').val(),
            tot_fac: 0,
            id_fac: ""
        })
        $("#abono").html("");
    }

    //Eliminar facturas con los detalles
    function eliminarFacturas(id, cod) {
        var referencia = database.ref();
        var facturas = [];
        referencia.child("Detalle_Facturas").orderByChild("cod_det").equalTo(cod).on("value", snapshot => {
            if (snapshot.exists()) {
                facturas = snapshot.val();
                $.each(facturas, function (id, factura) {
                    eliminarDetalles(id);
                })
            }
        })
        
        //Eliminar la factura total 
        eliminarAbonos(id);
    }

    //Eliminar facturas con los detalles
    function eliminarAbonos(id) {
        var referencia = database.ref("Facturas");
        referencia.child(id).remove();
    }

    //Eliminar los detalles 
    function eliminarDetalles(id) {
        console.log("Detalles: " + id);
        var referencia = database.ref("Detalle_Facturas");
        referencia.child(id).remove();
    }

    //Inserta el abono 
    function reiniciarCaja() {
        if(confirm('¿Está seguro que desea reiniciar la caja del paciente actual?') == true){
            var referencia = database.ref("Facturas");
            referencia.push({
                ced_fac: cedulaPac,
                doc_fac: "",
                fec_fac: fechaActual(),
                nom_fac: nombrePac,
                num_fac: "Reiniciar",
                pag_fac: $('#deuda').html(),
                tip_fac: "",
                obs_fac: "Cuenta reiniciada",
                tot_fac: 0,
                id_fac: ""
            })
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