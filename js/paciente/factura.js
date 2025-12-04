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
    //Cargas Iniciales
    cargarInicio();
    //Variables globales
    var listaTratamientos = [];

    //Buscar dentro del select 
    $('.mi-selector').select2();

    //EVENTOS CLICK
    $("#btnCancelar").click(function () {
        location.assign("caja.html");
    })
    $("#btnAgregar").click(function () {
        guardarTratamiento();
    })
    $("#btnLimpiar").click(function () {
        encerarCamposTratamientos();
    })
    $("#btnGuardar").click(function () {
        $("#btnConfirmarF").click(function () {
            guardarFactura();
        });
    })
    //Change del select de tratamientos
    $("#tratamientos").change(function () {
        $("#tratamientos option[value='1']").attr("selected", false);
        var tra = $("#tratamientos").val();
        cargarPrecios(tra);
    })

    //METODOS
    //Cargar valores iniciales de la factura
    function cargarInicio(params) {
        var nom = localStorage.getItem("nombrePaciente");
        var ced = localStorage.getItem("cedulaPaciente");
        var fec = fechaActual();
        $("#txtFecha").val(fec);
        $("#txtNombre").val(nom);
        $("#txtCedula").val(ced);
        cargarDoctores();
        cargarTratamientos();
    }
    //Carga los doctores
    function cargarDoctores() {
        var referencia = database.ref("Doctores");
        var doctores = [];
        referencia.on("value", function (datos) {
            var cadena;
            doctores = datos.val();
            $.each(doctores, function (id, doctor) {
                cadena += "<option>" + doctor.nom_doc + "</option>"
            })
            $("#doctores").html(cadena);
        })
        database.ref();
    }
    //Carga los tratamientos
    function cargarTratamientos() {
        var referencia = database.ref("Tratamientos");
        var tratamientos = [];
        referencia.on("value", function (datos) {
            var cadena = "<option value='1'> Seleccione...</option>";
            tratamientos = datos.val();
            $.each(tratamientos, function (id, tratamiento) {
                cadena += "<option>" + tratamiento.nom_tra + "</option>"
            })
            $("#tratamientos").html(cadena);
        })
        database.ref();
    }
    //Carga los tratamientos
    function cargarPrecios(nomTra) {
        $("#txtCantidad").val(1);
        var referencia = database.ref();
        var tratamientos = [];
        referencia.child("Tratamientos").orderByChild("nom_tra").equalTo(nomTra).on("value", snapshot => {
            if (snapshot.exists()) {
                tratamientos = snapshot.val();
                $.each(tratamientos, function (id, tratamiento) {
                    $("#txtPrecio").val(tratamiento.pre_tra);
                })
            }
        })
        database.ref();
    }
    //Encerar campos de tratamientos
    function encerarCamposTratamientos() {
        $("#txtCantidad").val(0);
        $("#txtPrecio").val(0);
        $("#txtPieza").val("");
        $("#estado").prop("checked", false);
        $("#tratamientos option[value='1']").attr("selected", true);
    }

    //Guarda el tratamiento en una lista 
    function guardarTratamiento() {
        var nom = $("#tratamientos").val();
        var can = $("#txtCantidad").val();
        var pre = $("#txtPrecio").val();
        var pie = $("#txtPieza").val();
        var est = "NO";
        if ($("#estado").is(":checked")) {
            est = "SI";
        };
        if (nom == 1) {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Primero seleccione un tratamiento! </strong>";
            alerta += "</div>";
            $("#alerta").html(alerta);
        } else {
            var tot = can * pre;
            var tratamiento = { nombre: nom, cantidad: can, precio: pre, total: tot, pieza: pie, estado: est };
            listaTratamientos.push(tratamiento);
            llenarTablaTratamientos();
        }
    }
    //Llena la tabla de tratamientos
    function llenarTablaTratamientos() {
        $("#listado").empty();
        var cadena;
        var total = 0;
        var i = 0;
        listaTratamientos.forEach(tratamiento => {
            cadena += "<tr>";
            cadena += "<td>" + tratamiento.cantidad + "</td>";
            cadena += "<td>" + tratamiento.nombre + "</td>";
            cadena += "<td>" + tratamiento.pieza + "</td>";
            cadena += "<td>" + tratamiento.estado + "</td>";
            cadena += "<td>" + tratamiento.precio + "</td>";
            cadena += "<td>" + tratamiento.total + "</td>";
            cadena += "<td> <button class='btnEliminar btn btn-outline-danger btn-sm' id='" + i + "'> " +
                "Eliminar</button>  </td>";
            cadena += "</tr>";
            total += tratamiento.total;
            i++;
        });
        $("#listado").html(cadena);
        $("#totalFactura").val(total);
        //Metodos CLIC
        $(".btnEliminar").click(function () {
            var i = this.id;
            listaTratamientos.splice(i, 1);
            llenarTablaTratamientos();

        })

        encerarCamposTratamientos();
    }
    //Guarda la factura  en la base de datos
    function guardarFactura() {
        //obtener el id de la factura
        var id = new Date();
        id = id.getTime();
        var cod = "F" + id;
        //Insertar la factura
        var referencia = database.ref("Facturas");
        referencia.push({
            cod_fac: cod,
            num_fac: $("#txtFactura").val(),
            fec_fac: $("#txtFecha").val(),
            tip_fac: $("#tipos").val(),
            nom_fac: $("#txtNombre").val(),
            ced_fac: $("#txtCedula").val(),
            doc_fac: $("#doctores").val(),
            tot_fac: $("#totalFactura").val(),
            pag_fac: $("#pagadoFactura").val()
        })
        database.ref();
        referencia.off();
        location.assign("caja.html");
        //Insertar los detalles de la factura
        insertarDetalles(cod);

    }

    function insertarDetalles(cod) {
        var referencia = database.ref("Detalle_Facturas");
        listaTratamientos.forEach(tratamiento => {
            var can = tratamiento.cantidad;
            var tra = tratamiento.nombre;
            var est = tratamiento.estado;
            var pie = tratamiento.pieza;
            var pre = tratamiento.precio;
            var tot = tratamiento.total;
            referencia.push({
                cod_det: cod,
                can_det: can,
                tra_det: tra,
                est_det: est,
                pie_det: pie,
                pre_det: pre,
                tot_det: tot
            })
        });
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
