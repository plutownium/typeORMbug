export class NewUser {
    level = 1; // so we can do "if (user.level >= requiredPrivilege.level)"
}
export class MemberPrivileges extends NewUser {
    level = 2;
    canPickCommittees = true;
    canPickTasks = true;
    canUpdateTaskStatus = true;

    getPrivileges() {
        return Object.getOwnPropertyNames(this);
    }
}

export class LeadPrivileges extends MemberPrivileges {
    level = 3;
    canCreateNewTasks = true;
    canManageTasks = true;
    canModifyTasks = true;
    canManageMembers = true;

    // expecting new LeadPrivileges().canPickCommittees to be true. same for 'canPickTasks'
}

export class CommitteeHeadPrivileges extends LeadPrivileges {
    level = 4;
    canAssignLeads = true;
}

export class chairPrivileges extends CommitteeHeadPrivileges {
    level = 5;
    canPickCommitteeHeads = true;
}
