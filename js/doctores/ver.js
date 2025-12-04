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

    //Llenar el nombre del usuario y salir
    cargarUsuario();
    //Cargar datos
    cargarDoctores();

    //METODOS
    //Lista de pacientes
    function cargarDoctores() {
        $("#listado").empty();
        var i = 1;
        var doctores = [];
        var referencia = database.ref("Doctores");
        referencia.on("value", function (datos) {
            doctores = datos.val();
            $.each(doctores, function (id, doctor) {
                var cadena = "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + doctor.nom_doc + "</td>";
                cadena += "<td>" + doctor.esp_doc + "</td>";
                cadena += "<td>" + doctor.tel_doc + "</td>";
                cadena += "<td>" + doctor.dir_doc + "</td>";
                cadena += "<td> <button type='button' class='btnEditar btn btn-outline-primary btn-sm'" + "id='" + id + "'>" +
                    "Editar </button> ";
                cadena += "</tr>"
                $(cadena).appendTo("#listado");
                i++;
            })

            $(".btnEditar").click(function () {
                var id = this.id;
                localStorage.setItem("idDoctor", id);
                location.assign("../doctores/editar.html");
            })
        });
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