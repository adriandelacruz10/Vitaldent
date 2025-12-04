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
    //Variables globles
    var numDiente = "";

    //EVENTOS CLICK
    $(".diente").click(function () {
        var id = this.id;
        darNumeroDiente(id);
        encerarMenu();
    })
    $(".menu").click(function () {
        var id = this.id;
        encerarMenu();
        mostrarMenu(id);
    })

    //METODOS
    //Llena el numero con el diente
    function darNumeroDiente(num) {
        $("#alerta").html('');
        $("#numeroDiente").html(num);
        numDiente = num;
        $("#opcionesMenu").html("");
        //$("#img1").attr("href","../img/botones/borrar.png");
    }
    //Mostrar el menu y sus opciones
    function mostrarMenu(num) {
        var id = "#" + num;
        if (numDiente == "") {
            var alerta = "<div class='alert alert-danger'>";
            alerta += "<a class='close' data-dismiss='alert'> × </a> <strong> Debe seleccionar un diente, antes de realizar esta accion! </strong>";
            alerta += "</div>";
            $("#alerta").html(alerta);
        } else {
            var cadena = "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000; fill: #fff'></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='sano'>Diente sano</a>";
            cadena += "<br>";
            cadena += "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000; fill: #f00'></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='carie'>Con caries</a>";
            cadena += "<br>";
            cadena += "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000; fill: #00f'></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='resina'>Con resina</a>";
            cadena += "<br>";
            cadena += "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000; fill: #000'></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='amalgama'>Con amalgama</a>";
            cadena += "<br>";
            cadena += "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000;' fill=url('#sel1')></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='se1'>Sellante necesario</a>";
            cadena += "<br>";
            cadena += "<svg width='15' height='15' viewBox='0 0 10 10'>";
            cadena += "<polygon points='0,0 0,10 10,10 10,0' style='stroke:#000;' fill=url('#sel2')></polygon>";
            cadena += "</svg>";
            cadena += "<a class='pintar' id='se2'>Sellenate realizado</a>";
            $(id).attr("style", "stroke:#000; fill: #92c5fc");
            $("#opcionesMenu").html(cadena);
            $(".pintar").click(function () {
                var id = this.id;
                pintarDientes(num, id);
            })
        }
    }
    //Encerar opciones del menu
    function encerarMenu() {
        var i = 1;
        while (i < 6) {
            var id = "#p" + i;
            $(id).attr("style", "stroke:#000; fill:#fff");
            i++;
        }
    }
    //Colorea de acuerdo a la opcion el diente seleccionado
    function pintarDientes(pared, color) {
        var id = "#" + numDiente + pared;
        switch (color) {
            case "sano":
                $(id).attr("style", "stroke:#000; fill:#fff");
                break;
            case "carie":
                $(id).attr("style", "stroke:#000; fill:#f00");
                break;
            case "resina":
                $(id).attr("style", "stroke:#000; fill:#00f");
                break;
            case "amalgama":
                $(id).attr("style", "stroke:#000; fill:#000");
                break;
            case "se1":
                $(id).attr("style", "stroke:#000; fill:url('#sel1')");
                break;
            case "se2":
                $(id).attr("style", "stroke:#000; fill:url('#sel2')");
                break;
            default:
                break;
        }
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

/*< td >
<svg width="90" height="90" viewBox="0 0 90 90">
    <rect x="0" y="0" height="90" width="90" fill="#6ab150" id="rec1"></rect>
    <image href="../img/sonrisa.png" height="50" width="50" x="0" y="0"></image>
</svg>
                    </td >
<td>
    <svg width="90" height="90" viewBox="0 0 90 90">
        <polygon points="0,0 0,90 30,60 30,30" fill="#6ab150"></polygon>
        <polygon points="0,90 90,90 60,60 30,60" style="stroke:#000; fill: #5052b1"></polygon>
        <polygon points="90,90 90,0 60,30 60,60" style="stroke:#000; fill: #d1f310"></polygon>
        <polygon points="90,0 0,0 30,30 60,30" style="stroke:#000; fill: #f310cd"></polygon>
        <polygon points="30,30 30,60 60,60 60,30" style="stroke:#000; fill: #311c1c"></polygon>
        se usa el image para sobreeponer una imagen en el href 
        <image href="../img/presentacion/portfolio/p1.jpg" height="50" width="50" x="0" y="0" id="img1"></image>
        <defs>
                                    <image href="../img/botones/borrar.png" height="15" width="15" x="0" y="0" id="ps1"></image>
                                </defs>
    </svg>
    "<use href='#ps1'></use>"

</td>*/