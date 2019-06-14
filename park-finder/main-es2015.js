(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-map></app-map>\n<app-list></app-list>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/list/list.component.html":
/*!********************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/list/list.component.html ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"no-results\"\n     *ngIf=\"parks.length === 0\">\n  <h3>No Parks Found</h3>\n</div>\n<div class=\"has-results\"\n     *ngIf=\"parks.length > 0\">\n  <h3>{{parks.length}} Park{{parks.length === 1 ? '' : 's'}} Found</h3>\n  <ul>\n    <li *ngFor=\"let park of parks\">\n      <button class=\"name\"\n              (click)=\"onClickPark(park)\">{{park.place.name}}</button>\n      <span class=\"directions\"><a target=\"_blank\"\n           href=\"{{directionsUrl(park.place)}}\"\n           title=\"Directions\"><svg xmlns=\"http://www.w3.org/2000/svg\"\n               width=\"24\"\n               height=\"24\"\n               viewBox=\"0 0 24 24\">\n            <path\n                  d=\"M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z\" />\n            <path d=\"M0 0h24v24H0z\"\n                  fill=\"none\" /></svg></a></span></li>\n  </ul>\n</div>\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let AppComponent = class AppComponent {
    constructor() {
        this.title = 'park-list';
    }
};
AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
        styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
    })
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _map_map_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./map/map.component */ "./src/app/map/map.component.ts");
/* harmony import */ var _list_list_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./list/list.component */ "./src/app/list/list.component.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm2015/store.js");
/* harmony import */ var _state_reducers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./state.reducers */ "./src/app/state.reducers.ts");








let AppModule = class AppModule {
};
AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"], _map_map_component__WEBPACK_IMPORTED_MODULE_4__["MapComponent"], _list_list_component__WEBPACK_IMPORTED_MODULE_5__["ListComponent"]],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_6__["StoreModule"].forRoot(Object.assign({}, _state_reducers__WEBPACK_IMPORTED_MODULE_7__["actionReducerMap"]))],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/google-places.service.ts":
/*!******************************************!*\
  !*** ./src/app/google-places.service.ts ***!
  \******************************************/
/*! exports provided: GooglePlacesService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GooglePlacesService", function() { return GooglePlacesService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");



let GooglePlacesService = class GooglePlacesService {
    constructor() {
        this.setMap = (map) => {
            this.map = map;
            return this;
        };
        this.getParks = () => {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["bindCallback"])(this.nearbySearch)();
        };
        this.nearbySearch = (callback) => {
            const service = new google.maps.places.PlacesService(this.map);
            const request = {
                type: 'park',
                location: this.map.getCenter(),
                radius: 1500,
                bounds: this.map.getBounds(),
                fields: ['name', 'geometry']
            };
            service.nearbySearch(request, callback);
        };
    }
};
GooglePlacesService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], GooglePlacesService);



/***/ }),

/***/ "./src/app/list/list.component.scss":
/*!******************************************!*\
  !*** ./src/app/list/list.component.scss ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xpc3QvbGlzdC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/list/list.component.ts":
/*!****************************************!*\
  !*** ./src/app/list/list.component.ts ***!
  \****************************************/
/*! exports provided: ListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ListComponent", function() { return ListComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm2015/store.js");



let ListComponent = class ListComponent {
    constructor(store) {
        this.store = store;
        this.parks = [];
        this.store
            .select(state => state.parks)
            .subscribe(parks => {
            this.parks = parks;
        });
        this.store
            .select(state => state.origin)
            .subscribe(origin => {
            this.origin = origin;
        });
    }
    directionsUrl(place) {
        return `https://www.google.com/maps/dir/${this.origin.toUrlValue()}/${place.geometry.location.toUrlValue()}`;
    }
    onClickPark(park) {
        new google.maps.event.trigger(park.marker, 'click');
    }
    ngOnInit() { }
};
ListComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-list',
        template: __webpack_require__(/*! raw-loader!./list.component.html */ "./node_modules/raw-loader/index.js!./src/app/list/list.component.html"),
        styles: [__webpack_require__(/*! ./list.component.scss */ "./src/app/list/list.component.scss")]
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]])
], ListComponent);



/***/ }),

/***/ "./src/app/map/map.component.ts":
/*!**************************************!*\
  !*** ./src/app/map/map.component.ts ***!
  \**************************************/
