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
    //Cargas iniciales
    cargarCitas();

    //EVENTOS CLICK
    $("#btnAgendar").click(function () {
        cargarCampos();
    })
    $("#btnHistoria").click(function () {
        location.assign("historia.html");
    })
    $("#btnCaja").click(function () {
        location.assign("caja.html");
    })
    $("#btnConsulta").click(function () {
        location.assign("consulta.html");
    })
    $("#fecha").change(function () {
        encerarCampos();
        cargarCitas();
    })
    $("#btnOdontograma").click(function () {
        location.assign("odontograma.html");
    })

    //METODOS
    //Cargar la cita agendada del paciente
    function cargarCitas() {
        var referencia = database.ref();
        var citas = [];
        var nom = localStorage.getItem("nombrePaciente");
        $("#titulo").html("CITAS PENDIENTES: " + nom);
        referencia.child("Agendadas").orderByChild("nom_age").equalTo(nom).on("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                var cadena;
                $.each(citas, function (id, cita) {
                    if (cita.est_age == "Nueva") {
                        cadena += "<tr>";
                        var fec = fechaFormato(cita.fec_age);
                        cadena += "<td>" + fec + "</td>";
                        cadena += "<td>" + cita.hor_age + "</td>";
                        cadena += "<td>" + cita.obs_age + "</td>";
                        cadena += "<td> <button type='button' class='btnAsistir btn btn-outline-success btn-sm'" + "id='" + id + "*" + cita.nom_age + "'>" +
                            "Asiste </button> ";
                        cadena += "<button type='button' class='btnNoAsistir btn btn-outline-danger btn-sm'" + "id='" + id + "*" + cita.nom_age + "'>" +
                            "No asiste </button> </td>";
                        cadena += "</tr>";
                    }
                })
                //Mostrar lista
                $("#listadoA").html(cadena);
                //Eventos del clic
                $(".btnAsistir").click(function () {
                    var id = this.id;
                    var datos = id.split("*");
                    if (confirm("¿Confirmar que el paciente " + datos[1] + " ASITIÓ?") == true) {
                        actualizarCita(datos[0], "ASISTE");
                    }
                })
                $(".btnNoAsistir").click(function () {
                    var id = this.id;
                    var datos = id.split("*");
                    if (confirm("¿Confirmar que el paciente " + datos[1] + " NO ASITIÓ?") == true) {
                        actualizarCita(datos[0], "NO ASISTE");
                    }
                })
            } else {
                var cadena = "<tr>";
                cadena += "<td colspan='4'>No exiten citas. Programe una!</td>";
                cadena += "</tr>";
                $("#listadoA").html(cadena);
                $("#btnAgendar").attr("disabled", false);
            }
        })
    }
    //Muestra los campos para agregar agendar una cita
    function cargarCampos() {
        var nom = localStorage.getItem("nombrePaciente");
        var fecha = fechaActual();
        var cadena = "<hr>";
        cadena += "<form>";
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Paciente:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input class='form-control' value='" + nom + "' disabled>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Fecha:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<input type='date' id='fecha' class='form-control' value='" + fecha + "' min='" + fecha + "'>";
        cadena += "</div>";
        cadena += "</div>"
        cadena += "<div class='form-group row'>";
        cadena += "<label class='col-sm-1 col-form-label'>Hora de la cita:</label>";
        cadena += "<div class='col-sm-5'>";
        cadena += "<select type='text'class='custom-select' id='horas'>";
        cadena += "<option>8:00</option>"
        cadena += "<option>8:30</option>"
        cadena += "<option>9:00</option>"
        cadena += "<option>9:30</option>"
        cadena += "<option>10:00</option>"
        cadena += "<option>10:30</option>"
        cadena += "<option>11:00</option>"
        cadena += "<option>11:30</option>"
        cadena += "<option>12:00</option>"
        cadena += "<option>15:00</option>"
        cadena += "<option>15:30</option>"
        cadena += "<option>16:00</option>"
        cadena += "<option>16:30</option>"
        cadena += "<option>17:00</option>"
        cadena += "<option>17:30</option>"
        cadena += "<option>18:00</option>"
        cadena += "<option>18:30</option>"
        cadena += "<option>19:00</option>"
        cadena += "<option>19:30</option>"
        cadena += "<option>20:00</option>"
        cadena += "<option>20:30</option>"
        cadena += "<option>21:00</option>"
        cadena += "</select>";
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
        $("#agendar").html(cadena);
        //Eventos click de botones recien creados
        $("#btnGuardar").click(function () {
            buscarCita();
        })
        $("#btnCancelar").click(function () {
            $("#agendar").html("");
        })
    }

    //Actualizar el estado de la cita
    function actualizarCita(id, est) {
        var referencia = database.ref("Agendadas");
        referencia.child(id).update({
            est_age: "Terminada",
            asi_age: est
        })
        referencia.off();
        cargarCitas();
    }

    //Inserta la cita
    function insertarCita(existe) {
        if (existe) {
            var nom = localStorage.getItem("nombrePaciente");
            var tel = localStorage.getItem("telefonoPaciente");
            var fecha = $("#fecha").val();
            var hora = $("#horas").val();
            var obs = $("#observacion").val();
            var referencia = database.ref("Agendadas");
            referencia.push({
                nom_age: nom,
                fec_age: fecha,
                hor_age: hora,
                obs_age: obs,
                tel_age: tel,
                asi_age: "",
                est_age: "Nueva"
            })
            $("#agendar").html("");
            $("#alerta").html("");
        } else {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Ya existen citas a esa hora. Por favor escoja otra hora! </strong>";
            alerta += "</div>";
            $("#alerta").html(alerta);
        }
    }

    //Busca si existe una cita a esa hora y fecha
    function buscarCita() {
        var fecha = $("#fecha").val();
        var hora = $("#horas").val();
        var bandera = true;
        var referencia = database.ref();
        var citas = [];
        referencia.child("Agendadas").orderByChild("fec_age").equalTo(fecha).on("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                var con = 1;
                $.each(citas, function (id, cita) {
                    if (cita.est_age == "Nueva") {
                        if (cita.hor_age == hora) {
                            if (con >= 2) {
                                bandera = false;
                            }
                            con += 1;
                        }
                    }
                })

            }
            insertarCita(bandera);
        })
    }

    //Fecha con formato
    function fechaFormato(fecha) {
        //Separar la fecha
        var fechas = fecha.split("-");
        var anio = fechas[0];
        var mes = fechas[1];
        var dia = fechas[2];
        //Transformar a enteros
        anio = parseInt(anio);
        dia = parseInt(dia);
        mes = parseInt(mes);
        mes = mes - 1;
        //Dar valor a la fecha
        var fec = new Date(anio, mes, dia);

        //obtener el nombre del dia
        var nDia = fec.getDay();
        var diaF = "";
        switch (nDia) {
            case 0:
                diaF = "Domingo";
                break;
            case 1:
                diaF = "Lunes";
                break;
            case 2:
                diaF = "Martes";
                break;
            case 3:
                diaF = "Miércoles";
                break;
            case 4:
                diaF = "Jueves";
                break;
            case 5:
                diaF = "Viernes";
                break;
            case 6:
                diaF = "Sábado";
                break;
        }

        //Obtener el nombre del mes
        var mesF = "";
        switch (mes) {
            case 0:
                mesF = "Enero"
                break;
            case 1:
                mesF = "Febrero"
                break;
            case 2:
                mesF = "Marzo"
                break;
            case 3:
                mesF = "Abril"
                break;
            case 4:
                mesF = "Mayo"
                break;
            case 5:
                mesF = "Junio"
                break;
            case 6:
                mesF = "Julio"
                break;
            case 7:
                mesF = "Agosto"
                break;
            case 8:
                mesF = "Septiembre"
                break;
            case 9:
                mesF = "Octubre"
                break;
            case 10:
                mesF = "Noviembre"
                break;
            case 11:
                mesF = "Diciembre"
                break;
        }

        //Fecha con formato
        var diaMes = fec.getDate();
        var fechaF = "";
        fechaF = diaF + ", " + diaMes + " de " + mesF + " de " + anio;
        return fechaF;
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