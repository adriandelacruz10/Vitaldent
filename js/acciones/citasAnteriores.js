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

    //EVENTOS CLICk
    //Abrir la parte de agendar
    $("#btnAgendar").click(function () {
        location.assign("agendar.html");
    })

    $("#btnPendientes").click(function () {
        location.assign("citas.html");
    })

    //METODOS
    //Lista de citas
    function cargarCitas() {
        $("#listado").empty();
        var referencia = database.ref();
        var citas = [];
        referencia.child("Agendadas").orderByChild("est_age").equalTo("Terminada").on("value", snapshot => {
            if (snapshot.exists()) {
                citas = snapshot.val();
                $.each(citas, function (id, cita) {
                    var cadena = "<tr>";
                    var fecha = fechaFormato(cita.fec_age);
                    fecha = fecha + " - " + cita.hor_age;
                    cadena += "<td>" + fecha + "</td>";
                    cadena += "<td>" + cita.nom_age + "</td>";
                    cadena += "<td>" + cita.asi_age + "</td>";
                    cadena += "<td>" + cita.obs_age + "</td>";
                    cadena += "<td> <button type='button' class='btnEliminar btn btn-outline-danger btn-sm'" + "id='" + id + "*" + cita.nom_age + "'>" +
                        "Eliminar </button> ";
                    cadena += "</tr>";
                    $(cadena).appendTo("#listado");
                })
                //Eventos del clic
                $(".btnEliminar").click(function () {
                    var id = this.id;
                    var datos = id.split("*");
                    if (confirm("¿Eliminar la cita de " + datos[1] + " ?") == true) {
                        eliminarCita(datos[0]);
                    }
                })
            }else{
                var cadena = "<tr>";
                cadena += "<td>NO EXITEN CITAS ANTERIORES</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "</tr>";
                $("#listado").html(cadena);
            }
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

    //Actualizar el estado de la cita
    function eliminarCita(id, est) {
        var referencia = database.ref("Agendadas");
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