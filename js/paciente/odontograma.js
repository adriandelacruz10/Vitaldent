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
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    
    //Variables Globales
    var nombrePac = localStorage.getItem("nombrePaciente");
    var cedulaPac = localStorage.getItem("cedulaPaciente");
    var fechaAct = fechaActual();
    const estados = ['caries','resina','amalgama','sellante','realizado'];
    const menu = document.getElementById('menuContextual');;
    let selectedTooth = null, selectedFace = null;

    //Crear odontrograma al inicar la aplicacion
    crearFilaSeparada([18,17,16,15,14,13,12,11], [21,22,23,24,25,26,27,28],'fila-superior');
    crearFilaSeparada([55,54,53,52,51], [61,62,63,64,65],'fila-temporal-superior');
    crearFilaSeparada([85,84,83,82,81], [71,72,73,74,75],'fila-temporal-inferior');
    crearFilaSeparada([48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38],'fila-inferior');

    //Metodos Iniciales
    cargarUsuario();

    //EVENTOS CLICK
    $("#btnCaja").click(function () {
        location.assign("caja.html");
    })
    $("#btnCita").click(function () {
        location.assign("citas.html");
    })
    $("#btnInformacion").click(function () {
        location.assign("informacion.html");
    })

    //METODOS
    //Crear el diente
    function crearDiente(num) {
      const d = document.createElement('div');
      d.className = 'diente'; 
      d.dataset.num = num;
      d.addEventListener('click', () => selectTooth(num));
      ['sup','inf','izq','der','cen'].forEach(cara => {
        const zona = document.createElement('div');
        zona.className = 'cara ' + cara; 
        zona.dataset.cara = cara;
        d.appendChild(zona);
      });
      const lbl = document.createElement('div');
      lbl.className = 'numero'; 
      lbl.textContent = num;
      d.appendChild(lbl);
      return d;
    }

    //Crear filas 
    function crearFilaSeparada(a,b,cid) {
      const row = document.getElementById(cid);
      a.forEach(n=>row.appendChild(crearDiente(n)));
      const spacer = document.createElement('div');
      spacer.className = 'espacio';
      row.appendChild(spacer);
      b.forEach(n=>row.appendChild(crearDiente(n)));
    }

    //Seleccionar diente actual
    function selectTooth(num) {
      selectedTooth = num;
      document.querySelector('#previewDiente .numero').textContent = num;
      document.querySelectorAll('#previewDiente .cara').forEach(pv=>{
        pv.className = 'cara ' + pv.dataset.cara;
        const orig = document.querySelector(`.diente[data-num="${num}"] .cara.${pv.dataset.cara}`);
        estados.forEach(e => orig.classList.contains(e) && pv.classList.add(e));
      });
    }

    //Mostrar menu
    document.querySelectorAll('#previewDiente .cara').forEach(pv => {
      pv.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedTooth) return;
        selectedFace = this;
        showMenu(e.clientX, e.clientY);
      });
    });

    //Items del menu flotante
    if(menu){
      menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          if (!selectedFace || !selectedTooth) return;
          const estado = li.dataset.estado;
          estados.forEach(e => selectedFace.classList.remove(e));
          if (estado) selectedFace.classList.add(estado);
          const cara = selectedFace.dataset.cara;
          const mainFace = document.querySelector(`.diente[data-num="${selectedTooth}"] .cara.${cara}`);
          estados.forEach(e => mainFace.classList.remove(e));
          if (estado) mainFace.classList.add(estado);
          menu.style.display = 'none';
        });
      });
    }
    function showMenu(x, y) {
      menu.style.left = `${x}px`;
      menu.style.top = `${y}px`;
      menu.style.display = 'block';
    }
    window.addEventListener('click', () => {
      if (menu) menu.style.display = 'none';
    });

    //Mostrar y guardar iconos
    function getSVG(icono) {
      const svgMap = {
        cuadradoA: `
          <svg viewBox="0 0 100 100">
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="#003366" stroke-width="6" />
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#003366" stroke-width="4" />
            <rect x="40" y="40" width="20" height="20" fill="#003366" />
          </svg>`,
        cuadradoN: `
          <svg viewBox="0 0 100 100">
            <rect x="5" y="5" width="90" height="90" fill="none" stroke="#ea4c16" stroke-width="6" />
            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#ea4c16" stroke-width="4" />
            <rect x="40" y="40" width="20" height="20" fill="#ea4c16" />
          </svg>`,
        implanteA: `
          <svg viewBox="0 0 100 100">
            <path d="M30,30 C30,15 70,15 70,30 C70,40 50,60 50,60 C50,60 30,40 30,30 Z" fill="#003366"/>
            <line x1="50" y1="60" x2="40" y2="70" stroke="#003366" stroke-width="3"/>
            <line x1="50" y1="65" x2="40" y2="75" stroke="#003366" stroke-width="3"/>
            <line x1="50" y1="70" x2="40" y2="80" stroke="#003366" stroke-width="3"/>
            <line x1="50" y1="75" x2="40" y2="85" stroke="#003366" stroke-width="3"/>
          </svg>`,
        implanteN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30,30 C30,15 70,15 70,30 C70,40 50,60 50,60 C50,60 30,40 30,30 Z" fill="#ea4c16"/>
            <line x1="50" y1="60" x2="40" y2="70" stroke="#ea4c16" stroke-width="3"/>
            <line x1="50" y1="65" x2="40" y2="75" stroke="#ea4c16" stroke-width="3"/>
            <line x1="50" y1="70" x2="40" y2="80" stroke="#ea4c16" stroke-width="3"/>
            <line x1="50" y1="75" x2="40" y2="85" stroke="#ea4c16" stroke-width="3"/>
          </svg>`,
        equisA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="20" x2="80" y2="80" stroke="#003366" stroke-width="10" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#003366" stroke-width="10" />
          </svg>`,
        equisN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <line x1="20" y1="20" x2="80" y2="80" stroke="#ea4c16" stroke-width="10" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#ea4c16" stroke-width="10" />
          </svg>`,
        trianguloA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,20 80,75 20,75" fill="#003366" />
          </svg>`,
        trianguloN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,20 80,75 20,75" fill="#ea4c16" />
          </svg>`,
        lineasA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="25" width="70" height="20" fill="#003366" />
            <rect x="15" y="60" width="70" height="20" fill="#003366" />
          </svg>`,
        lineasN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="15" y="25" width="70" height="20" fill="#ea4c16" />
            <rect x="15" y="60" width="70" height="20" fill="#ea4c16" />
          </svg>`,
        inicioBA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="35" width="35" height="35" fill="white" stroke="#003366" stroke-width="4" />
            <rect x="42" y="42" width="58" height="20" fill="#003366" />
          </svg>`,
        curvaBA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 25 Q15 50, 30 75" stroke="#003366" stroke-width="14" fill="none" stroke-linecap="round"/>
            <rect x="38" y="42" width="62" height="20" fill="#003366"/>
          </svg>`,
        lineaBA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="42" width="100" height="20" fill="#003366" />
          </svg>`,
        curvaFBA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 25 Q85 50, 70 75" stroke="#003366" stroke-width="14" fill="none" stroke-linecap="round"/>
            <rect x="0" y="42" width="62" height="20" fill="#003366"/>
          </svg>`,
        finBA: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="55" y="35" width="35" height="35" fill="white" stroke="#003366" stroke-width="4" />
            <rect x="0" y="42" width="58" height="20" fill="#003366" />
          </svg>`,
        inicioBN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="35" width="35" height="35" fill="white" stroke="#ea4c16" stroke-width="4" />
            <rect x="42" y="42" width="58" height="20" fill="#ea4c16" />
          </svg>`,
        curvaBN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 25 Q15 50, 30 75" stroke="#ea4c16" stroke-width="14" fill="none" stroke-linecap="round"/>
            <rect x="38" y="42" width="62" height="20" fill="#ea4c16"/>
          </svg>`,
        lineaBN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="42" width="100" height="20" fill="#ea4c16" />
          </svg>`,
        curvaFBN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 25 Q85 50, 70 75" stroke="#ea4c16" stroke-width="14" fill="none" stroke-linecap="round"/>
            <rect x="0" y="42" width="62" height="20" fill="#ea4c16"/>
          </svg>`,
        finBN: `
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="55" y="35" width="35" height="35" fill="white" stroke="#ea4c16" stroke-width="4" />
            <rect x="0" y="42" width="58" height="20" fill="#ea4c16" />
          </svg>`
      };

      return svgMap[icono] || null;
    }

    document.querySelectorAll('.icono').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedTooth) return;
        const icono = btn.dataset.icono;
        const svgContent = getSVG(icono);
        if (!svgContent) return;

        const diente = document.querySelector(`.diente[data-num="${selectedTooth}"]`);
        diente.innerHTML = svgContent;
        diente.className = 'diente custom-svg';

        const lbl = document.createElement('div');
        lbl.className = 'numero';
        lbl.textContent = selectedTooth;
        diente.appendChild(lbl);

        document.querySelector('#previewDiente .numero').textContent = selectedTooth;
        document.querySelectorAll('#previewDiente .cara').forEach(c => c.className = 'cara ' + c.dataset.cara);
      });
    });
    
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
        $("#txtPaciente").html(nombrePac);
    }
})