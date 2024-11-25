var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initial, initial_diagram, initial_station, initial_train, initial_trainType } from "./ParseInitial.js";
import toOudString from "./ToOudString.js";
let url = "https://api.odpt.org/";
let accessKey = "";
function getRailway(railwayID) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `api/v4/odpt:Railway`;
        const params = {
            "dc:title": railwayID,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}${link}?${query}`);
        const json = yield response.json();
        return json[0];
    });
}
function getStatios(railwayID, stationIDs) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `api/v4/odpt:Station`;
        const params = {
            "odpt:railway": railwayID,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}${link}?${query}`);
        const json = yield response.json();
        json.sort((a, b) => { return stationIDs.indexOf(a["owl:sameAs"]) - stationIDs.indexOf(b["owl:sameAs"]); });
        return json;
    });
}
function setStations(stations) {
    return __awaiter(this, void 0, void 0, function* () {
        return stations.map((OdptStation) => {
            var _a;
            let name;
            name = (_a = OdptStation["dc:title"]) !== null && _a !== void 0 ? _a : "";
            name = OdptStation["odpt:stationTitle"] ? OdptStation["odpt:stationTitle"]["ja"] : name;
            return Object.assign(Object.assign({}, initial_station), { "name": name });
        });
    });
}
function getTrainTypeByID(operatorID) {
    return __awaiter(this, void 0, void 0, function* () {
        const params = {
            "odpt:operator": operatorID,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}api/v4/odpt:TrainType?${query}`);
        const json = yield response.json();
        return json;
    });
}
function getRailDirectionByID(railDirectionID) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `api/v4/odpt:RailDirection`;
        const params = {
            "owl:sameAs": railDirectionID,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}${link}?${query}`);
        const json = yield response.json();
        return json[0];
    });
}
function getCalendarByID(calendarID) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `api/v4/odpt:Calendar`;
        const params = {
            "owl:sameAs": calendarID,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}${link}?${query}`);
        const json = yield response.json();
        return json[0];
    });
}
function getTrainTimetableByID(railwayID, railDirection, trainType) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = `api/v4/odpt:TrainTimetable`;
        const params = {
            "odpt:railway": railwayID,
            "odpt:railDirection": railDirection,
            "odpt:trainType": trainType,
            "acl:consumerKey": accessKey,
        };
        const query = new URLSearchParams(params);
        const response = yield fetch(`${url}${link}?${query}`);
        const json = yield response.json();
        return json;
    });
}
function setDiagrams(railwayID_1, stationIDs_1, setPlatform_1, getRailDirectionIndex_1, getTrainTypeIndex_1, railway_1) {
    return __awaiter(this, arguments, void 0, function* (railwayID, stationIDs, setPlatform, getRailDirectionIndex, getTrainTypeIndex, railway, trainTypeIDs = []) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const json = [];
        for (const trainTypeID of trainTypeIDs) {
            json.push(...yield getTrainTimetableByID(railwayID, (_a = railway["odpt:ascendingRailDirection"]) !== null && _a !== void 0 ? _a : "", trainTypeID));
            json.push(...yield getTrainTimetableByID(railwayID, (_b = railway["odpt:descendingRailDirection"]) !== null && _b !== void 0 ? _b : "", trainTypeID));
        }
        const calendarIDs = [];
        const diagrams = [];
        for (const trainTimetable of json) {
            const stationIDjudge = ((val) => {
                var _a, _b;
                return (_a = val["odpt:departureStation"]) !== null && _a !== void 0 ? _a : ((_b = val["odpt:arrivalStation"]) !== null && _b !== void 0 ? _b : "");
            });
            const trainTimetableObjects = stationIDs.map((stationID) => {
                var _a;
                return (_a = trainTimetable["odpt:trainTimetableObject"].find((elm) => stationIDjudge(elm) === stationID)) !== null && _a !== void 0 ? _a : null;
            });
            const timeConv = (time) => {
                const num = Date.parse(`1970-01-01T${time}Z`) / 1000;
                return isNaN(num) ? null : num;
            };
            const _datas = trainTimetableObjects.map((trainTimetableObject) => {
                return trainTimetableObject ? {
                    "stopType": 0,
                    "arrival": timeConv(trainTimetableObject["odpt:arrivalTime"]),
                    "departure": timeConv(trainTimetableObject["odpt:departureTime"]),
                    "track": trainTimetableObject["odpt:platformNumber"] ? setPlatform(stationIDjudge(trainTimetableObject), trainTimetableObject["odpt:platformNumber"]) : 0,
                } : null;
            });
            let calendarIndex = calendarIDs.indexOf((_c = trainTimetable["odpt:calendar"]) !== null && _c !== void 0 ? _c : "");
            if (calendarIndex == -1) {
                calendarIDs.push((_d = trainTimetable["odpt:calendar"]) !== null && _d !== void 0 ? _d : "");
                calendarIndex = calendarIDs.length - 1;
                const calendar = yield getCalendarByID((_e = trainTimetable["odpt:calendar"]) !== null && _e !== void 0 ? _e : "");
                diagrams.push(Object.assign(Object.assign({}, initial_diagram), { "name": (_g = (_f = (calendar["odpt:calendarTitle"] && calendar["odpt:calendarTitle"]["ja"])) !== null && _f !== void 0 ? _f : calendar["dc:title"]) !== null && _g !== void 0 ? _g : calendar["owl:sameAs"], "trains": [[], []] }));
            }
            const railDirectionIndex = getRailDirectionIndex((_h = trainTimetable["odpt:railDirection"]) !== null && _h !== void 0 ? _h : "");
            railDirectionIndex == 1 && _datas.reverse();
            const getFirstStationIndex = () => {
                return _datas.findIndex((val) => val !== null);
            };
            const getTerminalStationIndex = () => {
                return _datas.findLastIndex((val) => val !== null);
            };
            diagrams[calendarIndex].trains[railDirectionIndex].push(Object.assign(Object.assign({}, initial_train), { "direction": railDirectionIndex, "type": getTrainTypeIndex((_j = trainTimetable["odpt:trainType"]) !== null && _j !== void 0 ? _j : ""), "number": (_o = (_k = trainTimetable["odpt:trainNumber"]) !== null && _k !== void 0 ? _k : (_m = (_l = trainTimetable["odpt:trainName"]) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m["ja"]) !== null && _o !== void 0 ? _o : "", "note": trainTimetable["odpt:note"] ? trainTimetable["odpt:note"]["ja"] : null, "timetable": {
                    "firstStationIndex": getFirstStationIndex(),
                    "terminalStationIndex": getTerminalStationIndex(),
                    "_data": _datas,
                } }));
        }
        return diagrams;
    });
}
function main(railwayID) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const data = initial;
        const railway = yield getRailway(railwayID);
        const stationOrders = railway["odpt:stationOrder"];
        stationOrders.sort((a, b) => a["odpt:index"] > b["odpt:index"] ? 1 : -1);
        const stationIDs = stationOrders.map((stationOrder) => { return stationOrder["odpt:station"]; });
        const Stations = yield getStatios(railway["owl:sameAs"], stationIDs);
        data.railway.stations = yield setStations(Stations);
        const setPlatform = (stationID, platFormNumber) => {
            const trackIndex = data.railway.stations[stationIDs.indexOf(stationID)].tracks.findIndex((track) => track.name == platFormNumber);
            if (trackIndex === -1) {
                data.railway.stations[stationIDs.indexOf(stationID)].tracks = [
                    ...data.railway.stations[stationIDs.indexOf(stationID)].tracks,
                    {
                        "name": platFormNumber,
                        "abbrName": ["", ""],
                    }
                ];
                return data.railway.stations[stationIDs.indexOf(stationID)].tracks.length - 1;
            }
            return trackIndex;
        };
        const railDirectionIDs = [];
        const getRailDirectionIndex = (railDirectionID) => {
            const railDirectionIndex = railDirectionIDs.findIndex((val) => val === railDirectionID);
            if (railDirectionIndex === -1) {
                railDirectionIDs.push(railDirectionID);
                return 0;
            }
            return railDirectionIndex;
        };
        railway["odpt:ascendingRailDirection"] && getRailDirectionIndex(railway["odpt:ascendingRailDirection"]);
        railway["odpt:descendingRailDirection"] && getRailDirectionIndex(railway["odpt:descendingRailDirection"]);
        const trainTypeIDs = [];
        const trainTypes = yield getTrainTypeByID(railway["odpt:operator"]);
        trainTypes.map((trainType) => {
            var _a;
            trainTypeIDs.push(trainType["owl:sameAs"]);
            data.railway.trainTypes.push(Object.assign(Object.assign({}, initial_trainType), { "name": (_a = trainType["dc:title"]) !== null && _a !== void 0 ? _a : (trainType["odpt:trainTypeTitle"] ? trainType["odpt:trainTypeTitle"]["ja"] : "") }));
        });
        const getTrainTypeIndex = (trainTypeID) => {
            return trainTypeIDs.indexOf(trainTypeID);
        };
        data.railway.diagrams = yield setDiagrams(railway["owl:sameAs"], stationIDs, setPlatform, getRailDirectionIndex, getTrainTypeIndex, railway);
        for (const railDirectionID of railDirectionIDs) {
            const railDirection = yield getRailDirectionByID(railDirectionID);
            data.railway.directionName.push((_a = railDirection["dc:title"]) !== null && _a !== void 0 ? _a : (railDirection["odpt:railDirectionTitle"] ? railDirection["odpt:railDirectionTitle"]["ja"] : ""));
        }
        data.railway.name = (_b = railway["dc:title"]) !== null && _b !== void 0 ? _b : (railway["dc:railwayTitle"] ? railway["dc:railwayTitle"]["ja"] : "");
        return data;
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (false) {
            const data = yield main("つくばエクスプレス");
            console.log(data);
        }
        (_a = document.getElementById("button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            url = (_a = window.prompt("APIのURL:", "https://api.odpt.org/")) !== null && _a !== void 0 ? _a : "";
            accessKey = (_b = window.prompt("APIのアクセスキー:", "")) !== null && _b !== void 0 ? _b : "";
            const railway = (_c = window.prompt("路線名:", "つくばエクスプレス")) !== null && _c !== void 0 ? _c : "";
            const conf = window.confirm("取得しますか:");
            alert("全選択してshift-jisで.oudのファイルを保存してください。");
            if (conf) {
                const data = yield main(railway);
                console.log(data);
                const str = toOudString(data);
                const div = document.getElementById("div");
                div && (div.innerText = str);
            }
        }));
    });
}
test();
//# sourceMappingURL=app.js.map