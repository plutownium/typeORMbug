// this interface is shaped like this because it defines the inputs to the system.
// it doesn't mention a specific Member object because that would require
// exchanging the userIds for their members.
// We do eventually do that but, as late as possible.
export interface CommitteeDetails {
    title: string;
    description: string;
    headUserId: number;
    memberIds?: number[];
    leadIds?: number[];
}
