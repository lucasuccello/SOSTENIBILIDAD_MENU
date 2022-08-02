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
            oController = this;

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
            });
            oController._navToDetail();
        },

        _navToDetail: function(){
            oController.byId("pageContainer").to(oController.createId("O"));
        }
    });
});
