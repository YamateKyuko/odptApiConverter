import { template_Odpt_Calendar } from "./CommonApiTemplate";
import { template, template__data, template_diagram, template_station } from "./OudiaParseTemplate"
import { initial, initial_diagram, initial_station, initial_train, initial_trainType } from "./ParseInitial.js";
import { template_Odpt_Railway, template_Odpt_Station, template_Odpt_StationOrder, template_Odpt_TrainTimetableObject, template_Odpt_TrainTimetable, template_Odpt_TrainType, template_Odpt_RailDirection } from "./TrainApiTemplate.js";

import toOudString from "./ToOudString.js";

let url: string = "https://api.odpt.org/";
let accessKey = "";

async function getRailway(railwayID: string): Promise<template_Odpt_Railway> {
  const link: string = `api/v4/odpt:Railway`;
  const params = {
    "dc:title": railwayID,
    "acl:consumerKey": accessKey,
  };
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}${link}?${query}`);
  const json: template_Odpt_Railway[] = await response.json();
  return json[0];
}

async function getStatios(railwayID: string, stationIDs: string[]): Promise<template_Odpt_Station[]> {
  const link: string = `api/v4/odpt:Station`;
  const params = {
    "odpt:railway": railwayID,
    "acl:consumerKey": accessKey,
  };
  const query: URLSearchParams = new URLSearchParams(params);
  const response = await fetch(`${url}${link}?${query}`);
  const json: template_Odpt_Station[] = await response.json();

  json.sort((a, b) => {return stationIDs.indexOf(a["owl:sameAs"]) - stationIDs.indexOf(b["owl:sameAs"])});

  return json;
}

async function setStations(stations: template_Odpt_Station[]): Promise<template_station[]> {
  return stations.map((OdptStation: template_Odpt_Station): template_station => {
    let name: string;
    name = OdptStation["dc:title"] ?? "";
    name = OdptStation["odpt:stationTitle"] ? OdptStation["odpt:stationTitle"]["ja"] : name;
    return {
      ...initial_station,
      "name": name,
    }
  });
}

async function getTrainTypeByID(operatorID: string): Promise<template_Odpt_TrainType[]> {
  // trainTypeID: string[]
  const params = {
    "odpt:operator": operatorID,
    // "owl:sameAs": trainTypeID.join(","),
    "acl:consumerKey": accessKey,
  };
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}api/v4/odpt:TrainType?${query}`);
  const json: template_Odpt_TrainType[] = await response.json();
  return json;
}

async function getRailDirectionByID(railDirectionID: string): Promise<template_Odpt_RailDirection> {
  const link: string = `api/v4/odpt:RailDirection`;
  const params = {
    "owl:sameAs": railDirectionID,
    "acl:consumerKey": accessKey,
  };
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}${link}?${query}`);
  const json: template_Odpt_RailDirection[] = await response.json();
  return json[0];
}

async function getCalendarByID(calendarID: string): Promise<template_Odpt_Calendar> {
  const link: string = `api/v4/odpt:Calendar`;
  const params = {
    "owl:sameAs": calendarID,
    "acl:consumerKey": accessKey,
  };
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}${link}?${query}`);
  const json: template_Odpt_Calendar[] = await response.json();
  return json[0];
}

async function getTrainTimetableByID(railwayID: string, trainType: string): Promise<template_Odpt_TrainTimetable[]> {
  const link: string = `api/v4/odpt:TrainTimetable`;
  const params = {
    "odpt:railway": railwayID,
    // "odpt:railDirection": railDirection,
    "odpt:trainType": trainType,
    "acl:consumerKey": accessKey,
  };
  const query = new URLSearchParams(params);
  const response = await fetch(`${url}${link}?${query}`);
  const json: template_Odpt_TrainTimetable[] = await response.json();
  if (json.length == 1000) {
    console.log("error: too many train to get.");
  }
  return json;
}

