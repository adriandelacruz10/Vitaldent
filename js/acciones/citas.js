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
    cargarCitas();
    //Variables globales
    var citasP = [];

    //EVENTOS CLICk
    //Abrir la parte de agendar
    $("#btnAgendar").click(function () {
        location.assign("agendar.html");
    })
    //Abrir las citas terminadas
    $("#btnAnteriores").click(function () {
        location.assign("citasAnteriores.html");
    })
    //Filtro de citas hoy
    $("#btnHoy").click(function () {
        citasHoy();
        $("#btnHoy").attr("disabled", true);
        $("#btnHoy").attr("class", "btn btn-primary btn-sm");
        $("#btnManana").attr("disabled", false);
        $("#btnManana").attr("class", "btn btn-outline-primary btn-sm");
        $("#btnTodo").attr("disabled", false);
        $("#btnTodo").attr("class", "btn btn-outline-primary btn-sm");
    })
    //Filtro de citas manana
    $("#btnManana").click(function () {
        citasManana();
        $("#btnManana").attr("disabled", true);
        $("#btnManana").attr("class", "btn btn-primary btn-sm");
        $("#btnHoy").attr("disabled", false);
        $("#btnHoy").attr("class", "btn btn-outline-primary btn-sm");
        $("#btnTodo").attr("disabled", false);
        $("#btnTodo").attr("class", "btn btn-outline-primary btn-sm");
    })
    //Filtro de todas las citas
    $("#btnTodo").click(function () {
        citasTodo();
        $("#btnTodo").attr("disabled", true);
        $("#btnTodo").attr("class", "btn btn-primary btn-sm");
        $("#btnHoy").attr("disabled", false);
        $("#btnHoy").attr("class", "btn btn-outline-primary btn-sm");
        $("#btnManana").attr("disabled", false);
        $("#btnManana").attr("class", "btn btn-outline-primary btn-sm");
    })

    //METODOS
    //Lista de citas
    function cargarCitas() {
        $("#listado").empty();
        var referencia = database.ref();
        var citas = [];
        referencia.child("Agendadas").orderByChild("est_age").equalTo("Nueva").once("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                $.each(citas, function (id, cita) {
                    var cadena = "<tr>";
                    var fecha = fechaFormato(cita.fec_age);
                    fecha = fecha + " - " + cita.hor_age;
                    cadena += "<td>" + fecha + "</td>";
                    cadena += "<td>" + cita.nom_age + "</td>";
                    cadena += "<td>" + cita.tel_age + "</td>";
                    cadena += "<td>" + cita.obs_age + "</td>";
                    cadena += "<td> <button type='button' class='btnAsistir btn btn-outline-success btn-sm'" + "id='" + id + "*" + cita.nom_age + "'>" +
                        "Asiste </button> ";
                    cadena += "<button type='button' class='btnNoAsistir btn btn-outline-danger btn-sm'" + "id='" + id + "*" + cita.nom_age + "'>" +
                        "No asiste </button> </td>";
                    cadena += "</tr>";
                    $(cadena).appendTo("#listado");
                    var citaP = new Object();
                    citaP.id = id;
                    citaP.fecha = cita.fec_age;
                    citaP.nombre = cita.nom_age;
                    citaP.hora = cita.hor_age;
                    citaP.telefono = cita.tel_age;
                    citaP.observacion = cita.obs_age;
                    citasP.push(citaP);
                })
                //Eventos del clic
                $(".btnAsistir").click(function () {
                    var id = this.id;
                    var datos = id.split("*");
                    if (confirm("¿Confirmar que el paciente " + datos[1] + " ASITIÓ?") == true) {
                        actulizarCita(datos[0], "ASISTE");
                    }
                })
                $(".btnNoAsistir").click(function () {
                    var id = this.id;
                    var datos = id.split("*");
                    if (confirm("¿Confirmar que el paciente " + datos[1] + " NO ASITIÓ?") == true) {
                        actulizarCita(datos[0], "NO ASISTE");
                    }
                })
            } else {
                var cadena = "<tr>";
                cadena += "<td>NO EXITEN CITAS PENDIENTES</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "</tr>";
                $(cadena).appendTo("#listado");
            }
        })
        referencia.off();
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

    //Mostrar citas de hoy
    function citasHoy() {
        var date = new Date();
        var fecha = fechaRequerida(date);
        mostrarDatos(fecha);
    }

    //Mostrar citas de manana
    function citasManana() {
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var fecha = fechaRequerida(date);
        mostrarDatos(fecha);
    }

    //Mostrar todas las citas
    function citasTodo() {
        mostrarDatosTodo();
    }

    //Actualizar el estado de la cita
    function actulizarCita(id, est) {
        var referencia = database.ref("Agendadas");
        referencia.child(id).update({
            est_age: "Terminada",
            asi_age: est
        })
        referencia.off();
        cargarCitas();
    }

    //Actualizar el estado de la cita con filtro
    function actulizarCitaFiltro(id, est, index, fecha) {
        var referencia = database.ref("Agendadas");
        referencia.child(id).update({
            est_age: "Terminada",
            asi_age: est
        })
        referencia.off();
        citasP.splice(index, 1);
        mostrarDatos(fecha);
    }

    //Actualizar el estado de la cita con filtro todos
    function actulizarCitaTodo(id, est, index) {
        var referencia = database.ref("Agendadas");
        referencia.child(id).update({
            est_age: "Terminada",
            asi_age: est
        })
        citasP.splice(index, 1);
        citasTodo();
    }

    //Mostrar los datos segun los filtros
    function mostrarDatos(fecha) {
        $("#listado").empty();
        var bandera = true;
        var cadena;
        citasP.forEach((cita, index) => {
            if (cita.fecha == fecha) {
                cadena += "<tr>";
                var fec = fechaFormato(cita.fecha);
                fec = fec + " - " + cita.hora;
                cadena += "<td>" + fec + "</td>";
                cadena += "<td>" + cita.nombre + "</td>";
                cadena += "<td>" + cita.telefono + "</td>";
                cadena += "<td>" + cita.observacion + "</td>";
                cadena += "<td> <button type='button' class='btnAsistir btn btn-outline-success btn-sm'" + "id='" + cita.id + "*" + cita.nombre + "*" + index + "*" + cita.fecha + "'>" +
                    "Asiste </button> ";
                cadena += "<button type='button' class='btnNoAsistir btn btn-outline-danger btn-sm'" + "id='" + cita.id + "*" + cita.nombre + "*" + index + "*" + cita.fecha + "'>" +
                    "No asiste </button> </td>";
                cadena += "</tr>";
                bandera = false;
            }
        });
        $("#listado").html(cadena);
        if (bandera) {
            var cadena = "<tr>";
            cadena += "<td>NO EXITEN CITAS PENDIENTES</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "</tr>";
            $(cadena).appendTo("#listado");
        }
        //Eventos del clic
        $(".btnAsistir").click(function () {
            $("#listado").empty();
            var id = this.id;
            var datos = id.split("*");
            if (confirm("¿Confirmar que el paciente " + datos[1] + " ASITIÓ?") == true) {
                actulizarCitaFiltro(datos[0], "ASISTE", datos[2], datos[3]);
            }else{
                mostrarDatos(datos[3]);
            }
        })
        $(".btnNoAsistir").click(function () {
            $("#listado").empty();
            var id = this.id;
            var datos = id.split("*");
            if (confirm("¿Confirmar que el paciente " + datos[1] + " NO ASITIÓ?") == true) {
                $("#listado").empty();
                actulizarCitaFiltro(datos[0], "NO ASISTE", datos[2], datos[3]);
            }else{
                mostrarDatos(datos[3]);
            }
        })
    }

    //Mostrar datos con el fitro de todo
    function mostrarDatosTodo() {
        $("#listado").empty();
        var bandera = true;
        citasP.forEach((cita, index) => {
            var cadena = "<tr>";
            var fec = fechaFormato(cita.fecha);
            fec = fec + " - " + cita.hora;
            cadena += "<td>" + fec + "</td>";
            cadena += "<td>" + cita.nombre + "</td>";
            cadena += "<td>" + cita.telefono + "</td>";
            cadena += "<td>" + cita.observacion + "</td>";
            cadena += "<td> <button type='button' class='btnAsistir btn btn-outline-success btn-sm'" + "id='" + cita.id + "*" + cita.nombre + "*" + index + "'>" +
                "Asiste </button> ";
            cadena += "<button type='button' class='btnNoAsistir btn btn-outline-danger btn-sm'" + "id='" + cita.id + "*" + cita.nombre + "*" + index + "'>" +
                "No asiste </button> </td>";
            cadena += "</tr>";
            $(cadena).appendTo("#listado");
            bandera = false;
        });
        if (bandera) {
            var cadena = "<tr>";
            cadena += "<td>NO EXITEN CITAS PENDIENTES</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "<td>---</td>";
            cadena += "</tr>";
            $(cadena).appendTo("#listado");
        }
        //Eventos del clic
        $(".btnAsistir").click(function () {
            var id = this.id;
            var datos = id.split("*");
            if (confirm("¿Confirmar que el paciente " + datos[1] + " ASITIÓ?") == true) {
                actulizarCitaTodo(datos[0], "ASISTE", datos[2]);
            }
        })
        $(".btnNoAsistir").click(function () {
            var id = this.id;
            var datos = id.split("*");
            if (confirm("¿Confirmar que el paciente " + datos[1] + " NO ASITIÓ?") == true) {
                actulizarCitaTodo(datos[0], "NO ASISTE", datos[2]);
            }
        })
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

    //Obtiene y devuelve la fecha reuqrida para la busqueda
    function fechaRequerida(date) {
        var año = date.getFullYear();
        var mes = date.getMonth();
        var dia = date.getDate();
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