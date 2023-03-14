define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/dom',
    'dojo/dom-construct',
    'dojo/on',
    'esri/InfoTemplate',
    'esri/layers/FeatureLayer',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'dijit/form/Button',
    'dojo/domReady!'
], function(
    declare,
    BaseWidget,
    dom,
    domConstruct,
    on,
    InfoTemplate,
    FeatureLayer,
    Query,
    QueryTask,
    Button
) {
    return declare([BaseWidget], {

        // Propiedades del widget
        name: 'VdInfoWindowSolar',
        baseClass: 'vd-info-window-solar',

        // Métodos que se ejecutan cuando se inicia el widget
        startup: function() {
            this.inherited(arguments);
            console.log('Widget iniciado!');

            // Configuración del InfoTemplate personalizado
            var infoTemplate = new InfoTemplate();
            infoTemplate.setTitle('<b>${Nombre}</b>');
            infoTemplate.setContent('<p>${Descripcion}</p>');

            // Creación de la capa de entidades y definición del InfoTemplate
            var featureLayer = new FeatureLayer('https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0', {
                outFields: ['Nombre', 'Descripcion']
            });
            featureLayer.setInfoTemplate(infoTemplate);

            // Creación de un botón para activar la ventana de información (InfoWindow)
            var button = new Button({
                label: 'Mostrar InfoWindow',
                onClick: function() {
                    var queryTask = new QueryTask(featureLayer.url);
                    var query = new Query();
                    query.where = '1=1';
                    queryTask.execute(query, function(featureSet) {
                        this.map.infoWindow.setContent(this._createInfoWindowContent(featureSet));
                        this.map.infoWindow.show(this.map.toScreen(featureSet.features[0].geometry.getCentroid()));
                    }.bind(this));
                }.bind(this)
            });

            // Añadir el botón al widget
            domConstruct.place(button.domNode, this.domNode);

            // Añadir la capa de entidades al mapa
            this.map.addLayer(featureLayer);
        },

        // Función que crea el contenido personalizado de la ventana de información (InfoWindow)
        _createInfoWindowContent: function(featureSet) {
            var content = '';
            featureSet.features.forEach(function(feature) {
                content += '<div><b>' + feature.attributes.Nombre + '</b></div>';
                content += '<div>' + feature.attributes.Descripcion + '</div><br>';
            });
            return content;
        }

    });
});
