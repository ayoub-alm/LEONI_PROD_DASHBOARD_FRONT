import { SegmntModel } from "./segmentModel";


export class ProductionLineModel{
    id:number;
    name:string;
    project_id:number;
    number_of_operators:number;
    segement_id: number;
    database_path:string;
    segment: SegmntModel;


    constructor(
        id:number,
        name:string,
        project_id:number,
        number_of_operators:number,
        segement_id: number,
        database_path:string,
        segment: SegmntModel
    ){
        this.id = id;
        this.name =name;
        this.project_id = project_id;
        this.number_of_operators =number_of_operators;
        this.segement_id = segement_id;
        this.database_path = database_path;
        this.segment = segment

    }
    
}