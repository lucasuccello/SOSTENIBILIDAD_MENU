sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/Device',
    "../model/formatter"
], function (BaseController, JSONModel, Device, formatter) {
    "use strict";
    var oController;
    var oJSONModel = new JSONModel();
    return BaseController.extend("softtek.sostenibilidadmenu.controller.Home", {
        formatter: formatter,

        onInit: function () {
            var oRootPath = jQuery.sap.getModulePath("softtek.sostenibilidadmenu");
            var oViewModel = new JSONModel({
                isPhone: Device.system.phone,
                selectedMenuItem: "I",
                rootPath: oRootPath
            });
            this.getView().setModel(oViewModel, "view");

            //ODS Model
            var oODSModel = new JSONModel({});
            this.getView().setModel(oODSModel, "ODSModel");

            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        },

        onAfterRendering: function(){
            oController = this;
        },
        
        onSelectItem: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();
			this.byId("pageContainer").to(this.getView().createId(sKey));
		},

        onNavODS4: function(){
            var sRootPath = oController.getModel("view").getProperty("/rootPath");
            oController.getModel("ODSModel").setData({
                titulo: "Objetivo 4",
                subTitulo: "Educación de calidad",
                icono: sRootPath + "/images/IconDetailODS4.png",
                imagen: sRootPath + "/images/ODS4.jpg",
                descripcion: oController.getResourceBundle().getText("det_descODS4")
            });
            oController._navToDetail();
        },

        onNavODS5: function(){
            var sRootPath = oController.getModel("view").getProperty("/rootPath");
            oController.getModel("ODSModel").setData({
                titulo: "Objetivo 5",
                subTitulo: "Igualdad de género",
                icono: sRootPath + "/images/IconDetailODS5.png",
                imagen: sRootPath + "/images/ODS5.jpg",
                descripcion: oController.getResourceBundle().getText("det_descODS5")
            });
            oController._navToDetail();
        },

        _navToDetail: function(){
            oController.byId("pageContainer").to(oController.getView().createId('O'));
        }
    });
});
