/// <reference path="../js/jquery.js" />

/*
 * Plugin creado por Gabriel Espinoza Erices gab.espinoza@gmail.com
 * 
 * Descripción:
 * Complementa el funcionamiento de un asp:TreeView que muestre los Checkboxes.
 *   - Añade selección de hijos si se selecciona padre
 *   - Quita selección del padre en caso que se quite la selección de uno de los hijos
 *   - Añade extensibilidad al hacer override sobre los eventos de anchor_click y cb_click
*/
(function ($) {
    $.fn.aspTreeView = function (options) {
        //Se declaran los métodos del plugin. Se deben declarar antes de llamarlos
        var methods = {
            init: function (tv) {
                /// <summary> Inicializa el treeView, si ya fue inicializado, no hace nada. </summary>
                /// <param name="tv">TreeView a inicializar</param>
                return $(tv).each(function () {
                    var isInitialized = $(this).data('TreeViewInitialized');
                    if (!isInitialized) {
                        $(this).data('TreeViewInitialized', true);

                        methods.cb_init($(this));
                        methods.anchor_init($(this));
                    }
                });
            },
            cb_init: function (tv) {
                /// <summary> Inicializa los checkboxes del TreeView añadiendoles los parámetros necesarios para el funcionamiento y el evento change </summary>
                /// <param name="tv">TreeView objetivo</param>
                var cbs = tv.find('input[type=checkbox]');
                cbs.data('tv_id', tv.attr('id'));
                cbs.data('type', 'checkbox');
                cbs.bind('change.aspTreeView', settings.cb_change);
            },
            anchor_init: function (tv) {
                /// <summary> Inicializa los anchors del TreeView añadiendoles los parámetros necesarios para el funcionamiento</summary>
                /// <param name="tv">TreeView objetivo</param>
                var anchors = tv.find("a[href^='javascript:__doPostBack']");

                anchors.data("tv_id", tv.attr('id'));
                anchors.data("type", "anchor");
                anchors.each(function () {
                    var nodeIndex = methods.getNodeIndex(document.getElementById($(this).attr("id")));
                    var checkBoxId = $(this).data('tv_id') + "n" + nodeIndex + "CheckBox";
                    var cb = $('#' + checkBoxId);

                    var href = $(this).attr("href");
                    var splitted = (href.split("'")[href.split("'").length - 2]).substring(1).split("\\");
                    var nodeValue = splitted[splitted.length - 1]; // obtiene el value del nodo
                    var nodeText = $(this).text();

                    cb.data('node', { text: nodeText, value: nodeValue });
                });

                anchors.removeAttr('href');
                anchors.css('cursor', 'pointer');
                anchors.css('text-decoration', '');//tweak porque microsoft añade text-decoration:none sin motivo aparente al usar updatePanel
                anchors.addClass('tree-context-menu');
                anchors.bind('click.aspTreeView', settings.anchor_click);
            },

            cb_change: function (event) {
                /// <summary>Evento change por defecto del checkbox.</summary>
                methods.toggleChildCheckBoxes(event.target);
                methods.toggleParentCheckBox(event.target);
            },
            anchor_click: function (event) {
                /// <summary>Evento click por defecto de los anchor.</summary>

                var tv_id = $(event.target).data("tv_id");

                var nodeIndex = methods.getNodeIndex(event.target);
                var checkBoxId = tv_id + "n" + nodeIndex + "CheckBox";
                var checkBox = document.getElementById(checkBoxId);

                checkBox.checked = !checkBox.checked;
                $(checkBox).change();
            },

            toggleChildCheckBoxes: function (checkBox) {
                /// <summary>
                /// Cambia de estado los hijos del checkbox
                /// </summary
                /// <param name="checkBox">Checkbox que se acaba de clickear</param>

                var postfix = "n";
                var tv = $(checkBox).data("tv_id");
                var childContainerId = tv + postfix + methods.getNodeIndex(checkBox) + "Nodes";
                $("#" + childContainerId).find("input[type=checkbox]").attr("checked", checkBox.checked);
            },
            toggleParentCheckBox: function (checkBox) {
                /// <summary>
                /// Cambia el estado de los checkboxes padre del que fue clickeado
                /// </summary
                /// <param name="checkBox">Checkbox que se acaba de clickear</param>

                var tv = $(checkBox).data("tv_id");

                if (checkBox.checked == false) {
                    var parentContainer = methods.getParentNodeById(checkBox, tv);
                    if (parentContainer) {
                        var parentCheckBoxId = parentContainer.id.substring(0, parentContainer.id.search("Nodes")) + "CheckBox";

                        var parentCheckBox = document.getElementById(parentCheckBoxId);
                        if (parentCheckBox && $(parentCheckBox).data("type") == "checkbox") {
                            parentCheckBox.checked = false;
                            methods.toggleParentCheckBox(parentCheckBox);
                        }
                    }
                }
            },

            getNodeIndex: function (element) {
                /// <summary>
                /// Retorna el índice del checkbox o link clickeados
                /// </summary>
                /// <param name="element">Elemento clickeado</param>

                var nodeIndex;

                var tv_id = $(element).data("tv_id");
                var type = $(element).data('type');

                if (type == 'anchor') {
                    nodeIndex = element.id.substring((tv_id + 't').length);
                }
                else if (type == 'checkbox') {
                    nodeIndex = element.id.substring((tv_id + "n").length, element.id.indexOf("CheckBox"));
                }
                else { throw new Error('No se reconoce el tipo en el atributo data-type. Debe ser "anchor" o "checkbox"'); }
                return nodeIndex;
            },
            getParentNodeById: function (element, treeViewId) {
                /// <summary>
                /// Retorna el ID del contenedor padre si la checkbox actual no está checkeada
                /// </summary
                /// <param name="element">Elemento clickeado que se acaba de clickear</param>

                var parent = element.parentNode;
                if (parent == null) {
                    return false;
                }
                if (parent.id.search(treeViewId) == -1) {
                    return this.getParentNodeById(parent, treeViewId);
                }
                else {
                    return parent;
                }
            },

            destroy: function () {
                $.error('No se ha difinido el método destroy. SE DEBE DEFINIR.');
                //TODO: Eliminar atributos .data() agregados por el plugin.
                //TODO: Desbindear eventos click y change
            },

            getCheckedNodes: function () {
                /// <summary> Obtiene los nodos checkeados Arreglo de objetos(text, value) </summary>
                var selectedNodes = [];
                var cont = 0;
                this.find(":checked").each(function () {
                    var node = {
                        text: $(this).data('node').text,
                        value: $(this).data('node').value
                    };
                    selectedNodes[cont] = node;
                    cont++;
                });

                return selectedNodes;
            },

            uncheckAll: function () {
                /// <summary>
                /// Quita la selección de todas las checkboxes
                /// </summary>

                this.find("input[type=checkbox]").attr("checked", false);
            },
            
            checkNodes: function (selectedNodesValues) {
                /// <summary>
                /// Seleccione los nodos cuyo value coincida con los enviados por parámetro
                /// </summary>
                /// <param name="selectedNodesValues">Arreglo de Id de las categorías a seleccionar</param>
                /// <remarks>
                /// Note que si chekea un nodo padre, también se chekearán sus hijos ya que se ejecuta el evento change del checkbox.
                /// </remarks>
                if (selectedNodesValues instanceof Array) {
                    for (i = 0; i < selectedNodesValues.length; i++) {
                        this.CheckNodes(selectedNodesValues[i]);
                    }
                }
                else {
                    this
                        .find("input[type=checkbox]")
                        .filter(function () {
                            return $(this).data('node') && $(this).data('node').value == selectedNodesValues;
                        })
                        .attr("checked", true)
                        .change();
                }
            }
        };

        // Une las configuraciones por defecto con las configuraciones del usuario
        var settings = $.extend({
            cb_change: methods.cb_change,
            anchor_click: methods.anchor_click
        }, options);

        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof options === 'object' || !options) {
            return methods.init.apply(this, this);
        }
        else {
            $.error('Método ' + options + ' no existe en jQuery.aspTreeView');
        }
    };
})(jQuery);
