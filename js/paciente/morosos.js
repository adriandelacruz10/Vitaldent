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

    //Metodos de carga al inicio
    cargarListaPacientes();
    cargarListaFacturas();
    cargarTitulo();

    //VARIABLES GLOBALES
    //Lista de pacientes
    var pacientes = [];
    var facturas = [];

    //METODOS DEL CLICK
    $("#btnMorosos").click(function () {
        $("#listaMorosos").empty();
        buscarMorosos();
        $("#btnMorosos").attr("disabled", true);
    })

    //METODOS
    //carga la lista de pacientes
    function cargarListaPacientes() {
        var pacientesData = [];
        var referencia = database.ref("Pacientes");
        referencia.on("value", function (datos) {
            pacientesData = datos.val();
            $.each(pacientesData, function (indice, valor) {
                var paciente = new Object();
                paciente.nombre = valor.nom_pac;
                paciente.telefono = valor.tel1_pac;
                paciente.observacion = valor.obs_pac;
                paciente.plan = valor.pla_pac;
                pacientes.push(paciente);
            })
        });
    }

    //carga la lista de facturas
    function cargarListaFacturas() {
        var facturasData = [];
        var referencia = database.ref("Facturas");
        referencia.on("value", function (datos) {
            facturasData = datos.val();
            $.each(facturasData, function (indice, valor) {
                var factura = new Object();
                factura.nombre = valor.nom_fac;
                factura.fecha = valor.fec_fac;
                factura.pago = valor.pag_fac;
                factura.total = valor.tot_fac;
                facturas.push(factura);
            })
        });
    }

    //Buscar pacientes morosos
    function buscarMorosos() {
        $("#listaMorosos").empty();
        //Buscar en la lista de pacientes
        var i = 1;
        pacientes.forEach(paciente => {
            var total = 0;
            var fec = "";
            facturas.forEach(factura => {
                if (factura.nombre == paciente.nombre) {
                    var t = factura.total - factura.pago;
                    total += t;
                    fec = factura.fecha;
                }
            })
            if (total > 0) {
                //Definir las fechas del utlimo pago
                var fecha = fec.split("-");
                var fA = new Date();
                fA.setDate(fecha[2]);
                fA.setMonth(fecha[1] - 1);
                var resta = 0;
                var hoy = new Date();
                //restar las fechas y sacar el resultado en dias
                resta = (hoy.getTime() - fA.getTime())/1000/60/60/24;
                //Ver que el utlimo pago es mayor a 31 dias
                if (resta > 30) {
                    var cadena = "<tr>";
                    cadena += "<th>" + i + "</th>";
                    cadena += "<td>" + paciente.nombre + "</td>";
                    cadena += "<td>" + total + "</td>";
                    var fechaF = fechaFormato(fec);
                    cadena += "<td>" + fechaF + "</td>";
                    cadena += "<td>" + paciente.telefono + "</td>";
                    cadena += "</tr>";
                    $(cadena).appendTo("#listaMorosos");
                    i++;
                }
            }
        })
    }

    //Cargar el titulo de la pagina con su fecha
    function cargarTitulo() {
        var hoy = new Date();
        var fecha = fechaActual(hoy);
        var hoyF = fechaFormato(fecha);
        var mensaje = "";
        mensaje += "<h5 style='color: black'>Listado de morosos. " + hoyF + "</h5>";
        mensaje += "<hr style='height: 2px; background-color: blue;'/ width='35%'>"
        mensaje += "<br>";
        $("#titulo").html(mensaje);
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
});