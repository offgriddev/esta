export declare const getSourceFile: (folder: any, includedType: any, excludedType: any) => any;
export declare const estimate: (records: any, avgSpeed: any, possibleHours: any, numberOfDevs: any) => Promise<{
    totalComplexity: number;
    weeks: any[];
}>;
