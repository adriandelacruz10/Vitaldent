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
    //Boton para mostrar todos los pacientes
    $("#btnTodos").click(function () {
        cargarPacientes();
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
        var referencia = database.ref("Pacientes").orderByChild('nom_pac');
        referencia.on("value", function (datos) {
            datos.forEach(function(snap){
                var paciente = new Object();
                var valor = snap.val();
                paciente.id = snap.key;
                paciente.fecha = valor.fec_pac;
                paciente.cedula = valor.ced_pac;
                paciente.nombre = valor.nom_pac;
                paciente.direccion = valor.dir_pac;
                paciente.telefono = valor.tel1_pac;
                paciente.observacion = valor.obs_pac;
                paciente.plan = valor.pla_pac;
                pacientes.push(paciente);
            });
        });
    }
    
    //Cargar todos los pacientes
    function cargarPacientes() {
        $("#listado").empty();
        var i = 1;

        pacientes.forEach(valor => {
            var cadena = "<tr>";
            cadena += "<th>" + i + "</th>";
            cadena += "<td>" + valor.nombre + "</td>";
            var edad = calcularEdad(valor.fecha);
            cadena += "<td>" + edad + "</td>";
            cadena += "<td>" + valor.telefono + "</td>";
            cadena += "<td>" + valor.plan + "</td>";
            cadena += "<td>" + valor.observacion + "</td>";
            cadena += "<td> <button type='button' class='btnVer btn btn-outline-primary btn-sm'" + "id='" + valor.id + "'>" +
                "Ver </button> ";
            /*cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + valor.cedula + "*" + valor.nombre + "*" + valor.telefono + "'>" +
                "Citas </button> ";*/
            cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + valor.cedula + "*" + valor.nombre + "'>" +
                "Caja </button> ";
            cadena += "<button type='button' class='btnEliminar btn btn-outline-danger btn-sm'" + "id='" + valor.id + "'>" +
                "Eliminar </button></td>";
            cadena += "</tr>"
            $(cadena).appendTo("#listado");
            i++;
        });

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
        $(".btnEliminar").click(function () {
            var id = this.id;
            if(confirm('¿Esta seguro de eliminar al paciente seleccionado') == true){
                eliminarPaciente(id).then(() =>{
                    pacientes = pacientes.filter(p => p.id !== id);
                    cargarPacientes();
                });
            }
        })
    }

    //Buscar paciente por tratamiento
    function buscarPacienteTratamiento() {
        $("#listado").empty();
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
                /*cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "*" + paciente.telefono + "'>" +
                    "Citas </button> ";*/
                cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "'>" +
                    "Caja </button> ";
                cadena += "<button type='button' class='btnOdontograma btn btn-outline-info btn-sm'" + "id='" + paciente.id + "*" + paciente.nombre + "'>" +
                    "Odo. </button> ";
                cadena += "<button type='button' class='btnEliminar btn btn-outline-danger btn-sm'" + "id='" + paciente.id + "'>" +
                    "Elim. </button></td>";
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
            });
            $(".btnOdontograma").click(function () {
                var datos = this.id.split("*");
                localStorage.setItem("idPaciente", datos[0]);
                localStorage.setItem("nombrePaciente", datos[1]);
                location.assign("odontograma.html");
            });
            $(".btnEliminar").click(function () {
                var id = this.id;
                if(confirm('¿Esta seguro de eliminar al paciente seleccionado') == true){
                    eliminarPaciente(id).then(() => {
                        pacientes = pacientes.filter(p => p.id !== id);
                        buscarPacienteTratamiento();
                    });
                }
            });
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
        $("#listado").empty();
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
                /*cadena += "<button type='button' class='btnCitas btn btn-outline-dark btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "*" + paciente.telefono + "'>" +
                    "Citas </button> ";*/
                cadena += "<button type='button' class='btnCaja btn btn-outline-success btn-sm'" + "id='" + paciente.cedula + "*" + paciente.nombre + "'>" +
                    "Caja </button> ";
                cadena += "<button type='button' class='btnOdontograma btn btn-outline-info btn-sm'" + "id='" + paciente.id + "*" + paciente.nombre + "'>" +
                    "Odo. </button> ";
                cadena += "<button type='button' class='btnEliminar btn btn-outline-danger btn-sm'" + "id='" + paciente.id + "'>" +
                    "Eli. </button></td>";
                cadena += "</tr>";
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
            });
            $(".btnEliminar").click(function () {
                var id = this.id;
                if(confirm('¿Esta seguro de eliminar al paciente seleccionado') == true){
                    eliminarPaciente(id).then(() => {
                        pacientes = pacientes.filter(p => p.id !== id);
                        buscarPacienteNombre();
                    });
                }
            });
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

    //Eliminar el paciente por el id
    function eliminarPaciente(id){
        var referencia = database.ref('Pacientes');
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