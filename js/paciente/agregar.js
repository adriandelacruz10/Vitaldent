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
    $("#btnAgregarPaciente").click(function () {
        var bandera = camposLlenosPaciente();
        if (bandera) {
            var genero = $("input:radio[name=radioGenero]:checked").val();
            insertarPaciente(genero);
            encerarCamposPaciente();
        }
        else {
            var alert = "<div class='alert alert-danger'>";
            alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Por favor llene los campos obligatorios * ! </strong>";
            alert += "</div>";
            $("#alertInsertar").html(alert);
        }
    })

    //METODOS
    //Inserta un paciente
    function insertarPaciente(genero) {
        var referencia = database.ref("Pacientes");
        referencia.push({
            nom_pac: $("#txtNombre").val() + " " + $("#txtApellido").val(),
            ced_pac: $("#txtCedula").val(),
            gen_pac: genero,
            fec_pac: $("#fechaNac").val(),
            tel1_pac: $("#txtTel1").val(),
            tel2_pac: $("#txtTel2").val(),
            dir_pac: $("#txtDireccion").val(),
            obs_pac: $("#txtObservaciones").val(),
            pla_pac: $("#txtPlan").val()
        })
        var alert = "<div class='alert alert-primary'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Paciente insertado con éxito! </strong>";
        alert += "</div>";
        $("#alertInsertar").html(alert);
    }
    //Encerar campos del paciente
    function encerarCamposPaciente() {
        $("#txtNombre").val("");
        $("#txtApellido").val("");
        $("#txtCedula").val("");
        $("#radioHombre").attr("checked", true);
        $("#fechaNac").val("");
        $("#txtTel1").val("");
        $("#txtTel2").val("");
        $("#txtDireccion").val("");
        $("#txtObservaciones").val("");
        $("#txtPlan").val("");
    }
    //Comprobar que los campos esten llenos al agregar el paciente
    function camposLlenosPaciente() {
        var bandera = true;
        var nom = $("#txtNombre").val();
        var ape = $("#txtApellido").val();
        if (nom == "" || ape == "") {
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