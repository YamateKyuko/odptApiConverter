import { template, template_diagram, template_railway, template_station, template_train, template_trainType } from "./OudiaParseTemplate";
import { ColorToOudiaString, getTimetableStyle, numberToTimeString } from "./Util.js";

function toOudiaString(data: template): string {
  console.log(data);
  const value = `FileType=OuDia.1.02\n${railwayToOudiaString(data.railway)}${displayPropertyToOudiaString()}FileTypeAppComment=odptApiConverter v0.4.3\n`;
  return value;
}

function railwayToOudiaString(railway: template_railway): string {
  return (
  'Rosen.\n' +
  'Rosenmei=' +
  railway.name +
  '\n' +
  railway.stations.map((station) => stationToOudiaString(station)).join('') +
  railway.trainTypes.map((trainType) => trainTypeToOudiaString(trainType)).join('') +
  railway.diagrams.map((diagram) => diagramToOudiaString(diagram)).join('') +
  `KitenJikoku=${numberToTimeString(railway.startTime, 'HMM')}\n` +
  `DiagramDgrYZahyouKyoriDefault=${railway.stationInterval}\n` +
  `Comment=${railway.comment.replace(/\n/g, '\\n')}\n` +
  '.\n'
  );
}

function stationToOudiaString(station: template_station): string {
  return (
    'Eki.\n' +
    'Ekimei=' +
    station.name +
    '\n' +
    'Ekijikokukeisiki=' +
    getTimetableStyle(station) +
    '\n' +
    'Ekikibo=' +
    (station.isMain ? 'Ekikibo_Syuyou' : 'Ekikibo_Ippan') +
    '\n' +
    (station.border ? 'Kyoukaisen=1\n' : '') +
    (station.visibleDiagramInfo[0] !== 'Origin'
      ? 'DiagramRessyajouhouHyoujiKudari=DiagramRessyajouhouHyouji_' +
        station.visibleDiagramInfo[0] +
        '\n'
      : '') +
    (station.visibleDiagramInfo[1] !== 'Origin'
      ? 'DiagramRessyajouhouHyoujiNobori=DiagramRessyajouhouHyouji_' +
        station.visibleDiagramInfo[1] +
        '\n'
      : '') +
    '.\n'
  );
}

function trainTypeToOudiaString(trainType: template_trainType): string {
  return (
    'Ressyasyubetsu.\n' +
      'Syubetsumei=' +
      trainType.name +
      '\n' +
      'Ryakusyou=' +
      trainType.abbrName +
      '\n' +
      'JikokuhyouMojiColor=' +
      ColorToOudiaString(trainType.textColor) +
      '\n' +
      'JikokuhyouFontIndex=' +
      trainType.fontIndex +
      '\n' +
      'DiagramSenColor=' +
      ColorToOudiaString(trainType.strokeColor) +
      '\n' +
      'DiagramSenStyle=SenStyle_' +
      trainType.lineStyle +
      '\n' +
      (trainType.isBoldLine ? 'DiagramSenIsBold=1\n' : '') +
      (trainType.stopMark ? 'StopMarkDrawType=EStopMarkDrawType_DrawOnStop\n' : '') +
      '.\n'
  );
}

function diagramToOudiaString(diagram: template_diagram): string {
  return (
    'Dia.\n' +
    'DiaName=' +
    diagram.name +
    '\n' +
    'Kudari.\n' +
    diagram.trains[0].map((train) => trainToOudiaString(train)).join('') +
    '.\n' +
    'Nobori.\n' +
    diagram.trains[1].map((train) => trainToOudiaString(train)).join('') +
    '.\n' +
    '.\n'
  );
}

function trainToOudiaString(train: template_train): string {
  return (
    'Ressya.\n' +
      'Houkou=' +
      (train.direction === 0 ? 'Kudari' : 'Nobori') +
      '\n' +
      'Syubetsu=' +
      train.type +
      '\n' +
      (train.number !== null ? 'Ressyabangou=' + train.number + '\n' : '') +
      (train.name !== null ? 'Ressyamei=' + train.name + '\n' : '') +
      (train.count !== null ? 'Gousuu=' + train.count + '\n' : '') +
      'EkiJikoku=' +
      timetableToOudiaString(train.timetable) +
      '\n' +
      (train.note !== null ? 'Bikou=' + train.note + '\n' : '') +
      '.\n'
  )
}

function timetableToOudiaString(timetable: template_train['timetable']): string {
  let result = '';
  for (let i = 0; i < timetable.firstStationIndex; i++) {
    result += ',';
  }
  for (let i = timetable.firstStationIndex; i <= timetable.terminalStationIndex; i++) {
    if (!(i in timetable._data)) {
      result += '3';
    } else {
        result += timetable._data[i]?.stopType + ';';
        const arr = timetable._data[i]?.arrival;
        const dep = timetable._data[i]?.departure;
        if (typeof arr === 'number') {
          result += numberToTimeString(arr, 'HMM') + '/';
        }
        if (typeof dep === 'number') {
          result += numberToTimeString(dep, 'HMM');
        }
    }
    result += ',';
  }
  // remove the last comma
  result = result.replace(/,*$/g, '');
  return result;
}


function displayPropertyToOudiaString(): string {
  return (
`DispProp.
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouFont=PointTextHeight=9;Facename=MS ゴシック
JikokuhyouVFont=PointTextHeight=9;Facename=MS ゴシック
DiaEkimeiFont=PointTextHeight=9;Facename=MS ゴシック
DiaJikokuFont=PointTextHeight=9;Facename=MS ゴシック
CommentFont=PointTextHeight=9;Facename=MS ゴシック
DiaRessyaFont=PointTextHeight=9;Facename=MS ゴシック
DiaRessyaFont=PointTextHeight=9;Facename=MS ゴシック
DiaMojiColor=00000000
DiaHaikeiColor=00000000
DiaRessyaColor=00FFFFFF
DiaJikuColor=00000000
DiaMojiColor=00BFBFBF
EkimeiLength=6
JikokuhyouRessyaWidth=5
.
`
)
}



export default toOudiaString;