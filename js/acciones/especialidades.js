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
    cargarEspecialidades();

    //EVENTOS CLICK
    $("#btnAgregar").click(function () {
        mostrarCampos();
    })

    //METODOS
    //Muestra los campos
    function mostrarCampos() {
        var cadena = "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label for='nombreE' class='col-sm-2 col-form-label'>Nombre de la especialidad:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text' class='form-control' id='nombreE'>";
        cadena += "</div>";
        cadena += "<div class='col-sm-4'>";
        cadena += "<button type='button' id='btnGuardar' class='btn btn-outline-success'>";
        cadena += "Guardar</button> ";
        cadena += "<button type='button' id='btnCancelar' class='btn btn-outline-danger'>";
        cadena += "Cancelar</button>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "</form>";
        $(cadena).appendTo("#insertar");
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
    //Inserta la especialidad en la base de datos
    function insertarEspecialidad() {
        var referencia = database.ref("Especialidades");
        referencia.push({
            nom_esp: $("#nombreE").val()
        })
        var alert = "<div class='alert alert-primary'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Especialidad insertada con éxito! </strong>";
        alert += "</div>";
        $(alert).appendTo("#alerta");
        $("#btnAgregar").attr("disabled", false);
    }
    //Comprobar que los campos esten llenos al agregar la especialidad
    function camposLlenosEspecialidad() {
        var esp = $("#nombreE").val();
        if (esp == "") {
            var alert = "<div class='alert alert-danger'>";
            alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Por favor llene el nombre de la especialidad! </strong>";
            alert += "</div>";
            $(alert).appendTo("#alerta");
        } else {
            insertarEspecialidad();
            $("#insertar").html("");
            cargarEspecialidades();
        }
    }
    //Carga las especialidades
    function cargarEspecialidades() {
        $("#listado").empty();
        var referencia = database.ref("Especialidades");
        var i = 1;
        var especialidades = [];
        referencia.on("value", function (datos) {
            especialidades = datos.val();
            $.each(especialidades, function (indice, especialidad) {
                var cadena = "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + especialidad.nom_esp + "</td>";
                cadena += "<td><button type='button' class='btnEliminar btn btn-outline-danger btn-sm' id='" + indice + "*" + especialidad.nom_esp + "'>";
                cadena += "Eliminar</button></td>"
                cadena += "</tr>";
                $(cadena).appendTo("#listado");
                i++;
            })
            $(".btnEliminar").click(function () {
                var datos = this.id.split("*");
                if (confirm("¿Está seguro que desea eliminar la especialidad " + datos[1] + "?") == true) {
                    eliminarEspecialidad(datos[0]);
                }
            })
        })
    }
    //Eliminar especialidad
    function eliminarEspecialidad(id) {
        var referencia = database.ref('Especialidades');
        referencia.child(id).remove();
        cargarEspecialidades();
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