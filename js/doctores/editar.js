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
    var id = localStorage.getItem("idDoctor");
    cargarDoctor(id);

    //EVENTOS CLICK
    $("#btnGuardar").click(function () {
        editarDoctor(id);
    })
    $("#btnCancelar").click(function () {
        location.assign("../doctores/listado.html");
    })

    //METODOS
    //Carga las especialidades
    function cargarEspecialidades() {
        var referencia = database.ref("Especialidades");
        var especialidades = [];
        referencia.on("value", function (datos) {
            especialidades = datos.val();
            $.each(especialidades, function (idEsp, especialidad) {
                var cadena = "<option value='" + especialidad.nom_esp + "'>" + especialidad.nom_esp + "</option>"
                $(cadena).appendTo("#listaEsp");
            })
        })
    }
    //Carga la informacion del doctor
    function cargarDoctor(id) {
        var referencia = database.ref("Doctores");
        var doctor = [];
        referencia.child(id).once("value", function (datos) {
            doctor = datos.val();
            $("#txtNombre").val(doctor.nom_doc);
            $("#txtCedula").val(doctor.ced_doc);
            $("#listaEsp option[value='" + doctor.esp_doc + "']").attr("selected", true);
            $("#txtTel").val(doctor.tel_doc);
            $("#txtCorreo").val(doctor.cor_doc);
            $("#txtDireccion").val(doctor.dir_doc);

        })
    }
    //Inserta un paciente
    function editarDoctor(id) {
        var referencia = database.ref("Doctores");
        referencia.child(id).update({
            esp_doc: $("#listaEsp").val(),
            tel_doc: $("#txtTel").val(),
            cor_doc: $("#txtCorreo").val(),
            dir_doc: $("#txtDireccion").val()
        })
        location.assign("../doctores/listado.html");
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