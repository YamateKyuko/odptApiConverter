import { template_global, template_geojson } from "./CommonApiTemplate";

// ODPT トレインAPI 型宣言

// 乗降客数情報
export interface template_Odpt_PassengerSurvey {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date": string; // ISO8601
  "owl:sameAs": string; // ID
  "odpt:operator": string; // 会社ID
  "odpt:station": string[]; // 駅IDリスト
  "odpr:railway": string[]; // 路線IDリスト
  "odpt:includeAlighting": boolean; // 降車含む
  "odpt:passengerSurveyObject": template_Odpt_PassengerSurveyObject[];
}

export interface template_Odpt_PassengerSurveyObject {
  "odpt:surveyYear": number;
  "odpt:passengerJourneys": number;
}

// 進行方向情報
export interface template_Odpt_RailDirection {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date"?: string; // ISO8601
  "owl:sameAs": string; // ID
  "dc:title"?: string;
  "odpt:railDirectionTitle"?: template_global;
}

// 路線情報
export interface template_Odpt_Railway {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date": string; // ISO8601
  "owl:sameAs": string;
  "dc:title": string;
  "dc:railwayTitle"?: template_global;
  "odpt:kana"?: string;
  "odpt:operator": string;
  "odpt:lineCode"?: string;
  "odpt:color"?: string;
  "ug:region"?: template_geojson;
  "odpt:ascendingRailDirection"?: string;
  "odpt:descendingRailDirection"?: string;
  "odpt:stationOrder": template_Odpt_StationOrder[];
}

export interface template_Odpt_StationOrder {
  "odpt:station": string;
  "odpt:stationTitle"?: template_global;
  "odpt:index": number;
}

// 運賃情報 (工事中)
// type template_RailwayFare

// 駅情報
export interface template_Odpt_Station {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date": string; // ISO8601
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:stationTitle"?: template_global;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:stationCode"?: string;
  "geo:long"?: number;
  "geo:lat"?: number;
  "ug:region"?: template_geojson;
  "odpt:exit"?: string[];
  "odpt:connectingRailway"?: string[];
  "odpt:connectingStation"?: string[];
  "odpt:stationTimetable"?: string[];
  "odpt:passengerSurvey"?: string[];
}

// 駅時刻表情報
export interface template_Odpt_StationTimetable {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date": string; // ISO8601
  "dc:issued"?: string; // ISO8601
  "dct:valid"?: string; // ISO8601
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:railwayTitle"?: template_global;
  "odpt:station"?: string;
  "odpt:stationTitle"?: template_global;
  "odpt:railDirection"?: string;
  "odpt:calendar"?: string;
  "odpt:stationTimetableObject": template_Odpt_StationTimetableObject[];
  "odpt:note"?: template_global;
}

export interface template_Odpt_StationTimetableObject {
  "odpt:arrivalTime"?: string; // odpt:time
  "odpt:departureTime"?: string; // odpt:time
  "odpt:originStation"?: string[];
  "odpt:destinationStation"?: string[];
  "odpt:viaStation"?: string[];
  "odpt:viaRailway"?: string[];
  "odpt:train"?: string;
  "odpt:trainNumber"?: string;
  "odpt:trainType"?: string;
  "odpt:trainName"?: template_global[];
  "odpt:trainOwner"?: string;
  "odpt:isLast"?: boolean; // 最終列車以外省略
  "odpt:isOrigin"?: boolean; // 始発以外省略
  "odpt:platformNumber"?: string;
  "odpt:platformName"?: template_global;
  "odpt:carComposition"?: number;
  "odpt:note"?: template_global;
}

// 現在列車位置
// type template_Train

// 現在列車運行情報
// type template_TrainInformation

// 列車時刻表情報
export interface template_Odpt_TrainTimetable {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date": string; // ISO8601
  "dc:issued"?: string; // ISO8601
  "dct:valid"?: string; // ISO8601
  "owl:sameAs": string;
  "odpt:operator": string;
  "odpt:railway": string;
  "odpt:railDirection"?: string;
  "odpt:calendar"?: string;
  "odpt:trainNumber"?: string;
  "odpt:trainType"?: string;
  "odpt:trainName"?: template_global[];
  "odpt:trainOwner"?: string;
  "odpt:originStation"?: string[];
  "odpt:destinationStation"?: string[];
  "odpt:viaStation"?: string[];
  "odpt:previousTrainTimetable"?: string[];
  "odpt:nextTrainTimetable"?: string[];
  "odpt:trainTimetableObject": template_Odpt_TrainTimetableObject[];
  "odpt:needExtraFee"?: boolean;
  "odpt:note"?: template_global;
}

export interface template_Odpt_TrainTimetableObject {
  "odpt:arrivalTime"?: string; // odpt:time
  "odpt:arrivalStation"?: string;
  "odpt:departureTime"?: string; // odpt:time
  "odpt:departureStation"?: string;
  "odpt:platformNumber"?: string;
  "odpt:platformName"?: template_global;
  "odpt:note"?: template_global;
}

// 種別情報
export interface template_Odpt_TrainType {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date"?: string; // ISO8601
  "owl:sameAs": string;
  "odpt:operator": string;
  "dc:title"?: string;
  "odpt:trainTypeTitle"?: template_global;
}