async function setDiagrams(
  railwayID: string,
  stationIDs: string[],
  setPlatform: (stationID: string, platformNumber: string) => number,
  getRailDirectionIndex: (railDirectionID: string) => number,
  getTrainTypeIndex: (trainTypeID: string) => number,
  trainTypeIDs: string[],
): Promise<template_diagram[]> {
  const json: template_Odpt_TrainTimetable[] = [];
  for (const trainTypeID of trainTypeIDs) {
    json.push(...await getTrainTimetableByID(railwayID, trainTypeID));
    json.push(...await getTrainTimetableByID(railwayID, trainTypeID));
  }

  const calendarIDs: string[] = [];
  const diagrams: template_diagram[] = [];
  
  for (const trainTimetable of json) {
    const stationIDjudge = ((val: template_Odpt_TrainTimetableObject): string => {
      return val["odpt:departureStation"] ?? (val["odpt:arrivalStation"] ?? "");
    });

    const trainTimetableObjects: (template_Odpt_TrainTimetableObject | null)[] = stationIDs.map((stationID: string) => {
      return  trainTimetable["odpt:trainTimetableObject"].find((elm) => stationIDjudge(elm) === stationID) ?? null;
    });

    const timeConv = (time: string | undefined): number | null => {
      const num: number = Date.parse(`1970-01-01T${time}Z`) / 1000;
      return isNaN(num) ? null : num;
    }

    const _datas: (template__data | null)[] = trainTimetableObjects.map((trainTimetableObject: template_Odpt_TrainTimetableObject | null): (template__data | null) => {
      return trainTimetableObject ? {
        "stopType": 0,
        "arrival": timeConv(trainTimetableObject["odpt:arrivalTime"]),
        "departure": timeConv(trainTimetableObject["odpt:departureTime"]),
        "track": trainTimetableObject["odpt:platformNumber"] ? setPlatform(stationIDjudge(trainTimetableObject), trainTimetableObject["odpt:platformNumber"]) : 0,
      } : null;
    });

    // const getStationID = (stationID: string[] | undefined): number => {
    //   if (!stationID) {return 0;}
    //   const val: number = stationIDs.indexOf(stationID[0]);
    //   if (val != -1) {return 0;}
    //   return 0;
    // }

    let calendarIndex: number = calendarIDs.indexOf(trainTimetable["odpt:calendar"] ?? "")
    if (calendarIndex == -1) {
      calendarIDs.push(trainTimetable["odpt:calendar"] ?? "");
      calendarIndex = calendarIDs.length - 1;
      
      const calendar: template_Odpt_Calendar = await getCalendarByID(trainTimetable["odpt:calendar"] ?? "");
      diagrams.push({
        ...initial_diagram,
        "name": (calendar["odpt:calendarTitle"] && calendar["odpt:calendarTitle"]["ja"]) ?? calendar["dc:title"] ?? calendar["owl:sameAs"],
        "trains": [[],[]],
      });
    }



    const railDirectionIndex: number = getRailDirectionIndex(trainTimetable["odpt:railDirection"] ?? "");
    railDirectionIndex == 1 && _datas.reverse();

    const getFirstStationIndex = (): number => {
      // if (trainTimetable["odpt:originStation"] != undefined) {
      //   return getStationID(trainTimetable["odpt:originStation"]);
      // };
      return _datas.findIndex((val) => val !== null);
    }

    const getTerminalStationIndex = (): number => {
      // if (trainTimetable["odpt:destinationStation"] != undefined) {
      //   return getStationID(trainTimetable["odpt:destinationStation"]);
      // };
      return _datas.findLastIndex((val) => val !== null);
    }

    diagrams[calendarIndex].trains[railDirectionIndex].push({
      ...initial_train,
      "direction": railDirectionIndex,
      "type": getTrainTypeIndex(trainTimetable["odpt:trainType"] ?? ""),
      "number": trainTimetable["odpt:trainNumber"] ?? trainTimetable["odpt:trainName"]?.[0]?.["ja"] ?? "",
      "note": trainTimetable["odpt:note"] ? trainTimetable["odpt:note"]["ja"]: null,
      "timetable": {
        "firstStationIndex": getFirstStationIndex(),
        "terminalStationIndex": getTerminalStationIndex(),
        "_data": _datas,
      },
    })
  }

  return diagrams;
}

