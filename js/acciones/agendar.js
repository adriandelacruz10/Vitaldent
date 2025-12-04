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
    //Cargar iniciales
    cargarCalendario();
    cargarCitas();

    //Comentarios
    /*Si el telefono es necesario guardo en una lista con el nombre y el telefono*/

    //EVENTOS CLICk
    //Mostrar elementos para un cita
    $(".btnAgendar").click(function () {
        var id = this.id;
        hora = id.replace("_", ":");
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<button type='button' class='btn btn-outline-dark' id='btnNuevo'>Nuevo paciente</button> ";
        cadena += "<button type='button' class='btn btn-outline-primary' id='btnExiste'>Paciente existente</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#agendar").html(cadena);
        location.assign("#usuario");
        //Eventos click de botones recien creados
        $("#btnNuevo").click(function () {
            mostrarElementosNuevo(hora);
            $('#btnNuevo').attr('disabled', true);
            $('#btnExiste').attr('disabled', false);
        })
        $("#btnExiste").click(function () {
            mostrarElementosExiste(hora);
            $('#btnExiste').attr('disabled', true);
            $('#btnNuevo').attr('disabled', false);
        })
    })
    //Eliminar cita
    $(".btnEliminar").click(function () {
        var horas = this.id.split("_");
        var hora = horas[0] + ":" + horas[1];
        if (confirm("¿Esta seguro que desea eliminar la cita?") == true) {
            eliminarCita(hora);
        }
        encerarCampos();
        cargarCitas();
    })
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
        encerarCampos();
        cargarCitas();
    })

    //METODOS
    //Mostrar los elemntos para agregar cita con paciente nuevo
    function mostrarElementosNuevo(hora) {
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Paciente:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='pacientes'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Hora de la cita:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='hora' disabled value='" + hora + "'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Teléfono:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='telefono'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Observación:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='observacion'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10'>"
        cadena += "<button type='button' class='btn btn-outline-success' id='btnGuardar'>Guardar</button> ";
        cadena += "<button type='button' class='btn btn-outline-danger' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#datosCita").html(cadena);
        //Eventos click de botones recien creados
        $("#btnGuardar").click(function () {
            insertarCitaNueva();
        })
        $("#btnCancelar").click(function () {
            $("#agendar").html("");
            $("#datosCita").html("");
        })
    }

    //Mostrar los elemntos para agregar cita con paciente que existe
    function mostrarElementosExiste(hora) {
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Paciente:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<select class='custom-select' id='pacientes'></select>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Hora de la cita:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='hora' disabled value='" + hora + "'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Observación:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='text'class='form-control' id='observacion'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group'>";
        cadena += "<div class='col-sm-10'>"
        cadena += "<button type='button' class='btn btn-outline-success' id='btnGuardar'>Guardar</button> ";
        cadena += "<button type='button' class='btn btn-outline-danger' id='btnCancelar'>Cancelar</button>";
        cadena += "</div>"
        cadena += "</div>";
        cadena += "</form>"
        cadena += "<hr>";
        $("#datosCita").html(cadena);
        //Cargar datos
        cargarPacientes();
        //Eventos click de botones recien creados
        $("#btnGuardar").click(function () {
            insertarCita();
        })
        $("#btnCancelar").click(function () {
            $("#agendar").html("");
            $("#datosCita").html("");
        })
    }

    //Cargar los datos segun la fecha
    function cargarCitas() {
        var referencia = database.ref();
        var citas = [];
        var fecha = $("#fecha").val();
        referencia.child("Agendadas").orderByChild("fec_age").equalTo(fecha).on("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                var a1 = a2 = a3 = a4 = a5 = a6 = a7 = a8 = a9 = a10 = a11 = a12 = a13 = a14 = a15 = a16 = a17 = a18 = a19 = a20 = a21 = a22 = a23 = 1;
                //var a1 = 1;
                //var a2 = 1;
                $.each(citas, function (id, cita) {
                    if (cita.est_age == "Nueva") {
                        if (cita.hor_age == "8:00") {
                            $("#nom22").val(cita.nom_age);
                            $("#tel22").val(cita.tel_age);
                            $("#obs22").val(cita.obs_age);
                            if (a1 >= 2) {
                                $("#8_00").attr("disabled", true);
                                $("#8_00_e").attr("disabled", false);
                            }
                            a1 += 1;
                        }
                        if (cita.hor_age == "8:30") {
                            $("#nom23").val(cita.nom_age);
                            $("#tel23").val(cita.tel_age);
                            $("#obs23").val(cita.obs_age);
                            if (a2 >= 2) {
                                $("#8_30").attr("disabled", true);
                                $("#8_30_e").attr("disabled", false);
                            }

                            a2 += 1;
                        }
                        if (cita.hor_age == "9:00") {
                            $("#nom1").val(cita.nom_age);
                            $("#tel1").val(cita.tel_age);
                            $("#obs1").val(cita.obs_age);
                            if (a3 >= 2) {
                                $("#9_00").attr("disabled", true);
                                $("#9_00_e").attr("disabled", false);
                            }
                            a3 += 1;
                        }
                        if (cita.hor_age == "9:30") {
                            $("#nom2").val(cita.nom_age);
                            $("#tel2").val(cita.tel_age);
                            $("#obs2").val(cita.obs_age);
                            if (a4 >= 2) {
                                $("#9_30").attr("disabled", true);
                                $("#9_30_e").attr("disabled", false);
                            }
                            a4 += 1;
                        }
                        if (cita.hor_age == "10:00") {
                            $("#nom3").val(cita.nom_age);
                            $("#tel3").val(cita.tel_age);
                            $("#obs3").val(cita.obs_age);
                            if (a5 >= 2) {
                                $("#10_00").attr("disabled", true);
                                $("#10_00_e").attr("disabled", false);
                            }
                            a5 += 1;
                        }
                        if (cita.hor_age == "10:30") {
                            $("#nom4").val(cita.nom_age);
                            $("#tel4").val(cita.tel_age);
                            $("#obs4").val(cita.obs_age);
                            if (a6 >= 2) {
                                $("#10_30").attr("disabled", true);
                                $("#10_30_e").attr("disabled", false);
                            }
                            a6 += 1;
                        }
                        if (cita.hor_age == "11:00") {
                            $("#nom5").val(cita.nom_age);
                            $("#tel5").val(cita.tel_age);
                            $("#obs5").val(cita.obs_age);
                            if (a7 >= 2) {
                                $("#11_00").attr("disabled", true);
                                $("#11_00_e").attr("disabled", false);
                            }
                            a7 += 1;
                        }
                        if (cita.hor_age == "11:30") {
                            $("#nom6").val(cita.nom_age);
                            $("#tel6").val(cita.tel_age);
                            $("#obs6").val(cita.obs_age);
                            if (a8 >= 2) {
                                $("#11_30").attr("disabled", true);
                                $("#11_30_e").attr("disabled", false);
                            }
                            a8 += 1;
                        }
                        if (cita.hor_age == "12:00") {
                            $("#nom7").val(cita.nom_age);
                            $("#tel7").val(cita.tel_age);
                            $("#obs7").val(cita.obs_age);
                            if (a9 >= 2) {
                                $("#12_00").attr("disabled", true);
                                $("#12_00_e").attr("disabled", false);
                            }
                            a9 += 1;
                        }
                        if (cita.hor_age == "12:30") {
                            $("#nom8").val(cita.nom_age);
                            $("#tel8").val(cita.tel_age);
                            $("#obs8").val(cita.obs_age);
                            if (a10 >= 2) {
                                $("#12_30").attr("disabled", true);
                                $("#12_30_e").attr("disabled", false);
                            }
                            a10 += 1;
                        }
                        if (cita.hor_age == "15:00") {
                            $("#nom9").val(cita.nom_age);
                            $("#tel9").val(cita.tel_age);
                            $("#obs9").val(cita.obs_age);
                            if (a11 >= 2) {
                                $("#15_00").attr("disabled", true);
                                $("#15_00_e").attr("disabled", false);
                            }
                            a11 += 1;
                        }
                        if (cita.hor_age == "15:30") {
                            $("#nom10").val(cita.nom_age);
                            $("#tel10").val(cita.tel_age);
                            $("#obs10").val(cita.obs_age);
                            if (a12 >= 2) {
                                $("#15_30").attr("disabled", true);
                                $("#15_30_e").attr("disabled", false);
                            }
                            a12 += 1;
                        }
                        if (cita.hor_age == "16:00") {
                            $("#nom11").val(cita.nom_age);
                            $("#tel11").val(cita.tel_age);
                            $("#obs11").val(cita.obs_age);
                            if (a13 >= 2) {
                                $("#16_00").attr("disabled", true);
                                $("#16_00_e").attr("disabled", false);
                            }
                            a13 += 1;

                        }
                        if (cita.hor_age == "16:30") {
                            $("#nom12").val(cita.nom_age);
                            $("#tel12").val(cita.tel_age);
                            $("#obs12").val(cita.obs_age);
                            if (a14 >= 2) {
                                $("#16_30").attr("disabled", true);
                                $("#16_30_e").attr("disabled", false);
                            }
                            a14 += 1;
                        }
                        if (cita.hor_age == "17:00") {
                            $("#nom13").val(cita.nom_age);
                            $("#tel13").val(cita.tel_age);
                            $("#obs13").val(cita.obs_age);
                            if (a15 >= 2) {
                                $("#17_00").attr("disabled", true);
                                $("#17_00_e").attr("disabled", false);
                            }
                            a15 += 1;
                        }
                        if (cita.hor_age == "17:30") {
                            $("#nom14").val(cita.nom_age);
                            $("#tel14").val(cita.tel_age);
                            $("#obs14").val(cita.obs_age);
                            if (a16 >= 2) {
                                $("#17_30").attr("disabled", true);
                                $("#17_30_e").attr("disabled", false);
                            }
                            a16 += 1;
                        }
                        if (cita.hor_age == "18:00") {
                            $("#nom15").val(cita.nom_age);
                            $("#tel15").val(cita.tel_age);
                            $("#obs15").val(cita.obs_age);
                            if (a17 >= 2) {
                                $("#18_00").attr("disabled", true);
                                $("#18_00_e").attr("disabled", false);
                            }
                            a17 += 1;
                        }
                        if (cita.hor_age == "18:30") {
                            $("#nom16").val(cita.nom_age);
                            $("#tel16").val(cita.tel_age);
                            $("#obs16").val(cita.obs_age);
                            if (a18 >= 2) {
                                $("#18_30").attr("disabled", true);
                                $("#18_30_e").attr("disabled", false);
                            }
                            a18 += 1;
                        }
                        if (cita.hor_age == "19:00") {
                            $("#nom17").val(cita.nom_age);
                            $("#tel17").val(cita.tel_age);
                            $("#obs17").val(cita.obs_age);
                            if (a19 >= 2) {
                                $("#19_00").attr("disabled", true);
                                $("#19_00_e").attr("disabled", false);
                            }
                            a19 += 1;

                        }
                        if (cita.hor_age == "19:30") {
                            $("#nom18").val(cita.nom_age);
                            $("#tel18").val(cita.tel_age);
                            $("#obs18").val(cita.obs_age);
                            if (a20 >= 2) {
                                $("#19_30").attr("disabled", true);
                                $("#19_30_e").attr("disabled", false);
                            }
                            a20 += 1;

                        }
                        if (cita.hor_age == "20:00") {
                            $("#nom19").val(cita.nom_age);
                            $("#tel19").val(cita.tel_age);
                            $("#obs19").val(cita.obs_age);
                            if (a21 >= 2) {
                                $("#20_00").attr("disabled", true);
                                $("#20_00_e").attr("disabled", false);
                            }
                            a21 += 1;

                        }
                        if (cita.hor_age == "20:30") {
                            $("#nom20").val(cita.nom_age);
                            $("#tel20").val(cita.tel_age);
                            $("#obs20").val(cita.obs_age);
                            if (a22 >= 2) {
                                $("#20_30").attr("disabled", true);
                                $("#20_30_e").attr("disabled", false);
                            }
                            a22 += 1;
                        }
                        if (cita.hor_age == "21:00") {
                            $("#nom21").val(cita.nom_age);
                            $("#tel21").val(cita.tel_age);
                            $("#obs21").val(cita.obs_age);
                            if (a23 >= 2) {
                                $("#21_00").attr("disabled", true);
                                $("#21_00_e").attr("disabled", false);
                            }
                            a23 += 1;
                        }
                    }
                })
            }
        })
    }

    //Cargar date con los valores iniciales
    function cargarCalendario() {
        var fecha = fechaActual();
        $("#fecha").attr("value", fecha);
        $("#fecha").attr("min", fecha);
    }

    //Carga los pacientes
    function cargarPacientes() {
        var referencia = database.ref("Pacientes");
        var pacientes = [];
        referencia.on("value", function (datos) {
            pacientes = datos.val();
            $.each(pacientes, function (id, paciente) {
                var cadena = "<option value='" + paciente.tel1_pac + "-" + paciente.nom_pac + "'>" + paciente.nom_pac + "</option>"
                $(cadena).appendTo("#pacientes");
            })
        })
    }
    //Inserta la cita nueva
    function insertarCitaNueva() {
        var referencia = database.ref("Agendadas");
        referencia.push({
            nom_age: $("#pacientes").val(),
            tel_age: $("#telefono").val(),
            obs_age: $("#observacion").val(),
            fec_age: $("#fecha").val(),
            hor_age: $("#hora").val(),
            est_age: "Nueva",
            asi_age: ""
        })
        $("#datosCita").html("");
        $("#agendar").html("");
    }

    //Inserta la cita
    function insertarCita() {
        var datos = [];
        datos = $("#pacientes").val().split("-");
        var tel = datos[0];
        var nom = datos[1];
        var referencia = database.ref("Agendadas");
        referencia.push({
            nom_age: nom,
            tel_age: tel,
            obs_age: $("#observacion").val(),
            fec_age: $("#fecha").val(),
            hor_age: $("#hora").val(),
            est_age: "Nueva",
            asi_age: ""
        })
        $("#datosCita").html("");
        $("#agendar").html("");
    }
    //Encerar campos 
    function encerarCampos() {
        var i = 8;
        while (i < 13) {
            var btn1 = "#" + i + "_00";
            var btn2 = "#" + i + "_00_e";
            var btn3 = "#" + i + "_30";
            var btn4 = "#" + i + "_30_e";
            $(btn1).attr("disabled", false);
            $(btn2).attr("disabled", true);
            $(btn3).attr("disabled", false);
            $(btn4).attr("disabled", true);
            i++;
        }
        var n = 15;
        while (n < 22) {
            var btn1 = "#" + n + "_00";
            var btn2 = "#" + n + "_00_e";
            var btn3 = "#" + n + "_30";
            var btn4 = "#" + n + "_30_e";
            $(btn1).attr("disabled", false);
            $(btn2).attr("disabled", true);
            $(btn3).attr("disabled", false);
            $(btn4).attr("disabled", true);
            n++;
        }
        for (let index = 1; index < 24; index++) {
            var nom = "#nom" + index;
            var tel = "#tel" + index;
            var esp = "#esp" + index;
            var obs = "#obs" + index;
            $(nom).val("");
            $(tel).val("");
            $(esp).val("");
            $(obs).val("");
        }
    }
    //Eliminar la cita
    function eliminarCita(hora) {
        var fecha = $("#fecha").val();
        var referencia = database.ref();
        var citas = [];
        referencia.child("Agendadas").orderByChild("fec_age").equalTo(fecha).on("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                $.each(citas, function (id, cita) {
                    if (cita.hor_age == hora) {
                        var eliminar = database.ref("Agendadas");
                        eliminar.child(id).remove();
                    }
                })
            }
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