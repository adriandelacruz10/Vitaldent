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
    //Cargar los pacientes
    cargarPacientes();

    //Variables globales

    //METODOS
    //Lista de pacientes
    function cargarPacientes() {
        //Declarar la fecha acctual
        var fec = fechaActual();
        var fechaF = fechaFormato(fec);
        $("#txtFecha").val(fechaF);
        var fecha = fec.split("-");
        var mesA = fecha[1];
        var diaA = fecha[2];
        var bandera = new Boolean();
        bandera = false;

        //Llenar la tabla con los datos
        var referencia = database.ref("Pacientes");
        $("#listado").empty();
        var pacientesData = [];
        referencia.on("value", function (datos) {
            pacientesData = datos.val();
            $.each(pacientesData, function (indice, valor) {
                var fechaNac = valor.fec_pac;
                var fechaP = fechaNac.split("-");
                var mesP = fechaP[1];
                var diaP = fechaP[2];
                if(mesP == mesA && diaP == diaA){
                    var cadena = "<tr>";
                    cadena += "<td>" + valor.nom_pac + "</td>";
                    var edad = calcularEdad(valor.fec_pac);
                    cadena += "<td>" + edad + "</td>";
                    cadena += "<td>" + valor.tel1_pac + "</td>";
                    cadena += "</tr>"
                    $(cadena).appendTo("#listado");
                    bandera = true;
                }
            })
            if (!bandera) {
                var cadena = "<tr>";
                cadena += "<td>No existen cumpleañeros HOY</td>";
                cadena += "<td>---</td>";
                cadena += "<td>---</td>";
                cadena += "</tr>"
                $(cadena).appendTo("#listado");
            }
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

     //Calcula la edad
     function calcularEdad(edad) {
        var actual = fechaActual();
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