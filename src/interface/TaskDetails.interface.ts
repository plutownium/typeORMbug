export interface TaskDetails {
    title: string;
    startDate: Date;
    endDate: Date;
    committeeId: number; // note committeeId and relatedCommitteeIds are intended to
    relatedCommitteeIds?: number[]; // be converted into actual entities before being
    description?: string; // submitted to createTask.
    status?: string; // same story for leadId => member & memberIds => member[]
    leadId?: number;
    memberIds?: number[];
}
