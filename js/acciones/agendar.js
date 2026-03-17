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
    var horarios = [
        "8:00", "8:30",
        "9:00", "9:30",
        "10:00", "10:30",
        "11:00", "11:30",
        "12:00", "12:30",
        "15:00", "15:30",
        "16:00", "16:30",
        "17:00", "17:30",
        "18:00", "18:30",
        "19:00", "19:30",
        "20:00", "20:30",
        "21:00"
    ];
    var pacientesIndex = {};
    //Llenar el nombre del usuario
    cargarUsuario();
    //Cargar iniciales
    cargarCalendario();
    cargarCitas();

    //Comentarios
    /*Si el telefono es necesario guardo en una lista con el nombre y el telefono*/

    //EVENTOS CLICk
    //Mostrar elementos para un cita
    $(document).on("click", ".btnAgendar", function () {
        var id = this.id;
        hora = id.replace("_", ":");

        var cadena = "";
        cadena += "<h5 style='font-weight:700; color:#1f2937; margin-bottom:18px;'>Selecciona el tipo de cita</h5>";
        cadena += "<form>";
        cadena += "<button type='button' class='btn btn-outline-dark mr-2' id='btnNuevo'>Nuevo paciente</button>";
        cadena += "<button type='button' class='btn btn-outline-primary' id='btnExiste'>Paciente existente</button>";
        cadena += "</form>";

        $("#agendar").html(cadena);
        $("#datosCita").html("");
        location.assign("#usuario");

        $("#btnNuevo").click(function () {
            mostrarElementosNuevo(hora);
            $('#btnNuevo').attr('disabled', true);
            $('#btnExiste').attr('disabled', false);
        });

        $("#btnExiste").click(function () {
            mostrarElementosExiste(hora);
            $('#btnExiste').attr('disabled', true);
            $('#btnNuevo').attr('disabled', false);
        });
    });
    //Eliminar cita
    $(document).on("click", ".btnEliminarCita", function () {
        var id = $(this).data("id");
        if (confirm("¿Está seguro que desea eliminar esta cita?") === true) {
            eliminarCitaPorId(id);
        }
    });
    //Ir a las citas pendientes
    $("#btnPendientes").click(function () {
        location.assign("citas.html");
    })
    //Eliminar a las citas terminadas
    $("#btnTerminadas").click(function () {
        location.assign("citasAnteriores.html");
    })
    //Cambiar el calendario
    $("#fecha").change(function () {
        $("#agendar").html("");
        $("#datosCita").html("");
        cargarCitas();
    });

    //METODOS
    function horaAId(hora) {
        return hora.replace(":", "_");
    }
    //Generar la tabla de citas
    function renderTablaCitas(citasAgrupadas) {
        var html = "";

        $.each(horarios, function (_, hora) {
            var idHora = horaAId(hora);
            var citasHora = citasAgrupadas[hora] || [];

            html += "<tr>";
            html += "<th class='agenda-hour'>" + hora + "</th>";
            html += "<td>";
            html += "<div class='slot-list'>";

            if (citasHora.length === 0) {
                html += "<div class='slot-card empty'>Sin citas agendadas</div>";
            } else {
                $.each(citasHora, function (_, cita) {
                    html += "<div class='slot-card'>";
                    html += "<div class='slot-name'>" + (cita.nom_age || "") + "</div>";
                    html += "<div class='slot-meta'><strong>Tel:</strong> " + (cita.tel_age || "") + "</div>";
                    html += "<div class='slot-obs'><strong>Obs:</strong> " + (cita.obs_age || "") + "</div>";
                    html += "<div class='slot-actions'>";
                    html += "<button type='button' class='btn btn-agenda-danger btn-sm btnEliminarCita' data-id='" + cita.id + "'>Eliminar</button>";
                    html += "</div>";
                    html += "</div>";
                });
            }

            html += "</div>";
            html += "</td>";

            html += "<td>";
            html += "<div class='agenda-add-wrap'>";
            if (citasHora.length < 2) {
                html += "<button type='button' class='btnAgendar btn btn-agenda-primary btn-sm' id='" + idHora + "'>Agendar</button>";
            } else {
                html += "<button type='button' class='btn btn-secondary btn-sm' disabled>Cupo lleno</button>";
            }
            html += "</div>";
            html += "</td>";
            html += "</tr>";
        });

        $("#tablaCitasBody").html(html);
    }
    //Mostrar los elemntos para agregar cita con paciente nuevo
    function mostrarElementosNuevo(hora) {
        var cadena = "";
        cadena += "<h5 style='font-weight:700; color:#1f2937; margin-bottom:18px;'>Nueva cita</h5>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Paciente:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='pacientes'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Hora:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='hora' disabled value='" + hora + "'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Teléfono:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='telefono'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Observación:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='observacion'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10 pl-0'>";
        cadena += "<button type='button' class='btn btn-success mr-2' id='btnGuardar'>Guardar</button>";
        cadena += "<button type='button' class='btn btn-outline-secondary' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "</form>";

        $("#datosCita").html(cadena);

        $("#btnGuardar").click(function () {
            insertarCitaNueva();
        });

        $("#btnCancelar").click(function () {
            $("#agendar").html("");
            $("#datosCita").html("");
        });
    }

    //Mostrar los elemntos para agregar cita con paciente que existe
    function mostrarElementosExiste(hora) {
        var cadena = "";
        cadena += "<h5 style='font-weight:700; color:#1f2937; margin-bottom:18px;'>Agendar paciente existente</h5>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Paciente:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='pacientes' list='listaPacientes' placeholder='Escriba para buscar...'>";
        cadena += "<datalist id='listaPacientes'></datalist>";
        cadena += "<div class='search-hint'>Escriba el nombre del paciente para buscarlo.</div>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Hora:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='hora' disabled value='" + hora + "'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-2 col-form-label'>Observación:</label>";
        cadena += "<div class='col-sm-6'>";
        cadena += "<input type='text' class='form-control' id='observacion'>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10 pl-0'>";
        cadena += "<button type='button' class='btn btn-success mr-2' id='btnGuardar'>Guardar</button>";
        cadena += "<button type='button' class='btn btn-outline-secondary' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>";
        cadena += "</div>";
        cadena += "</form>";

        $("#datosCita").html(cadena);

        cargarPacientes();

        $("#btnGuardar").click(function () {
            insertarCita();
        });

        $("#btnCancelar").click(function () {
            $("#agendar").html("");
            $("#datosCita").html("");
        });
    }

    //Cargar los datos segun la fecha
    function cargarCitas() {
        var fecha = $("#fecha").val();

        database.ref("Agendadas").orderByChild("fec_age").equalTo(fecha).once("value", function (snapshot) {
            var citasAgrupadas = {};

            $.each(horarios, function (_, hora) {
                citasAgrupadas[hora] = [];
            });

            if (snapshot.exists()) {
                snapshot.forEach(function (child) {
                    var cita = child.val();

                    if (cita.est_age === "Nueva") {
                        var hora = cita.hor_age;

                        if (!citasAgrupadas[hora]) {
                            citasAgrupadas[hora] = [];
                        }

                        citasAgrupadas[hora].push({
                            id: child.key,
                            nom_age: cita.nom_age || "",
                            tel_age: cita.tel_age || "",
                            obs_age: cita.obs_age || "",
                            hor_age: cita.hor_age || "",
                            fec_age: cita.fec_age || "",
                            est_age: cita.est_age || ""
                        });
                    }
                });
            }

            renderTablaCitas(citasAgrupadas);
        });
    }

    //Cargar date con los valores iniciales
    function cargarCalendario() {
        var fecha = fechaActual();
        $("#fecha").val(fecha);
        $("#fecha").attr("min", fecha);
    }

    //Carga los pacientes
    function cargarPacientes() {
        var referencia = database.ref("Pacientes");

        pacientesIndex = {};
        $("#listaPacientes").html("");

        referencia.once("value", function (datos) {
            if (datos.exists()) {
                datos.forEach(function (child) {
                    var paciente = child.val();
                    var nombre = paciente.nom_pac || "";
                    var telefono = paciente.tel1_pac || "";

                    pacientesIndex[nombre] = {
                        nombre: nombre,
                        telefono: telefono
                    };

                    $("#listaPacientes").append(
                        "<option value='" + nombre.replace(/'/g, "&#39;") + "'></option>"
                    );
                });
            }
        });
    }
    //Inserta la cita nueva
    function insertarCitaNueva() {
        var fecha = $("#fecha").val();
        var hora = $("#hora").val();

        database.ref("Agendadas")
            .orderByChild("fec_age")
            .equalTo(fecha)
            .once("value", function (snapshot) {
                var totalHora = 0;

                if (snapshot.exists()) {
                    snapshot.forEach(function (child) {
                        var cita = child.val();
                        if (cita.hor_age === hora && cita.est_age === "Nueva") {
                            totalHora++;
                        }
                    });
                }

                if (totalHora >= 2) {
                    alert("Esta hora ya tiene 2 citas agendadas.");
                    return;
                }

                database.ref("Agendadas").push({
                    nom_age: $("#pacientes").val(),
                    tel_age: $("#telefono").val(),
                    obs_age: $("#observacion").val(),
                    fec_age: fecha,
                    hor_age: hora,
                    est_age: "Nueva",
                    asi_age: ""
                }, function () {
                    $("#datosCita").html("");
                    $("#agendar").html("");
                    cargarCitas();
                });
            });
    }

    //Inserta la cita
    function insertarCita() {
        var nombreBuscado = ($("#pacientes").val() || "").trim();

        if (nombreBuscado === "" || !pacientesIndex[nombreBuscado]) {
            alert("Seleccione un paciente válido de la lista.");
            return;
        }

        var tel = pacientesIndex[nombreBuscado].telefono;
        var nom = pacientesIndex[nombreBuscado].nombre;
        var fecha = $("#fecha").val();
        var hora = $("#hora").val();

        database.ref("Agendadas")
            .orderByChild("fec_age")
            .equalTo(fecha)
            .once("value", function (snapshot) {
                var totalHora = 0;

                if (snapshot.exists()) {
                    snapshot.forEach(function (child) {
                        var cita = child.val();
                        if (cita.hor_age === hora && cita.est_age === "Nueva") {
                            totalHora++;
                        }
                    });
                }

                if (totalHora >= 2) {
                    alert("Esta hora ya tiene 2 citas agendadas.");
                    return;
                }

                database.ref("Agendadas").push({
                    nom_age: nom,
                    tel_age: tel,
                    obs_age: $("#observacion").val(),
                    fec_age: fecha,
                    hor_age: hora,
                    est_age: "Nueva",
                    asi_age: ""
                }, function () {
                    $("#datosCita").html("");
                    $("#agendar").html("");
                    cargarCitas();
                });
            });
    }
    //Eliminar cita
    function eliminarCitaPorId(id) {
        database.ref("Agendadas").child(id).remove(function () {
            $("#datosCita").html("");
            $("#agendar").html("");
            cargarCitas();
        });
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