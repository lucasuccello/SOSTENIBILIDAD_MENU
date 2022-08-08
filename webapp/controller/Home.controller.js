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
                rootPath: oRootPath,
                showFooter: true
            });
            this.getView().setModel(oViewModel, "view");

            //ODS Model detail
            var oODSModel = new JSONModel({});
            this.setModel(oODSModel, "ODSModelDetail");

            this.setModel(this.getModel("ODSModel"));

            Device.media.attachHandler(function (oDevice) {
                this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
            }.bind(this));
        },

        onAfterRendering: function () {
            oController = this;
        },

        onSelectItem: function (oEvent) {
            let sKey = oEvent.getParameter("item").getKey();
            let oToolPage = this.byId("toolPage");

            if (sKey === 'E') {
                //expandir o ocultar menu
                let bSideExpanded = oToolPage.getSideExpanded();
                oToolPage.setSideExpanded(!bSideExpanded);
            } else {
                //"navegar" a tab seleccionado
                this.byId("pageContainer").to(this.getView().createId(sKey));
                //se oculta el menu
                if (sKey !== "I") {
                    oToolPage.setSideExpanded(false);
                } else {
                    oToolPage.setSideExpanded(true);
                }

            }
        },

        onNavODSDetail: function (oEvent) {
            let vFootPrintUri = "https://my011073.sapbydesign.com/sap/public/testdrive/runtime/run?key=%7bXO%7b8xrR7ks4sFmFK0lssm";
            // let oODSList = this.getModel("ODSModel").getProperty("/ODSList"),
            //     sIdODS = oEvent.getSource().data("idODS"),
            //     oODS = oODSList.find(oElement => oElement.Id === sIdODS);

            //obtener datos del ODS seleccionado
            let oBindingContext = oEvent.getSource().getBindingContext("ODSModel");

            if (!oBindingContext) {
                oBindingContext = oEvent.getSource().getBindingContext();
            }

            let oODS = oBindingContext.getObject(),
                sPath = oBindingContext.getPath();

            if (oODS.Id === "ODS13") {
                window.open(vFootPrintUri);
            } else {


                //setear modelo default con el local (quitar esto cuando conecte con un odata)
                // oController.byId("pageDetalle").setModel(this.getModel("ODSModel")); //se ajustó en el manifest como modelo principal
                // oController.byId("pageDetalle").bindObject(sPath);

                //modelo local usado para agarrar los cambios que se hagan en configuraciones
                this.getModel("ODSModelDetail").setData(oODS);

                //"navegar" a vista de detalle
                // oController.byId("pageContainer").to(oController.getView().createId('O'));
                //ajuste para que funcione deployado en launchpad
                let sIdPage = this.getView().createId("O");
                this.byId(sIdPage).bindObject(sPath);
                this.byId("pageContainer").to(sIdPage);

            }
        },

        onOpenDialogDetail: function (oEvent) {
            let oBindingContext = oEvent.getSource().getBindingContext("ODSModel"),
                oODS = oBindingContext.getObject(),
                sPath = oBindingContext.getPath();

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

                oController._oDialogDetail.setModel(oController.getModel("ODSModelDetail"), "ODSModelDetail");
                oController._oDialogDetail.bindObject(sPath);
                oController._oDialogDetail.open();
            });
        },

        onCloseDialog: function () {
            oController._oDialogDetail.close();
        },

        onSave: function (oEvent) {
            var oView = this.byId(this.getView().createId("O")),
                sPathODS = oView.getBindingContext().getPath(),
                oData = this.getModel("ODSModelDetail").getData();

            oView.getModel().setProperty(sPathODS, oData);
            oView.getModel().refresh(true);

            MessageToast.show("Datos actualizados exitosamente");
        },

        onChangeSection: function (oEvent) {
            if (oEvent.getParameter("section").getId().includes('CON')) {
                this.getModel("view").setProperty("/showFooter", true);
            } else {
                this.getModel("view").setProperty("/showFooter", false);
            }
        },

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