async function main(railwayID: string): Promise<template> {
  const data: template = initial;

  const railway: template_Odpt_Railway = await getRailway(railwayID);

  const stationOrders: template_Odpt_StationOrder[] = railway["odpt:stationOrder"];
  stationOrders.sort((a, b) => a["odpt:index"] > b["odpt:index"] ? 1 : -1);
  const stationIDs: string[] = stationOrders.map((stationOrder) => {return stationOrder["odpt:station"]});
  const Stations: template_Odpt_Station[] = await getStatios(railway["owl:sameAs"], stationIDs);

  data.railway.stations = await setStations(Stations);

  const setPlatform = (stationID: string, platFormNumber: string): number => {
    const trackIndex: number = data.railway.stations[stationIDs.indexOf(stationID)].tracks.findIndex((track) => track.name == platFormNumber);
    if (trackIndex === -1) {
      
      data.railway.stations[stationIDs.indexOf(stationID)].tracks = [
        ...data.railway.stations[stationIDs.indexOf(stationID)].tracks,
        {
          "name": platFormNumber,
          "abbrName": ["", ""],
        }
      ]

      return data.railway.stations[stationIDs.indexOf(stationID)].tracks.length - 1;
    }
    return trackIndex;
  };


  const railDirectionIDs: string[] = [];
  const getRailDirectionIndex = (railDirectionID: string): number => {
    const railDirectionIndex: number = railDirectionIDs.findIndex((val) => val === railDirectionID);
    if (railDirectionIndex === -1) {
      railDirectionIDs.push(railDirectionID);
      return 0;
    }
    return railDirectionIndex;
  }
  railway["odpt:ascendingRailDirection"] && getRailDirectionIndex(railway["odpt:ascendingRailDirection"]);
  railway["odpt:descendingRailDirection"] && getRailDirectionIndex(railway["odpt:descendingRailDirection"]);

  

  // for (const trainTypeID of trainTypeIDs) {
  const trainTypeIDs: string[] = [];
  const trainTypes: template_Odpt_TrainType[] = await getTrainTypeByID(railway["odpt:operator"]);
  trainTypes.map((trainType) => {
    trainTypeIDs.push(trainType["owl:sameAs"]);
    data.railway.trainTypes.push({
      ...initial_trainType,
      "name": trainType["dc:title"] ?? (trainType["odpt:trainTypeTitle"] ? trainType["odpt:trainTypeTitle"]["ja"] : ""),
    });
  });
  
  
  const getTrainTypeIndex = (trainTypeID: string): number => {
    return trainTypeIDs.indexOf(trainTypeID);
  }

  data.railway.diagrams = await setDiagrams(railway["owl:sameAs"], stationIDs, setPlatform, getRailDirectionIndex, getTrainTypeIndex, trainTypeIDs);

  for (const railDirectionID of railDirectionIDs) {
    const railDirection: template_Odpt_RailDirection = await getRailDirectionByID(railDirectionID);
    data.railway.directionName.push(railDirection["dc:title"] ?? (railDirection["odpt:railDirectionTitle"] ? railDirection["odpt:railDirectionTitle"]["ja"] : ""));
  }



  data.railway.name = railway["dc:title"] ?? (railway["dc:railwayTitle"] ? railway["dc:railwayTitle"]["ja"] : "");

  return data;
}

async function test() {
  // if (false) {
    // const data: template = await main("つくばエクスプレス");
    // console.log(data);
    // const str = toOudString(data);

    // console.log(str);
  // }

  document.getElementById("button")?.addEventListener("click", async () => {
    url = window.prompt("APIのURL:", "https://api.odpt.org/") ?? "";
    accessKey = window.prompt("APIのアクセスキー:", "") ?? "";
    const railway: string = window.prompt("路線名:", "つくばエクスプレス") ?? "";
    const conf: boolean = window.confirm("取得しますか:");
    alert("全選択してshift-jisで.oudのファイルを保存してください。");
    if (conf) {
      const data: template = await main(railway);
      console.log(data);
      const str = toOudString(data);
      const div = document.getElementById("div")
      div && (div.innerText = str);
    }
  });
}

test();
