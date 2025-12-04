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
    cargarTratamientos();

    //EVENTOS CLICK
    $("#btnAgregar").click(function () {
        mostrarCampos();
    })

    //METODOS
    //Muestra los campos
    function mostrarCampos() {
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Nombre:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text' class='form-control' id='tratamiento'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Precio($):</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='number'class='form-control' id='precio'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10'>"
        cadena += "<button type='button' class='btn btn-outline-success' id='btnGuardar'>Guardar</button> ";
        cadena += "<button type='button' class='btn btn-outline-danger' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#insertar").html(cadena);
        $("#btnAgregar").attr("disabled", true);
        //Click del boton
        $("#btnGuardar").click(function () {
            camposLlenosEspecialidad();
        })
        $("#btnCancelar").click(function () {
            $("#btnAgregar").attr("disabled", false);
            $("#insertar").html("");
        })
    }
    //Muestra los campos para editar
    function mostrarCamposEditar(id, nombre, precio) {
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Nombre:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text' class='form-control' id='tratamiento' value='" + nombre + "' disabled>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Precio($):</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='number'class='form-control' id='precio' value='" + precio + "'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10'>"
        cadena += "<button type='button' class='btn btn-outline-success' id='btnGuardar'>Guardar</button> ";
        cadena += "<button type='button' class='btn btn-outline-danger' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#insertar").html(cadena);
        //Click del boton
        $("#btnGuardar").click(function () {
            editarEspecialidad(id);
        })
        $("#btnCancelar").click(function () {
            $("#btnAgregar").attr("disabled", false);
            $("#insertar").html("");
        })
    }
    //Inserta el tratamiento en la base de datos
    function insertarTratamiento() {
        var referencia = database.ref("Tratamientos");
        referencia.push({
            nom_tra: $("#tratamiento").val(),
            pre_tra: $("#precio").val()
        })
        var alert = "<div class='alert alert-primary'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Tratamiento insertado con éxito! </strong>";
        alert += "</div>";
        $(alert).appendTo("#alerta");
        $("#btnAgregar").attr("disabled", false);
    }
    //Edita el tratamiento
    function editarEspecialidad(id) {
        var referencia = database.ref("Tratamientos");
        referencia.child(id).update({
            pre_tra: $("#precio").val()
        })
        $("#insertar").html("");
    }
    //Comprobar que los campos esten llenos al el tratamiento
    function camposLlenosEspecialidad() {
        var pre = $("#precio").val();
        var esp = $("#tratamiento").val();
        if (esp == "" || pre == "") {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Por favor llene los campos requeridos! </strong>";
            alerta += "</div>";
            $(alerta).appendTo("#alerta");
        } else {
            insertarTratamiento();
            $("#insertar").html("");
        }
    }
    //Carga las especialidades
    function cargarTratamientos() {
        //$("#listado").empty();
        var referencia = database.ref("Tratamientos");

        var tratamientos = [];
        referencia.on("value", function (datos) {
            var i = 1;
            tratamientos = datos.val();
            var cadena;
            $.each(tratamientos, function (id, tra) {
                cadena += "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + tra.nom_tra + "</td>";
                cadena += "<td>" + tra.pre_tra + "</td>";
                cadena += "<td><button type='button' class='btnEditar btn btn-outline-success btn-sm' id='" + id + "*" + tra.nom_tra + "*" + tra.pre_tra + "'>";
                cadena += "Editar</button> "
                cadena += "<button type='button' class='btnEliminar btn btn-outline-danger btn-sm' id='" + id + "*" + tra.nom_tra + "'>";
                cadena += "Eliminar</button></td>"
                cadena += "</tr>";
                i++;
            })
            $("#listado").html(cadena);
            //Eventos click
            $(".btnEditar").click(function () {
                var datos = this.id.split("*");
                mostrarCamposEditar(datos[0], datos[1], datos[2]);
            })
            $(".btnEliminar").click(function () {
                var datos = this.id.split("*");
                if (confirm("¿Está seguro que desea eliminar el tratamiento " + datos[1] + "?") == true) {
                    eliminarTratamiento(datos[0]);
                }
            })
        })

    }
    //Eliminar especialidad
    function eliminarTratamiento(id) {
        var referencia = database.ref('Tratamientos');
        referencia.child(id).remove();
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