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
    var idPaciente = localStorage.getItem("idPaciente");
    var fechaAct = fechaActual();
    const estados = ['caries','resina','amalgama','sellante','realizado'];
    const menu = document.getElementById('menuContextual');;
    let selectedTooth = null, selectedFace = null;
    const caras = [
      {c:"sup", points:"0,0 100,0 75,25 25,25"},
      {c:"izq", points:"1,0 25,25 25,75 0,100"},
      {c:"cen", points:"25,25 75,25 75,75 25,75"},
      {c:"der", points:"100,0 100,100 75,75 75,25"},
      {c:"inf", points:"25,75 75,75 100,100 0,100"}
    ];

    //Crear odontrograma al inicar la aplicacion
    crearFilaSeparada([18,17,16,15,14,13,12,11], [21,22,23,24,25,26,27,28],'fila-superior');
    crearFilaSeparada([55,54,53,52,51], [61,62,63,64,65],'fila-temporal-superior');
    crearFilaSeparada([85,84,83,82,81], [71,72,73,74,75],'fila-temporal-inferior');
    crearFilaSeparada([48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38],'fila-inferior');

    //Metodos Iniciales
    cargarUsuario();
    cargarOdontograma();
    cargarObservaciones();

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
    $("#btnLimpiarDiente").click(function () {
      if (!selectedTooth) return;
      if (!confirm("¿Desea limpiar completamente el diente?")) return;
      const diente = document.querySelector(`.diente[data-num="${selectedTooth}"]`);

      if (diente.classList.contains('custom-svg')) {
        const fila = diente.parentElement;
        const nuevo = crearDiente(selectedTooth);
        fila.replaceChild(nuevo, diente);
      } else {
        diente.querySelectorAll('.cara').forEach(c => {
          estados.forEach(e => c.classList.remove(e));
        });
      }
      selectTooth(selectedTooth);
    });
    $('#btnGuardar').click(() => {
      guardarOdontograma();
    });
    $('#btnGuardarObservacion').click(() => {
      guardarObservacion();
    });

    //METODOS
    //Crear el diente
    function crearDiente(num) {
      const d = document.createElement('div');
      d.className = 'diente';
      d.dataset.num = num;
      d.addEventListener('click', () => selectTooth(num));

      const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
      svg.setAttribute("viewBox","0 0 100 100");
      svg.style.width="100%";
      svg.style.height="100%";

      caras.forEach(f=>{
        const p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
        p.setAttribute("points",f.points);
        p.setAttribute("class","cara "+f.c);
        p.setAttribute("data-cara",f.c);
        svg.appendChild(p);
      });

      d.appendChild(svg);

      const lbl=document.createElement('div');
      lbl.className='numero';
      lbl.textContent=num;
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
      document.querySelectorAll('.diente').forEach(d => d.classList.remove('activo'));

      const actual = document.querySelector(`.diente[data-num="${num}"]`);
      actual.classList.add('activo');

      const preview = document.getElementById("previewDiente");

      if(actual.classList.contains('custom-svg')){
        preview.innerHTML = actual.innerHTML;
      }else{
        preview.innerHTML = "";

        const svgPreview = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svgPreview.setAttribute("viewBox","0 0 100 100");
        svgPreview.style.width="80px";
        svgPreview.style.height="80px";

        caras.forEach(f=>{
          const p=document.createElementNS("http://www.w3.org/2000/svg","polygon");
          p.setAttribute("points",f.points);
          p.setAttribute("class","cara "+f.c);
          p.setAttribute("data-cara",f.c);
          svgPreview.appendChild(p);
        });

        preview.appendChild(svgPreview);

        const lbl=document.createElement("div");
        lbl.className="numero";
        lbl.textContent=num;
        preview.appendChild(lbl);

        svgPreview.querySelectorAll('.cara').forEach(pv => {

          const orig = document.querySelector(
            `.diente[data-num="${num}"] svg .cara[data-cara="${pv.dataset.cara}"]`
          );

          estados.forEach(e=>{
            if(orig && orig.classList.contains(e)){
              pv.classList.add(e);
            }
          });

        });

        activarEventosPreview();
      }
    }

    function activarEventosPreview() {
      document.querySelectorAll('#previewDiente .cara').forEach(pv => {
        pv.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          if (!selectedTooth) return;
          selectedFace = this;
          showMenu(e.clientX, e.clientY);
        });
      });
    }

    //Items del menu flotante
    if(menu){
      menu.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
          if (!selectedFace || !selectedTooth) return;
          const estado = li.dataset.estado;
          estados.forEach(e => selectedFace.classList.remove(e));
          if (estado) selectedFace.classList.add(estado);
          const cara = selectedFace.dataset.cara;
          const mainFace = document.querySelector(`.diente[data-num="${selectedTooth}"] svg .cara[data-cara="${cara}"]`);
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
        diente.dataset.num = selectedTooth;

        const lbl = document.createElement('div');
        lbl.className = 'numero';
        lbl.textContent = selectedTooth;
        diente.appendChild(lbl);

        const preview = document.getElementById("previewDiente");
        preview.innerHTML = diente.innerHTML;

        const lblPreview = document.createElement('div');
        lblPreview.className = 'numero';
        lblPreview.textContent = selectedTooth;
        preview.appendChild(lblPreview);
      });
    });

    //Obtener el estado actual del odontograma
    function obtenerOdontograma(){
      const datos = {
        pacienteId: idPaciente,
        fechaActualizacion: fechaAct,
        dientes: {}
      };

      document.querySelectorAll('.diente').forEach(d => {
        const num = d.dataset.num;
        if (!num) return;
        const dienteData = {};

        if (d.classList.contains('custom-svg')) {
          dienteData.tipo = 'icono';
          dienteData.icono = d.querySelector('svg')?.outerHTML || '';
        } else {
          dienteData.tipo = 'normal';
          dienteData.caras = {};

          d.querySelectorAll('.cara').forEach(c => {
            let estado = '';
            estados.forEach(e => {
              if (c.classList.contains(e)) estado = e;
            });
            dienteData.caras[c.dataset.cara] = estado;
          });
        }
        datos.dientes[num] = dienteData;
      });
      return datos;
    }

    //Actualizar o insertar odontograma actual
    function guardarOdontograma(){
      const odontograma = obtenerOdontograma();

      firebase.database().ref('Odontogramas/' + idPaciente).set(odontograma)
      .then(() => {
          var alert = "<div class='alert alert-success'>";
          alert += "<a class='close' data-dismiss='alert'> × </a> <strong> El odontograma ha sido actualizado! </strong>";
          alert += "</div>";
          $('#alerta').html(alert);
          setTimeout(()=>{
            $('#alerta').css('display', 'none');
          },2000);
      }).catch((error) => {
          var alert = "<div class='alert alert-danger'>";
          alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Error al guardar el odontograma! </strong>";
          alert += "</div>";
          $("#alerta").html(alert);
          setTimeout(()=>{
            $('#alerta').css('display', 'none');
          },2000);
      });
    }

    //Cargar odontograma existente
    function cargarOdontograma(){
      firebase.database().ref('Odontogramas/' + idPaciente).once('value')
      .then(odontograma => {
        if(!odontograma.exists()) return;
        
        const data = odontograma.val();

        if(!data.dientes) return;

        Object.keys(data.dientes).forEach(num => {
          const dienteData = data.dientes[num];
          const diente = document.querySelector(`.diente[data-num="${num}"]`);
          if(!diente) return;

          if(dienteData.tipo === "icono"){
            const svgContent = dienteData.icono;
            diente.innerHTML = svgContent;
            diente.className = "diente custom-svg";
            diente.dataset.num = num;
            const lbl = document.createElement("div");
            lbl.className = "numero";
            lbl.textContent = num;
            diente.appendChild(lbl);
          }

          if(dienteData.tipo === "normal"){
            if(!dienteData.caras) return;
            Object.keys(dienteData.caras).forEach(cara => {
              const estado = dienteData.caras[cara];
              if(!estado) return;
              const face = diente.querySelector(`.cara[data-cara="${cara}"]`);
              if(face){
                face.classList.add(estado);
              }
            });
          }
        });
      });
    }

    //Guardar la observacion con la fecha y hora actuales
    function guardarObservacion(){
      const texto = $('#txtObservacion').val().trim();

      if(texto === "") return;

      const datos = {
        fecha: fechaHoraActual(),
        observacion: texto,
        timestamp: Date.now()
      };

      firebase.database().ref('Observaciones/' + idPaciente).push(datos)
      .then(() => {
        $('#txtObservacion').val("");
        cargarObservaciones();
      })
      .catch(() =>{
        var alert = "<div class='alert alert-danger'>";
        alert += "<a class='close' data-dismiss='alert'> × </a> <strong> Error al guardar la observación!</strong>";
        alert += "</div>";
        $("#alerta").html(alert);
        setTimeout(()=>{
          $('#alerta').css('display', 'none');
        },2000);
      });
    }

    //Cargar observaciones del paciente seleccionado
    function cargarObservaciones(){
      const contenedor = $('.lista-observaciones');
      contenedor.html("");

      firebase.database().ref('Observaciones/' + idPaciente).orderByChild('timestamp').once('value')
      .then(snapshot => {
        if(!snapshot.exists()) return;
        const datos = [];
        snapshot.forEach(item => {
            datos.push(item.val());
        });
        datos.reverse();
        datos.forEach(obs => {
          const item = `
            <div class="observacion-item">
              <div class="observacion-top">
                <span class="observacion-fecha">${obs.fecha}</span>
              </div>
              <div class="observacion-texto">
                ${obs.observacion}
              </div>
            </div>
          `;

          contenedor.append(item);
        });
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

    function fechaHoraActual() {
      const d = new Date();

      let año = d.getFullYear();
      let mes = String(d.getMonth() + 1).padStart(2, '0');
      let dia = String(d.getDate()).padStart(2, '0');

      let hora = String(d.getHours()).padStart(2, '0');
      let minuto = String(d.getMinutes()).padStart(2, '0');
      let segundos = String(d.getMinutes()).padStart(2, '0');

      return `${año}-${mes}-${dia} ${hora}:${minuto}:${segundos}`;
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