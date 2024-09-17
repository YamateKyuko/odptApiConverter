
// 型宣言ファイル
// ここの型宣言の解釈が間違っていましたらご一報ください。

export type template = {
  "fileType": string, // clowddia 0.1.0 のみ対応
  "fileTypeAppComment": string, // oudia(バージョン)
  "displayProperty": template_displayProperty, // スタイル設定 非対応
  "railway": template_railway
};

export type template_displayProperty = { // スタイル設定 非対応
  "timetableFont": template_timetableFont[],
  "timetableVFont": template_timetableFont, // ? 時刻表ビューフォント?
  "diagramStationFont": template_timetableFont, // ダイヤ駅フォント
  "diagramTimeFont": template_timetableFont, // ダイヤ時間フォント
  "commentFont": template_timetableFont, // コメント用フォント
  "diagramTrainFont": template_timetableFont, // ダイヤ駅フォント
  "diagramTextColor": template_rgb, // ダイヤ文字色
  "diagramBackgroundColor": template_rgb, // ダイヤ背景色
  "diagramTrainColor": template_rgb, // ? ダイヤ列車色?
  "diagramAxisColor": template_rgb, // ?
  "stdOpeTimeLowerColor": template_rgb, // ?
  "stdOpeTimeHigherColor": template_rgb, // ?
  "stdOpeTimeUndefColor": template_rgb, // ?
  "stdOpeTimeIllegalColor": template_rgb, // ?
  "stationNameLength": number, // ?
  "timetableTrainWidth": number, // 時刻表列車セル幅
  "anySecondIncDec1": number, // 任意秒移動1
  "anySecondIncDec2": number, // 任意秒移動2
  "visibleTrainName": boolean, // ?
  "visibleOuterTerminalOriginSide": boolean, // ?
  "visibleOuterTerminalTerminalSide": boolean, // ?
  "visibleOuterTerminal": boolean // ?
}

export type template_timetableFont = {
  "height": number,
  "family": string,
  "bold": boolean,
  "italic": boolean
}

export type template_railway = {
  "name": string, // 鉄道路線名など
  "directionName": string[], // 方向文字
  "startTime": number, // ダイヤの最初にくる時刻
  "stationInterval": number, // 駅間隔初期設定
  "enableOperation": boolean, // ?
  "comment": string, // 路線コメント
  "stations": template_station[], // 駅リスト
  "trainTypes": template_trainType[], // 種別リスト
  "diagrams": template_diagram[] // 時刻等データ
}

export type template_station = { // 駅リスト
  "name": string, // 駅名
  "abbrName": string, // 駅名略称
  "timetableStyle": template_timetableStyle, // 時刻表時刻表示
  "isMain": boolean, // 主要駅判定
  "border": boolean, // ボーダーライン
  "visibleDiagramInfo": ("Origin" | "Anytime" | "Not")[], // ダイヤ列車情報
  "mainTrack": number[], // 本線
  "tracks": template_track[], // ホームリスト
  "outerTerminal": template_outerTerminal[] | null, // 路線外発着駅
  "brunchCoreStationIndex": number | null, // 支線分岐駅番号
  "isBrunchOpposite": boolean, // ? 分岐駅反転
  "loopOriginStationIndex": number | null, // ? 環状線開始駅
  "isLoopOpposite": boolean, // ? 環状線反転駅
  "visibleTimetableTrack": boolean[], // 時刻表番線表示
  "visibleDiagramTrack": boolean, // ダイヤグラム番線表示
  "nextStaionDistance": null | number, // 次駅間隔
  "timetableTrackOmit": boolean, // 番線名省略
  "operationLength": number[], // ? 下り前・上り後作業欄数
  "customTimetableStyle": template_customTimetableStyle // 時刻表各種表示
};

export type template_timetableStyle = { // 時刻表時刻表示
  "arrival": boolean[],
  "departure": boolean[]
}

export type template_customTimetableStyle = { // 時刻表各種表示
  "arrival": boolean[], // timetableStyle
  "departure": boolean[], // timetableStyle
  "trainNumber": boolean[],
  "operationNumber": boolean[],
  "trainType": boolean[],
  "trainName": boolean[]
}

export type template_outerTerminal = {
  "name": string,
  "timetableName": string | null,
  "diagramName": string | null
}

export type template_track = { // ホームリスト
  "name": string,
  "abbrName": string[]
}

export type template_trainType = { // 種別
  "name": string, // 名称
  "abbrName": string, // 略称
  "textColor": template_rgb, // テキスト色
  "fontIndex": number, // フォント番号 未対応
  "backgroundColor": template_rgb, // 背景色
  "strokeColor": template_rgb, // 線色
  "lineStyle": "Jissen" | "Hasen" | "Tensen" | "Ittensasen", // 線のスタイル
  "isBoldLine": boolean, // 太線
  "stopMark": boolean, // ?
  "parentIndex": null // ?
}

export type template_diagram = { // ダイヤ
  "name": string, // ダイヤ名
  "mainBackgroundColorIndex": number, // 背景色
  "subBackgroundColorIndex": number, // ?
  "backgroundPatternIndex": number, // 背景画像
  "trains": template_train[][] // 方向別列車リスト
}

export type template_train = { // 列車
  "direction": number, // 方向
  "type": number, // 種別
  "number": string, // 列車番号
  "name": string, // 列車名
  "count": string, // 号数
  "timetable": template_timetable, // 時刻表
  "note": null | string, // 情報
  "operations": null | string // 時刻表備考
}

export type template_timetable = {
  "firstStationIndex": number, // 最初の駅番号
  "terminalStationIndex": number, // 最後の駅番号
  "_data": (null | template__data)[] // 駅毎発着刻等リスト
}

export type template__data = {
  "stopType": number, // 停車種類
  "arrival": number | null, // 着刻
  "departure": number | null, // 発刻
  "track": number // 番線
}

export type template_rgb = {
  "r": number,
  "g": number,
  "b": number
}

