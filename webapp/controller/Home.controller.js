sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/Device',
    "../model/formatter",
    "sap/ui/core/Fragment"
], function (BaseController, JSONModel, Device, formatter, Fragment) {
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

            //ODS Model detail
            var oODSModel = new JSONModel({});
            this.getView().setModel(oODSModel, "ODSModelDetail");

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

        onNavODSDetail: function(oEvent){
            // let oODSList = this.getModel("ODSModel").getProperty("/ODSList"),
            //     sIdODS = oEvent.getSource().data("idODS"),
            //     oODS = oODSList.find(oElement => oElement.Id === sIdODS);
            let oODS = oEvent.getSource().getBindingContext("ODSModel").getObject();
            this.getModel("ODSModelDetail").setData(oODS);
            oController.byId("pageContainer").to(oController.getView().createId('O'));
        },

        onOpenDialogDetail: function(oEvent){
            let oODS = oEvent.getSource().getBindingContext("ODSModel").getObject();
            this.getModel("ODSModelDetail").setData(oODS);

            Fragment.load({
                name: "softtek.sostenibilidadmenu.view.Fragments.DialogDetalle",
                controller: oController,
                id: oController.getView().getId()
            }).then(function (oPopup) {
                oController._oDialogDetail = oPopup;
                oController.getView().addDependent(oPopup);
                oController._oDialogDetail.attachAfterClose(function (oEvent) {
                    oEvent.getSource().destroy();
                });

                oController._oDialogDetail.open();
            });
        },

        onCloseDialog: function () {
			oController._oDialogDetail.close();
		},
    });
});
