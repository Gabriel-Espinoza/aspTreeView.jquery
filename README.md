aspTreeView.jquery.js
==================

El plugin aspTreeView.jquery.js es un plugin de jQuery que permite extender la funcionalidad por defecto que ofrece Microsoft.

Requiere:
 - Activar ShowCheckBoxes="All" 
 
Características:
 - Al seleccionar nodo un padre se seleccionan automáticamente todos sus hijos
 - Al seleccionar un hijo se quita la selección del padre
 - Permite hacer override sobre los eventos change de los checkbox y click de los anchors
 
 Uso:
  Simplemente inicializar el plugin de javascript como se haría con cualquier plugin
  $("#miTreeView").aspTreeView(opt);
  
  El plugin soporta una serie de opciones para llamar a métodos
  opt {
	cb_change: methods.cb_change,  // método que se llama al cambiar el estado de un checkbox (evento change)
	anchor_click: methods.anchor_click, // método que se llama al clickear un anchor (evento click)
	menu: null, // arreglo de items que debe llevar el menú contextual (requiere http://www.trendskitchens.co.nz/jquery/contextmenu/)
	override_menu: false, // Si los items del menú deben sobre-escribir los items por defecto
	show_menu: true  // Booleano que permite mostrar o no el menú contextual
  }
	
	Menú por defecto (requiere http://www.trendskitchens.co.nz/jquery/contextmenu/)
  opt.menu = [
            { id: 'checkChildren', text: 'Seleccionar Hojas', callback: methods.menu_checkChildren }, // Checkea todos las hojas del padre seleccionado
            { id: 'uncheckChildren', text: 'Quitar Selección de Hojas', callback: methods.menu_uncheckChildren } // Quita el checkeo de las hojas del padre seleccionado
        ];
 
 Otros:
 - Versión minified creada con http://jscompress.com/
 - Menú contextual gracias a: http://www.trendskitchens.co.nz/jquery/contextmenu/
 - Lógica de marcar hijos y padres por: http://www.mikeborozdin.com/post/ASPNET-TreeView-and-Checkboxes.aspx
 
 Próximos avances:
  - Crear página de demo
  - Mostrar como funciona con UpdatePanel