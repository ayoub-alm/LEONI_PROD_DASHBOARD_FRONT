import { SegmntModel } from "./segmentModel";


export class ProjectModel {
  id: number;
  name: string;
  ref: string;
  segments: SegmntModel[];

  constructor(id: number, name: string, ref: string, segments: SegmntModel[]) {
    this.id = id;
    this.name = name;
    this.ref = ref;
    this.segments = segments;
  }
}
