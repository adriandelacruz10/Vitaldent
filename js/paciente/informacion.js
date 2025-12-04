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
    //Llena la informacion del usuario
    var id = localStorage.getItem("idPaciente");
    cargarPaciente(id);

    //EVENTOS CLICK
    //Habilita inputs para editar
    $("#btnEditar").click(function () {
        habilitarControles();
    })
    //Guarda los cambios en la base de datos
    $("#btnGuardar").click(function () {
        editarPaciente(id);
        deshabilitarControles();
        alerta();
    })
    //Abre la pagina de historia clinica
    $("#btnHistoria").click(function () {
        location.assign("historia.html");
    })
    $("#btnCita").click(function () {
        location.assign("citas.html");
    })
    $("#btnCaja").click(function () {
        location.assign("caja.html");
    })
    $("#btnOdontograma").click(function () {
        location.assign("odontograma.html");
    })

    //METODOS
    //Carga la informacion del paciente en el form
    function cargarPaciente(id) {
        var referencia = database.ref("Pacientes");
        var paciente = [];
        referencia.child(id).once("value", function (datos) {
            paciente = datos.val();
            $("#txtNombre").val(paciente.nom_pac);
            $("#txtCedula").val(paciente.ced_pac);
            localStorage.setItem("cedulaPaciente", paciente.ced_pac);
            localStorage.setItem("nombrePaciente", paciente.nom_pac);
            $("#txtGenero").val(paciente.gen_pac);
            $("#fechaNac").val(paciente.fec_pac);
            $("#txtTel1").val(paciente.tel1_pac);
            $("#txtTel2").val(paciente.tel2_pac);
            $("#txtDireccion").val(paciente.dir_pac);
            $("#txtObservaciones").val(paciente.obs_pac);
            $("#txtPlan").val(paciente.pla_pac);
        })
    }
    //Habilita inputs para editar
    function habilitarControles() {
        $("#btnEditar").attr("disabled", true);
        $("#btnGuardar").attr("disabled", false);
        $("#txtNombre").attr("disabled", false);
        $("#txtCedula").attr("disabled", false);
        $("#fechaNac").attr("disabled", false);
        $("#txtTel1").attr("disabled", false);
        $("#txtTel2").attr("disabled", false);
        $("#txtDireccion").attr("disabled", false);
        $("#txtObservaciones").attr("disabled", false);
        $("#txtPlan").attr("disabled", false);
    }
    //Edita el paciente
    function editarPaciente(idPac) {
        if(localStorage.getItem("nombrePaciente") !== $("#txtNombre").val()){
            var referencia = database.ref("Pacientes");
            referencia.child(idPac).update({
                nom_pac: $("#txtNombre").val(),
                ced_pac: $("#txtCedula").val(),
                fec_pac: $("#fechaNac").val(),
                tel1_pac: $("#txtTel1").val(),
                tel2_pac: $("#txtTel2").val(),
                dir_pac: $("#txtDireccion").val(),
                obs_pac: $("#txtObservaciones").val(),
                pla_pac: $("#txtPlan").val()
            })

            var referenciaFac = database.ref("Facturas");
            referenciaFac.orderByChild("nom_fac").equalTo(localStorage.getItem("nombrePaciente"))
            .once("value")
            .then(function(snapshotFac) {
                snapshotFac.forEach(function(child) {
                    child.ref.update({
                        nom_fac: $("#txtNombre").val()
                    });
                });
            });

            localStorage.setItem("nombrePaciente", $("#txtNombre").val());
        }else{
            var referencia = database.ref("Pacientes");
            referencia.child(idPac).update({
                ced_pac: $("#txtCedula").val(),
                fec_pac: $("#fechaNac").val(),
                tel1_pac: $("#txtTel1").val(),
                tel2_pac: $("#txtTel2").val(),
                dir_pac: $("#txtDireccion").val(),
                obs_pac: $("#txtObservaciones").val(),
                pla_pac: $("#txtPlan").val()
            })
        }
    }
    //Deshbilita inputs despues de editar
    function deshabilitarControles() {
        $("#btnEditar").attr("disabled", false);
        $("#btnGuardar").attr("disabled", true);
        $("#txtNombre").attr("disabled", true);
        $("#txtCedula").attr("disabled", true);
        $("#fechaNac").attr("disabled", true);
        $("#txtTel1").attr("disabled", true);
        $("#txtTel2").attr("disabled", true);
        $("#txtDireccion").attr("disabled", true);
        $("#txtObservaciones").attr("disabled", true);
        $("#txtPlan").attr("disabled", true);
    }
    //Alerta sobre la operacion
    function alerta() {
        var alert = "<div class='alert alert-primary'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Datos actualizados con éxito! </strong>";
        alert += "</div>";
        $(alert).appendTo("#alerta");
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