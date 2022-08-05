sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    'sap/ui/Device',
    "../model/formatter",
    "sap/ui/core/Fragment",
    'sap/m/MessageToast'
], function (BaseController, JSONModel, Device, formatter, Fragment, MessageToast) {
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

            this.setModel(this.getModel("ODSModel"));

            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        },

        onAfterRendering: function(){
            oController = this;
        },
        
        onSelectItem: function (oEvent) {
			var sKey = oEvent.getParameter("item").getKey();

            //"navegar" a tab seleccionado
			this.byId("pageContainer").to(this.getView().createId(sKey));
		},

        onNavODSDetail: function(oEvent){
            // let oODSList = this.getModel("ODSModel").getProperty("/ODSList"),
            //     sIdODS = oEvent.getSource().data("idODS"),
            //     oODS = oODSList.find(oElement => oElement.Id === sIdODS);

            //obtener datos del ODS seleccionado
            let oBindingContext = oEvent.getSource().getBindingContext("ODSModel");

            if(!oBindingContext){
                oBindingContext = oEvent.getSource().getBindingContext();
            }
                
            let oODS = oBindingContext.getObject(),
            sPath = oBindingContext.getPath();
            
            //setear modelo default con el local (quitar esto cuando conecte con un odata)
            oController.byId("pageDetalle").setModel(this.getModel("ODSModel"));
            oController.byId("pageDetalle").bindObject(sPath);

            //modelo local usado para agarrar los cambios que se hagan en configuraciones
            this.getModel("ODSModelDetail").setData(oODS);

            //"navegar" a vista de detalle
            oController.byId("pageContainer").to(oController.getView().createId('O'));
        },

        onOpenDialogDetail: function(oEvent){
            let oODS = oEvent.getSource().getBindingContext("ODSModel").getObject();

            //se setea modelo json con los datos del ODS seleccionado
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

        onSave: function(oEvent){
            var sPathODS = oController.byId("pageDetalle").getBindingContext().getPath(),
                oData = this.getModel("ODSModelDetail").getData();
            
            oController.byId("pageDetalle").getModel().setProperty(sPathODS, oData);
            oController.byId("pageDetalle").getModel().refresh(true);

            MessageToast.show("Datos actualizados exitosamente");
        }

        // _cargarKpis: function(oODS){
        //     //armar card de graficos
        //     let oGraficos = this.getModel("DashboardModel").getData(),
        //         oCard = {},
        //         aCards = [];
        //     oODS.indicadores.map(function(indicador) {
        //         indicador.DatosKPIs.map(kpi => {
        //             kpi.vizProperties = oGraficos[kpi.tipo];
        //         });
        //     });
        //     return oODS;
        // }
    });
});
