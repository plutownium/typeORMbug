export interface TaskDetails {
    title: string;
    startDate: Date;
    endDate: Date;
    description?: string; // submitted to createTask.
    status?: string; // same story for leadId => member & memberIds => member[]
    leadId?: number;
    memberIds?: number[];
}
