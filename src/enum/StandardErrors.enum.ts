export enum StandardErrors {
    // general
    nonStringInteger = "Non string integer passed to parameter",
    // committee
    noCommitteeForThisId = "Committee not found for this committee id",
    noHeadCommitteeFound = "No head committee found",
    noCommitteesForTheseIds = "No committees found for these ids",
    cantBeHeadTwice = "A user cannot be head twice",
    // account
    noUserForThisEmail = "No user found for this email",
    noUserForThisId = "No user found for this id",
    duplicateEmail = "Email already exists",
    duplicateGoogleId = "Duplicate Google id",
    // task
    noTaskForThisId = "No task found for this id",
    noMemberToRemove = "No member to remove from this task",
}
