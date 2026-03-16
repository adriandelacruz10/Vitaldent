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
    //Llenar el nombre del usuario
    cargarUsuario();

    //EVENTOS CLICK
    $("#btnConsultar").click(function () {
        $("#btnSemanaAct").prop('disabled', false);
        $("#btnMesAct").prop('disabled', false);
        $("#btnSemanaAnt").prop('disabled', false);
        $("#btnMesAnt").prop('disabled', false);
        cargarFacturas();
    })
    $("#btnSemanaAct").click(function () {
        $(this).prop('disabled', true);
        $("#btnMesAct").prop('disabled', false);
        $("#btnSemanaAnt").prop('disabled', false);
        $("#btnMesAnt").prop('disabled', false);
        cargarFacturasRango("ACT", "SEM");
    })
    $("#btnMesAct").click(function () {
        $(this).prop('disabled', true);
        $("#btnSemanaAct").prop('disabled', false);
        $("#btnSemanaAnt").prop('disabled', false);
        $("#btnMesAnt").prop('disabled', false);
        cargarFacturasRango("ACT", "MES");
    })
    $("#btnSemanaAnt").click(function () {
        $(this).prop('disabled', true);
        $("#btnSemanaAct").prop('disabled', false);
        $("#btnMesAct").prop('disabled', false);
        $("#btnMesAnt").prop('disabled', false);
        cargarFacturasRango("ANT", "SEM");
    })
    $("#btnMesAnt").click(function () {
        $(this).prop('disabled', true);
        $("#btnSemanaAct").prop('disabled', false);
        $("#btnMesAct").prop('disabled', false);
        $("#btnSemanaAnt").prop('disabled', false);
        cargarFacturasRango("ANT", "MES");
    })

    //METODOS
    //Cargar las facturas por dia
    function cargarFacturas() {
        var fec = $("#txtFecha").val();
        if(fec == ""){
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Por favor llene los campos requeridos! </strong>";
            alerta += "</div>";
            $(alerta).appendTo("#alerta");
        }else{
            var tipCon = `(Diario: ${fec})`;
            $("#txtTipoCon").html(tipCon);
            $("#txtTipoConPil").html(tipCon);
            $("#listado").empty();
            $("#listadoPillaro").empty();

            var referencia = database.ref("Facturas");
            referencia.orderByChild("fec_fac").equalTo(fec).once("value")
            .then(function(snapshot) {
                if (snapshot.exists()) {
                    var cadena = "";
                    var tot = 0;
                    var efe = 0;
                    var tra = 0;
                    var tar = 0;
                    snapshot.forEach(function(childSnapshot) {
                        var factura = childSnapshot.val();
                        if(factura.pag_fac != "0" && factura.pag_fac != ""){
                            cadena += "<tr>";
                            cadena += "<td>" + factura.fec_fac + "</td>";
                            if(factura.num_fac == "Abono"){
                                cadena += "<td>" + factura.num_fac + "</td>";
                            }else{
                                cadena += "<td> Factura </td>";
                            }
                            cadena += "<td>" + factura.tip_fac + "</td>";
                            cadena += "<td>" + factura.ced_fac + "</td>";
                            cadena += "<td>" + factura.nom_fac + "</td>";
                            cadena += "<td>" + factura.doc_fac + "</td>";
                            cadena += "<td style='text-align: right'>" + parseFloat(factura.pag_fac).toFixed(2) + "</td>";
                            cadena += "<td class='check-col'><input type='checkbox' class='row-check' aria-label='Seleccionar fila'></td>";
                            cadena += "</tr>";
                            switch(factura.tip_fac){
                                case "Efectivo":
                                    efe += parseFloat(factura.pag_fac);
                                    break;
                                case "Transferencia":
                                    tra += parseFloat(factura.pag_fac);
                                    break;
                                case "Tarjeta":
                                    tar += parseFloat(factura.pag_fac);
                                    break;
                            }
                            tot += parseFloat(factura.pag_fac);
                        }
                    });
                    cadena += "<tr>";
                    cadena += "<td colspan=5></td>";
                    cadena += "<td> Total efectivo </td>";
                    cadena += "<td style='text-align: right'>" + efe.toFixed(2) +" </td>";
                    cadena += "<td></td>";
                    cadena += "</tr>";
                    cadena += "<tr>";
                    cadena += "<td colspan=5></td>";
                    cadena += "<td> Total transferencia </td>";
                    cadena += "<td style='text-align: right'>" + tra.toFixed(2) +" </td>";
                    cadena += "<td></td>";
                    cadena += "</tr>";
                    cadena += "<tr>";
                    cadena += "<td colspan=5></td>";
                    cadena += "<td> Total tarjeta </td>";
                    cadena += "<td style='text-align: right'>" + tar.toFixed(2) +" </td>";
                    cadena += "<td></td>";
                    cadena += "</tr>";
                    cadena += "<tr>";
                    cadena += "<td colspan=5></td>";
                    cadena += "<th> Total general </th>";
                    cadena += "<td style='text-align: right'> <b>" + tot.toFixed(2) +"</b> </td>";
                    cadena += "<td></td>";
                    cadena += "</tr>";
                    $("#listado").html(cadena);
                } else {
                    var alerta = "<div class='alert alert-danger'>";
                    alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> No hay facturas para la fecha seleccionada </strong>";
                    alerta += "</div>";
                    $(alerta).appendTo("#alerta");
                }
            })
            .catch(function(error) {
                var alerta = "<div class='alert alert-danger'>";
                alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Error al obtener las facturas </strong>";
                alerta += "</div>";
                $(alerta).appendTo("#alerta");
            });
        }
    }
    $('#listado').on('change', 'input.row-check', function () {
        $(this).closest('tr').toggleClass('row-checked', this.checked);
    });

    //Cargar las facturas de acuerdo al rango de fechas
    function cargarFacturasRango(tipo, tiempo){
        const {inicio, fin} = (tiempo == "SEM") ? obtenerRangoSemana(tipo, new Date()) : obtenerRangoMes(tipo, new Date());
        
        var tipCon = tiempo == "SEM" ? `(Semanal: ${inicio} / ${fin})` : `(Mensual: ${inicio} / ${fin})`;
        $("#txtTipoCon").html(tipCon);
        $("#listado").empty();

        var referencia = database.ref("Facturas");
        referencia.orderByChild("fec_fac").startAt(inicio).endAt(fin).once("value")
        .then(function(snapshot) {
            if (snapshot.exists()) {
                var cadena;
                var tot = 0;
                var efe = 0;
                var tra = 0;
                var tar = 0;
                snapshot.forEach(function(childSnapshot) {
                    var factura = childSnapshot.val();
                    if(factura.pag_fac != "0" && factura.pag_fac != ""){
                        cadena += "<tr>";
                        cadena += "<td>" + factura.fec_fac + "</td>";
                        if(factura.num_fac == "Abono"){
                            cadena += "<td>" + factura.num_fac + "</td>";
                        }else{
                            cadena += "<td> Factura </td>";
                        }
                        cadena += "<td>" + factura.tip_fac + "</td>";
                        cadena += "<td>" + factura.ced_fac + "</td>";
                        cadena += "<td>" + factura.nom_fac + "</td>";
                        cadena += "<td>" + factura.doc_fac + "</td>";
                        cadena += "<td style='text-align: right'>" + parseFloat(factura.pag_fac).toFixed(2) + "</td>";
                        cadena += "</tr>";
                        switch(factura.tip_fac){
                            case "Efectivo":
                                efe += parseFloat(factura.pag_fac);
                                break;
                            case "Transferencia":
                                tra += parseFloat(factura.pag_fac);
                                break;
                            case "Tarjeta":
                                tar += parseFloat(factura.pag_fac);
                                break;
                        }
                        tot += parseFloat(factura.pag_fac);
                    }
                });
                cadena += "<tr>";
                cadena += "<td colspan=5></td>";
                cadena += "<td> Total efectivo </td>";
                cadena += "<td style='text-align: right'>" + efe.toFixed(2) +" </td>";
                cadena += "</tr>";
                cadena += "<tr>";
                cadena += "<td colspan=5></td>";
                cadena += "<td> Total transferencia </td>";
                cadena += "<td style='text-align: right'>" + tra.toFixed(2) +" </td>";
                cadena += "</tr>";
                cadena += "<tr>";
                cadena += "<td colspan=5></td>";
                cadena += "<td> Total tarjeta </td>";
                cadena += "<td style='text-align: right'>" + tar.toFixed(2) +" </td>";
                cadena += "</tr>";
                cadena += "<tr>";
                cadena += "<td colspan=5></td>";
                cadena += "<th> Total general </th>";
                cadena += "<td style='text-align: right'> <b>" + tot.toFixed(2) +"</b> </td>";
                cadena += "</tr>";
                $("#listado").html(cadena);
            } else {
                var alerta = "<div class='alert alert-danger'>";
                alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> No hay facturas para la fecha seleccionada </strong>";
                alerta += "</div>";
                $(alerta).appendTo("#alerta");
            }
        })
        .catch(function(error) {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Error al obtener las facturas </strong>";
            alerta += "</div>";
            $(alerta).appendTo("#alerta");
        });
    }

    //Obtener el rango semanal
    function obtenerRangoSemana(tipo, hoy) {
        const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        const dia = d.getDay();

        const dif = (tipo == "ACT") ? (dia + 6) % 7 : ((dia + 6) % 7) + 7;
        const lunes = new Date(d);
        lunes.setDate(d.getDate() - dif)

        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate() + 6);

        return { inicio: formatoYMD(lunes), fin: formatoYMD(domingo) };
    }

    //Obtener el rango mensual
    function obtenerRangoMes(tipo, hoy) {
        const y = hoy.getFullYear();
        const m = (tipo == "ACT") ? hoy.getMonth() : hoy.getMonth() - 1;
        const i = new Date(y, m, 1);
        const f = new Date(y, m + 1, 0);
        return { inicio: formatoYMD(i), fin: formatoYMD(f) };
    }

    //Dar formato a la fecha
    function formatoYMD(fecha) {
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
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