$(document).ready(function () {
    const firebaseConfig = {
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

    //Eventos click
    $("#btnLogin").click(function () {
        ingresar();
        eliminarCitas();
    })

    //Metodos
    //Ingresa a la pagina de inicio
    function ingresar() {
        var referencia = database.ref();
        var login = $("#txtUsuario").val();
        var con = $("#txtContrasena").val();
        var usuarios = {};
        referencia.child("Usuarios").orderByChild("usu").equalTo(login).on("value", snapshot => {
            if (snapshot.exists()) {
                usuarios = snapshot.val();
                $.each(usuarios, function (indice, val) {
                    if (con == val.con) {
                        localStorage.setItem("nomUsuario", val.nom);
                        location.assign("pacientes/inicio.html");
                        
                        $("#txtUsuario").val("");
                    }
                    else {
                        alert("Contraseña incorrecta");
                        $("#txtContrasena").val("");
                    }
                });
            }
            else {
                alert("El usuario no existe");
                $("#txtUsuario").val("");
                $("#txtContrasena").val("");
            }
        })
    }
    //Elimina las citas agendadas que sean menos que hoy
    function eliminarCitas() {
        var actual = fechaActual();
        var fecha = new Date(actual);
        var referencia = database.ref("Agendadas");
        var citas = [];
        referencia.on("value", function (datos) {
            citas = datos.val();
            $.each(citas, function (id, cita) {
                var fechaCita = new Date(cita.fec_age);
                if (fechaCita < fecha) {
                    var eliminar = database.ref("Agendadas");
                    eliminar.child(id).remove();
                }
            })
        })
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
})
