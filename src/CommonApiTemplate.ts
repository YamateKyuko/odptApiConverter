// 
export type template_Odpt_Calendar = {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date"?: string;
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:calendarTitle"?: template_global;
  "opdt:day"?: string[];
  "opdt:duration"? : string;
}

// 
export type template_Odpt_Operator = {
  "@context": string;
  "@id": string;
  "@type": string;
  "dc:date"?: string;
  "owl:sameAs": string;
  "dc:title"?: string;
  "odpt:operatorTitle"?: template_global;
}






export type template_global = {
  // "ja": string,
  // "en": string,
  [key: string]: string
};

export type template_geojson = {
  "type": string;
  "coordinates": number[] | number[][] | number[][][];
};
