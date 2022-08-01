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
            var oViewModel = new JSONModel({
                isPhone: Device.system.phone
            });
            this.getView().setModel(oViewModel, "view");
            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
            this.oView = this.getView();
        },

        onAfterRendering: function (oEvent) {
			var oRootPath = jQuery.sap.getModulePath("softtek.sostenibilidadmenu");

			var sPath = oRootPath;
			if (!sap.ui.Device.system.phone) {
				sPath = sPath + "/images/homeImage.jpg";
				this.byId("imgBanner2").setSrc(sPath);
				//this.byId("imgBanner2").setHeight("30rem");
			} else {
				sPath = sPath + "/images/homeImage_small.jpg";
				this.byId("imgBanner2").setSrc(sPath);
			}

		}
    });
});
