define([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'esri/layers/FeatureLayer',
    'esri/dijit/PopupTemplate',
    'dojo/dom-construct',
    'dojo/dom',
    'dojo/on'
], function(declare, BaseWidget, FeatureLayer, PopupTemplate, domConstruct, dom, on) {
    return declare([BaseWidget], {
        // Define las propiedades del widget
        baseClass: 'widget-info-window',
        infoWindowTemplate: null,
        featureLayer: null,
        featureLayerUrl: '',

        // Método que se ejecuta cuando se carga el widget
        startup: function() {
            this.inherited(arguments);
            console.log('InfoWindow Widget started');

            // Cargar hoja de estilos personalizada
            var css = document.createElement('link');
            css.setAttribute('rel', 'stylesheet');
            css.setAttribute('type', 'text/css');
            css.setAttribute('href', this.folderUrl + 'css/style.css');
            document.getElementsByTagName('head')[0].appendChild(css);

            // Obtener la plantilla HTML personalizada de InfoWindow desde el archivo InfoWindowTemplate.html
            this.infoWindowTemplate = new PopupTemplate({
                title: '{NAME}',
                description: dojo.cache(this.manifest.name.replace(/\./g, '/') + '/templates', 'InfoWindowTemplate.html')
            });

            // Cargar la capa de entidades
            this.featureLayer = new FeatureLayer(this.featureLayerUrl, {
                outFields: ['*'],
                infoTemplate: this.infoWindowTemplate
            });

            // Añadir la capa de entidades al mapa
            this.map.addLayer(this.featureLayer);

            // Escuchar eventos de clic en el mapa para mostrar la ventana de información (InfoWindow)
            on(this.map, 'click', this._onMapClick.bind(this));
        },

        // Método que se ejecuta cuando se hace clic en el mapa
        _onMapClick: function(evt) {
            // Ocultar la ventana de información (InfoWindow) si ya está abierta
            this.map.infoWindow.hide();

            // Realizar una consulta en la capa de entidades para obtener las entidades cercanas al punto de clic
            var query = new esri.tasks.Query();
            query.geometry = evt.mapPoint;
            query.distance = 10;
            query.units = 'miles';
            query.spatialRelationship = esri.tasks.Query.SPATIAL_REL_INTERSECTS;
            this.featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(features) {
                // Mostrar la ventana de información (InfoWindow) si se encontraron entidades cercanas al punto de clic
                if (features.length > 0) {
                    this.map.infoWindow.setFeatures(features);
                    this.map.infoWindow.show(evt.mapPoint);
                }
            }.bind(this));
        }
    });
});
