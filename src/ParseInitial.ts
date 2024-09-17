import { template, template_diagram, template_station, template_train, template_trainType } from "./OudiaParseTemplate";

export const initial: template = {
  "fileType": "OuDia.1.07",
  "fileTypeAppComment": "CloudDia 1.0",
  "displayProperty": {
    "timetableFont": [
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      },
      {
        "height": 9,
        "family": "MS ゴシック",
        "bold": false,
        "italic": false
      }
    ],
    "timetableVFont": {
      "height": 9,
      "family": "MS ゴシック",
      "bold": false,
      "italic": false
    },
    "diagramStationFont": {
      "height": 9,
      "family": "MS ゴシック",
      "bold": false,
      "italic": false
    },
    "diagramTimeFont": {
      "height": 9,
      "family": "MS ゴシック",
      "bold": false,
      "italic": false
    },
    "commentFont": {
      "height": 9,
      "family": "MS ゴシック",
      "bold": false,
      "italic": false
    },
    "diagramTrainFont": {
      "height": 9,
      "family": "MS ゴシック",
      "bold": false,
      "italic": false
    },
    "diagramTextColor": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "diagramBackgroundColor": {
      "r": 255,
      "g": 255,
      "b": 255
    },
    "diagramTrainColor": {
      "r": 0,
      "g": 0,
      "b": 0
    },
    "diagramAxisColor": {
      "r": 191,
      "g": 191,
      "b": 191
    },
    "stdOpeTimeLowerColor": {
      "r": 255,
      "g": 191,
      "b": 191
    },
    "stdOpeTimeHigherColor": {
      "r": 191,
      "g": 191,
      "b": 255
    },
    "stdOpeTimeUndefColor": {
      "r": 255,
      "g": 255,
      "b": 191
    },
    "stdOpeTimeIllegalColor": {
      "r": 191,
      "g": 191,
      "b": 191
    },
    "stationNameLength": 6,
    "timetableTrainWidth": 5,
    "anySecondIncDec1": 5,
    "anySecondIncDec2": 15,
    "visibleTrainName": true,
    "visibleOuterTerminalOriginSide": false,
    "visibleOuterTerminalTerminalSide": false,
    "visibleOuterTerminal": false
  },
  "railway": {
    "name": "新規路線",
    "directionName": [],
    "startTime": 14400,
    "stationInterval": 60,
    "enableOperation": false,
    "comment": "",
    "stations": [],
    "trainTypes": [
    ],
    "diagrams": [
      {
        "name": "新規ダイヤ",
        "mainBackgroundColorIndex": 0,
        "subBackgroundColorIndex": 0,
        "backgroundPatternIndex": 0,
        "trains": [
          [],
          []
        ]
      }
    ]
  }
}

export const initial_station: template_station = {
  "name": "",
  "abbrName": "",
  "timetableStyle": {
    "arrival": [false, false],
    "departure": [true, true]
  },
  "isMain": false,
  "border": false,
  "visibleDiagramInfo": ["Origin", "Origin"],
  "mainTrack": [1, 0],
  "tracks": [
  ],
  "outerTerminal": null,
  "brunchCoreStationIndex": null,
  "isBrunchOpposite": false,
  "loopOriginStationIndex": null,
  "isLoopOpposite": false,
  "visibleTimetableTrack": [false, false],
  "visibleDiagramTrack": false,
  "nextStaionDistance": null,
  "timetableTrackOmit": false,
  "operationLength": [0, 0],
  "customTimetableStyle": {
    "arrival": [
      false,
      false
    ],
    "departure": [
      true,
      true
    ],
    "trainNumber": [
      false,
      false
    ],
    "operationNumber": [
      false,
      false
    ],
    "trainType": [
      false,
      false
    ],
    "trainName": [
      false,
      false
    ]
  },
}

export const initial_trainType: template_trainType = {
  "name": "",
  "abbrName": "",
  "textColor": {
    "r": 0,
    "g": 0,
    "b": 0
  },
  "fontIndex": 0,
  "backgroundColor": {
    "r": 255,
    "g": 255,
    "b": 255
  },
  "strokeColor": {
    "r": 0,
    "g": 0,
    "b": 0
  },
  "lineStyle": "Jissen",
  "isBoldLine": false,
  "stopMark": false,
  "parentIndex": null
}

export const initial_diagram: template_diagram = {
  "name": "",
  "mainBackgroundColorIndex": 0,
  "subBackgroundColorIndex": 0,
  "backgroundPatternIndex": 0,
  "trains": [
    [],
    []
  ]
}

export const initial_train: template_train = {
  "direction": 0,
  "type": 0,
  "number": "",
  "name": "",
  "count": "",
  "timetable": {
    "firstStationIndex": 0,
    "terminalStationIndex": 0,
    "_data": [],
  },
  "note": "",
  "operations": "",
}