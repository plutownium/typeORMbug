import { app } from "../../src/server";
// import MemberDAO from "../../src/db/dao/member.dao";
// import TaskDAO from "../../src/db/dao/task.dao";
import { taskDAO } from "../../src/db/daoInit";
import { memberDAO, committeeDAO } from "../../src/db/daoInit";
// import {  committeeRepository, memberRepository, taskRepository } from "../../src/db/data-source";
import { TaskDetails } from "../../src/interface/TaskDetails.interface";
import CommitteeDAO from "../../src/db/dao/committee.dao";

// const memberDAO = new MemberDAO(memberRepository);
// const taskDAO = new TaskDAO(taskRepository, memberDAO, memberRepository);
// const committeeDAO = new CommitteeDAO(committeeRepository)

beforeAll(async () => {
    await app.authenticateDB();
    await app.purgeDb("Member");
    await app.purgeDb("Committee");
    await app.purgeDb("Task");
});

describe("task DAO", () => {
    test("create a task", async () => {
        // arrange
        const memberForTest1 = {
            email: "foo1@gmail.com",
            displayName: "foo1",
            fakeGoogleId: "foo1",
        };
        const memberForTest2 = {
            email: "bar1@gmail.com",
            displayName: "bar1",
            fakeGoogleId: "bar1",
        };
        const memberForTest3 = {
            email: "baz1@gmail.com",
            displayName: "baz1",
            fakeGoogleId: "baz1",
        };
        const newUser1 = await memberDAO.createUser(memberForTest1.fakeGoogleId, memberForTest1.displayName, memberForTest1.email);
        const newUser2 = await memberDAO.createUser(memberForTest2.fakeGoogleId, memberForTest2.displayName, memberForTest2.email);
        const newUser3 = await memberDAO.createUser(memberForTest3.fakeGoogleId, memberForTest3.displayName, memberForTest3.email);
        const committeePayload1 = {
            title: "Fooa Department",
            description: "Fooa Distribution Service",
            headUserId: newUser1.userId,
        };
        const committeePayload2 = {
            title: "Foob Department",
            description: "Foob Distribution Service",
            headUserId: newUser2.userId,
        };
        const newCommittee1 = await committeeDAO.createCommittee(committeePayload1.title, committeePayload1.description,newUser1);
        const newCommittee2 = await committeeDAO.createCommittee(committeePayload2.title, committeePayload2.description,newUser2);
        // act

        const taskTitle = "Duck Feeding Service"
        const taskPayload1 = {
            projectLead: newUser1,
            membersToAdd: [newUser2, newUser3],
        };

        const newTask = await taskDAO.createTask(
            newCommittee1,
            {title: "cats", startDate: new Date(),endDate: new Date(), committeeId: 5},
            [newCommittee2],
            taskPayload1.projectLead,
            taskPayload1.membersToAdd,
        );
        const taskWithMembers = await taskDAO.addMembersToTask(newTask, taskPayload1.membersToAdd);
        // assert
        expect(newTask).toBeDefined();
        expect(newTask.leads).toBeDefined();
        if (newTask.leads === undefined) {
            fail("Failed to create lead on task");
        }
        const lead = newTask.leads[0];
        expect(lead).toEqual(taskPayload1.projectLead);
        expect(taskWithMembers.members?.length).toBe(taskPayload1.membersToAdd.length * 2);
    });
});