/*! exports provided: MapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MapComponent", function() { return MapComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _google_places_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../google-places.service */ "./src/app/google-places.service.ts");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "./node_modules/@ngrx/store/fesm2015/store.js");
/* harmony import */ var _state_reducers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state.reducers */ "./src/app/state.reducers.ts");





const defaultCoords = {
    latitude: 36.8471508,
    longitude: -76.2953987
};
function getCoords() {
    return new Promise(resolve => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(position => resolve(position.coords), _ => resolve(defaultCoords), { timeout: 1000 });
        }
        else {
            resolve(defaultCoords);
        }
    });
}
let MapComponent = class MapComponent {
    constructor(googlePlacesService, store) {
        this.googlePlacesService = googlePlacesService;
        this.store = store;
        this.setupMap = (mapElement, latitude, longitude) => {
            this.map = new google.maps.Map(mapElement, {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            let debounceCenterChanged = setTimeout(() => { }, 0);
            const loadParkMarkersDebounced = () => {
                clearTimeout(debounceCenterChanged);
                debounceCenterChanged = setTimeout(() => {
                    this.loadParkMarkers();
                }, 500);
            };
            this.map.addListener('center_changed', loadParkMarkersDebounced);
            this.map.addListener('bounds_changed', loadParkMarkersDebounced);
            this.loadParkMarkers();
        };
        this.loadParkMarkers = () => {
            let oldMarkers = this.parks.map(park => park.marker);
            const infowindow = new google.maps.InfoWindow();
            this.googlePlacesService
                .setMap(this.map)
                .getParks()
                .subscribe(([results, status, pagination]) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }
                const parks = results.map(result => ({
                    place: result,
                    marker: createMarker(this.map, result)
                }));
                pagination.hasNextPage && pagination.nextPage();
                replaceMarkers(oldMarkers, parks.map(park => park.marker));
                this.store.dispatch({ type: _state_reducers__WEBPACK_IMPORTED_MODULE_4__["SET_PARKS"], payload: parks });
            });
            function replaceMarkers(markers, newMarkers) {
                setTimeout(() => {
                    for (const marker of markers) {
                        marker.setMap(null);
                    }
                    markers = [...newMarkers];
                }, 250);
            }
            function createMarker(map, place) {
                const marker = new google.maps.Marker({
                    map,
                    position: place.geometry.location,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });
                google.maps.event.addListener(marker, 'click', function () {
                    infowindow.setContent(place.name);
                    infowindow.open(map, this);
                });
                return marker;
            }
        };
        this.googlePlacesService = googlePlacesService;
        this.store = store;
    }
    ngOnInit() {
        getCoords().then(coords => {
            this.store.dispatch({
                type: _state_reducers__WEBPACK_IMPORTED_MODULE_4__["SET_ORIGIN"],
                payload: new google.maps.LatLng(coords.latitude, coords.longitude)
            });
            this.setupMap(this.mapElement.nativeElement, coords.latitude, coords.longitude);
        });
        this.store
            .select(state => state.origin)
            .subscribe(origin => {
            if (this.map)
                this.map.setCenter(origin);
        });
        this.store
            .select(state => state.parks)
            .subscribe(parks => {
            this.parks = parks;
        });
    }
};
tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('mapContainer', { static: true }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:type", Object)
], MapComponent.prototype, "mapElement", void 0);
MapComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-map',
        template: '<div #mapContainer></div>',
        encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewEncapsulation"].None
    }),
    tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_google_places_service__WEBPACK_IMPORTED_MODULE_2__["GooglePlacesService"],
        _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["Store"]])
], MapComponent);



/***/ }),

/***/ "./src/app/state.reducers.ts":
/*!***********************************!*\
  !*** ./src/app/state.reducers.ts ***!
  \***********************************/
/*! exports provided: SET_PARKS, SET_ORIGIN, actionReducerMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_PARKS", function() { return SET_PARKS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SET_ORIGIN", function() { return SET_ORIGIN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "actionReducerMap", function() { return actionReducerMap; });
const SET_PARKS = 'SET_PARKS';
const SET_ORIGIN = 'SET_ORIGIN';
const actionReducerMap = {
    parks: (state = [], action) => {
        return SET_PARKS === action.type ? action.payload : state;
    },
    origin: (state = null, action) => {
        return SET_ORIGIN === action.type ? action.payload : state;
    }
};


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/iambriansreed/Projects/park-finder-angular/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map