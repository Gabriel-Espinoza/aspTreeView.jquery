aspTreeView.jquery.js
==================

El plugin aspTreeView.jquery.js es un plugin de jQuery que permite extender la funcionalidad por defecto que ofrece Microsoft.

Requiere:
 - Activar ShowCheckBoxes="All" 
 
Caracter�sticas:
 - Al seleccionar nodo un padre se seleccionan autom�ticamente todos sus hijos
 - Al seleccionar un hijo se quita la selecci�n del padre
 - Permite hacer override sobre los eventos change de los checkbox y click de los anchors
 
 Uso:
  Simplemente inicializar el plugin de javascript como se har�a con cualquier plugin
  $("#miTreeView").aspTreeView(opt);
  
  El plugin soporta una serie de opciones para llamar a m�todos
  opt {
	cb_change: methods.cb_change,  // m�todo que se llama al cambiar el estado de un checkbox (evento change)
	anchor_click: methods.anchor_click, // m�todo que se llama al clickear un anchor (evento click)
	menu: null, // arreglo de items que debe llevar el men� contextual (requiere http://www.trendskitchens.co.nz/jquery/contextmenu/)
	override_menu: false, // Si los items del men� deben sobre-escribir los items por defecto
	show_menu: true  // Booleano que permite mostrar o no el men� contextual
  }
	
	Men� por defecto (requiere http://www.trendskitchens.co.nz/jquery/contextmenu/)
  opt.menu = [
            { id: 'checkChildren', text: 'Seleccionar Hojas', callback: methods.menu_checkChildren }, // Checkea todos las hojas del padre seleccionado
            { id: 'uncheckChildren', text: 'Quitar Selecci�n de Hojas', callback: methods.menu_uncheckChildren } // Quita el checkeo de las hojas del padre seleccionado
        ];
 
 Otros:
 - Versi�n minified creada con http://jscompress.com/
 - Men� contextual gracias a: http://www.trendskitchens.co.nz/jquery/contextmenu/
 - L�gica de marcar hijos y padres por: http://www.mikeborozdin.com/post/ASPNET-TreeView-and-Checkboxes.aspx
 
 Pr�ximos avances:
  - Crear p�gina de demo
  - Mostrar como funciona con UpdatePanel