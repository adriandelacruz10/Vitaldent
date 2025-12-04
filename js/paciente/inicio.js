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
    cargarListaPacientes();
    //VARIABLES GLOBALES
    //Lista de pacientes
    var pacientes = [];

    //EVENTOS CLICK
    //Boton buscar por cedula
    $("#btnBuscar").click(function () {
        buscarPacienteTratamiento();
    });
    //Boton buscar por nombre
    $("#btnBuscarNombre").click(function () {
        buscarPacienteNombre();
    });
    //Boton borrar el filtro
    $("#btnBorrar").click(function () {
        //pacientes = [];
        $("#listado").empty();
        var mensaje = "<td colspan='7' align='center'>Bienvenidos al sistema odontológico para la gestión de pacientes." +
            "<br><b>VITALDENT TU SONRISA, TU IMAGEN</b></td>";
        $("#listado").html(mensaje);
        $("#txtBuscarTratamiento").val("");
        $("#txtNombre").val("");
    });
    //Boton para mostrar morosos
    $("#btnMorosos").click(function () {
        window.open("morosos.html");
    })

    //FOCUS
    //Dar focus al input nombre
    $("#txtNombre").focus(function () {
        $("#alerta").html("");
    })
    //Dar focus al input tratamiento
    $("#txtBuscarTratamiento").focus(function () {
        $("#alerta").html("");
    })

    //METODOS
    function cargarListaPacientes() {
        $("#listado").empty();
        var mensaje = "<td colspan='7' align='center'>Bienvenidos al sistema odontológico para la gestión de pacientes." +
            "<br><b>VITALDENT TU SONRISA, TU IMAGEN</b></td>";
        $("#listado").html(mensaje);
        //var i = 1;
        var pacientesData = [];
        var referencia = database.ref("Pacientes");
        referencia.on("value", function (datos) {
            pacientesData = datos.val();
            $.each(pacientesData, function (indice, valor) {
                var paciente = new Object();
                paciente.id = indice;
                paciente.fecha = valor.fec_pac;
                paciente.cedula = valor.ced_pac;
                paciente.nombre = valor.nom_pac;
                paciente.direccion = valor.dir_pac;
                paciente.telefono = valor.tel1_pac;
                paciente.observacion = valor.obs_pac;
                paciente.plan = valor.pla_pac;
                //paciente.num = i;
                pacientes.push(paciente);
                //i++;
            })
        });
    }
    //Cargar todos los pacientes
    function cargarPacientes() {
        $("#listado").empty();
        var i = 1;
        var pacientesData = [];
        var referencia = database.ref("Pacientes");
        referencia.on("value", function (datos) {
            pacientesData = datos.val();
            $.each(pacientesData, function (indice, valor) {
                var cadena = "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + valor.nom_pac + "</td>";
                var edad = calcularEdad(valor.fec_pac);
                cadena += "<td>" + edad + "</td>";
                cadena += "<td>" + valor.tel1_pac + "</td>";
                cadena += "<td>" + valor.pla_pac + "</td>";
                cadena += "<td>" + valor.obs_pac + "</td>";
                cadena += "<td> <button type='button' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + indice + "'>" +
                    "Ver </button> ";
                cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + valor.ced_pac + "*" + valor.nom_pac + "*" + valor.tel1_pac + "'>" +
                    "Citas </button> ";
                cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + valor.ced_pac + "*" + valor.nom_pac + "'>" +
                    "Caja </button></td>";
                cadena += "</tr>"
                $(cadena).appendTo("#listado");
                var paciente = new Object();
                paciente.id = indice;
                paciente.fecha = valor.fec_pac;
                paciente.cedula = valor.ced_pac;
                paciente.nombre = valor.nom_pac;
                paciente.direccion = valor.dir_pac;
                paciente.telefono = valor.tel1_pac;
                paciente.observacion = valor.obs_pac;
                paciente.plan = valor.pla_pac;
                paciente.num = i;
                pacientes.push(paciente);
                i++;
            })

            //Botones
            $(".btnVer").click(function () {
                var id = this.id;
                localStorage.setItem("idPaciente", id);
                location.assign("informacion.html");
            })
            $(".btnCitas").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                localStorage.setItem("telefonoPaciente", datos[2]);
                location.assign("citas.html");
            })
            $(".btnCaja").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("caja.html");
            })
        });
    }
    //Buscar paciente por numero de cedula
    function buscarPaciente() {
        var cedula = $("#txtNumeroCedula").val();
        var paciente = pacientes.find(paciente => paciente.cedula === cedula);
        if (paciente == null) {
            alert("El paciente no existe.");
            $("#txtNumeroCedula").val("");
            $("#txtNombre").val("");
        } else {
            $("#listado").empty();
            var cadena = "<tr>";
            cadena += "<th>" + paciente.num + "</th>";
            cadena += "<td>" + paciente.nombre + "</td>";
            var edad = calcularEdad(paciente.fecha);
            cadena += "<td>" + edad + "</td>";
            cadena += "<td>" + paciente.telefono + "</td>";
            cadena += "<td>" + paciente.plan + "</td>";
            cadena += "<td>" + paciente.observacion + "</td>";
            cadena += "<td> <button type='button' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + paciente.id + "'>" +
                "Ver </button> ";
            cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "*" + paciente.telefono + "'>" +
                "Citas </button> ";
            cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "'>" +
                "Caja </button></td>";
            cadena += "</tr>"
            $(cadena).appendTo("#listado");

            //Botones
            $(".btnVer").click(function () {
                var id = this.id;
                localStorage.setItem("idPaciente", id);
                location.assign("informacion.html");
            })
            $(".btnCitas").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                localStorage.setItem("telefonoPaciente", datos[2]);
                location.assign("citas.html");
            })
            $(".btnCaja").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("caja.html");
            })
        }
    }

    function buscarPacienteTratamiento() {
        var tra = $("#txtBuscarTratamiento").val();
        var tras = tra.split(" ");
        var aux = false;
        var cadena;
        var i = 1;
        //Busca en todos los pacientes
        pacientes.forEach(paciente => {
            var bandera = false;
            //Busca todo del nombre del input
            tras.forEach(busqueda => {
                bandera = false;
                //Nombre del paciente de la lista
                busqueda = busqueda.toUpperCase();
                var traPac = paciente.plan.split(" ");
                traPac.forEach(pac => {
                    pac = pac.toUpperCase();
                    if (busqueda == pac) {
                        bandera = true;
                    }
                });
            });
            if (bandera) {
                cadena += "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + paciente.nombre + "</td>";
                var edad = calcularEdad(paciente.fecha);
                cadena += "<td>" + edad + "</td>";
                cadena += "<td>" + paciente.telefono + "</td>";
                cadena += "<td>" + paciente.plan + "</td>";
                cadena += "<td>" + paciente.observacion + "</td>";
                cadena += "<td> <button type='button' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + paciente.id + "'>" +
                    "Ver </button> ";
                cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "*" + paciente.telefono + "'>" +
                    "Citas </button> ";
                cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "'>" +
                    "Caja </button></td>";
                cadena += "</tr>"
                aux = true;
                i++;
            }
        });

        if (aux) {
            $("#listado").html(cadena);
            //Botones
            $(".btnVer").click(function () {
                var id = this.id;
                localStorage.setItem("idPaciente", id);
                location.assign("informacion.html");
            })
            $(".btnCitas").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                localStorage.setItem("telefonoPaciente", datos[2]);
                location.assign("citas.html");
            })
            $(".btnCaja").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("caja.html");
            })
        } else {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Tratamiento no encontrado! Revise la información e inténtelo de nuevo.</strong>";
            alerta += "</div>";
            $("#alerta").html(alerta);
            $("#txtBuscarTratamiento").val("");
            $("#txtNombre").val("");
        }
    }

    //Buscar paciente por nombre
    function buscarPacienteNombre() {
        var nombre = $("#txtNombre").val();
        var nombres = nombre.split(" ");
        var aux = false;
        var cadena;
        var i = 1;
        //Busca en todos los pacientes
        pacientes.forEach(paciente => {
            var bandera = false;
            //Busca todo del nombre del input
            nombres.forEach(busqueda => {
                bandera = false;
                //Nombre del paciente de la lista
                busqueda = busqueda.toUpperCase();
                var nombresPac = paciente.nombre.split(" ");
                nombresPac.forEach(pac => {
                    pac = pac.toUpperCase();
                    if (busqueda == pac) {
                        bandera = true;
                    }
                });
            });
            if (bandera) {
                cadena += "<tr>";
                cadena += "<th>" + i + "</th>";
                cadena += "<td>" + paciente.nombre + "</td>";
                var edad = calcularEdad(paciente.fecha);
                cadena += "<td>" + edad + "</td>";
                cadena += "<td>" + paciente.telefono + "</td>";
                cadena += "<td>" + paciente.plan + "</td>";
                cadena += "<td>" + paciente.observacion + "</td>";
                cadena += "<td> <button type='button' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + paciente.id + "'>" +
                    "Ver </button> ";
                cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "*" + paciente.telefono + "'>" +
                    "Citas </button> ";
                cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "'>" +
                    "Caja </button> ";
                cadena += "<button type='button' class='btnOdontograma btn btn-outline-info btn-sm'" + "id='" + paciente.id + "*" + paciente.nombre + "'>" +
                    "Odo. </button></td>";
                cadena += "</tr>"
                aux = true;
                i++;
            }
        });

        if (aux) {
            $("#listado").html(cadena);
            //Botones
            $(".btnVer").click(function () {
                var id = this.id;
                localStorage.setItem("idPaciente", id);
                location.assign("informacion.html");
            })
            $(".btnCitas").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                localStorage.setItem("telefonoPaciente", datos[2]);
                location.assign("citas.html");
            })
            $(".btnCaja").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("cedulaPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("caja.html");
            })
            $(".btnOdontograma").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("idPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("odontograma.html");
            })
        } else {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Paciente no encontrado! Revise la información e inténtelo de nuevo. </strong>";
            alerta += "</div>";
            $("#alerta").html(alerta);
            $("#txtNumeroCedula").val("");
            $("#txtNombre").val("");
        }
    }

    //Calcula la edad
    function calcularEdad(edad) {
        var d = new Date();
        var actual = fechaActual(d);
        var actuales = actual.split("-");
        var nacimiento = edad.split("-");
        //console.log(actuales[1]);
        var edadA = actuales[0] - nacimiento[0];
        if (actuales[1] < nacimiento[1]) {
            if (actuales[2] < nacimiento[2]) {
                edadA = edadA - 1;
            }
        }
        return edadA;
    }

    //Obtiene y devuelve la fecha actual
    function fechaActual(d) {
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

/*class Paciente {
    constructor(nombre, cedula, genero, fecha, tel1, tel2, correo, direccion, obs) {
        this.nombre = nombre;
        this.cedula = cedula;
        this.genero = genero;
        this.fecha = fecha;
        this.tel1 = tel1;
        this.tel2 = tel2;
        this.correo = correo;
        this.direccion = direccion;
        this.obs = obs;
    }
}*/