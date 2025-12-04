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
    $("#btnAgregarDoctor").click(function () {
        var bandera = camposLlenosDoctor();
        if (bandera) {
            insertarDoctor();
            encerarCamposDoctor();
        }
        else {
            var alert = "<div class='alert alert-danger'>";
            alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Por favor llene los campos obligatorios * ! </strong>";
            alert += "</div>";
            $(alert).appendTo("#alerta");
        }
    })

    //METODOS
    //Carga las especialidades
    function cargarEspecialidades(){
        var referencia = database.ref("Especialidades");
        var especialidades = [];
        referencia.on("value",function(datos){
            especialidades = datos.val();
            $.each(especialidades,function(id, especialidad){
                var cadena = "<option>"+especialidad.nom_esp+"</option>"
                $(cadena).appendTo("#listaEsp");
            })
        })
    }
    //Inserta un paciente
    function insertarDoctor() {
        var referencia = database.ref("Doctores");
        referencia.push({
            nom_doc: $("#txtNombre").val() + " " + $("#txtApellido").val(),
            ced_doc: $("#txtCedula").val(),
            esp_doc: $("#listaEsp").val(),
            tel_doc: $("#txtTel1").val(),
            cor_doc: $("#txtCorreo").val(),
            dir_doc: $("#txtDireccion").val()
        })
        var alert = "<div class='alert alert-primary'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Doctor insertado con éxito! </strong>";
        alert += "</div>";
        $(alert).appendTo("#alerta");
    }
    //Encerar campos del paciente
    function encerarCamposDoctor() {
        $("#txtNombre").val("");
        $("#txtApellido").val("");
        $("#txtCedula").val("");
        $("#txtTel1").val("");
        $("#txtCorreo").val("");
        $("#txtDireccion").val("");
    }
    //Comprobar que los campos esten llenos al agregar el paciente
    function camposLlenosDoctor() {
        var bandera = true;
        var nom = $("#txtNombre").val();
        var ape = $("#txtApellido").val();
        var ced = $("#txtCedula").val();
        var tel1 = $("#txtTel1").val();
        var cor = $("#txtCorreo").val();
        var dir = $("#txtDireccion").val();
        if (nom == "" || ape == "" || ced == "" || tel1 == "" || cor == "" || dir == "") {
            bandera = false;
        }
        return bandera;
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