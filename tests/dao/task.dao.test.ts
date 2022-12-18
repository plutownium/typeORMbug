import { app } from "../../src/server";
import MemberDAO from "../../src/dao/member.dao";
import TaskDAO from "../../src/dao/task.dao";
import {  committeeRepository, memberRepository, taskRepository } from "../../src/db/data-source";
import { TaskDetails } from "../../src/interface/TaskDetails.interface";
import CommitteeDAO from "../../src/dao/committee.dao";

const memberDAO = new MemberDAO(memberRepository);
const taskDAO = new TaskDAO(taskRepository, memberDAO, memberRepository);
const committeeDAO = new CommitteeDAO(committeeRepository)

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
            displayName: "foo1",
        };
        const memberForTest2 = {
            displayName: "bar1",
        };
        const memberForTest3 = {
            displayName: "baz1",
        };
        const newUser1 = await memberDAO.createUser(memberForTest1.displayName, );
        const newUser2 = await memberDAO.createUser( memberForTest2.displayName,);
        const newUser3 = await memberDAO.createUser( memberForTest3.displayName,);
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
        const newCommittee1 = await committeeDAO.createCommittee(committeePayload1.title, newUser1);
        const newCommittee2 = await committeeDAO.createCommittee(committeePayload2.title, newUser2);
        // act
        // const taskDetails: TaskDetails = {
        //     title: "Baz Creation",
        //     startDate: new Date(),
        //     endDate: new Date(),
        // };
        const taskTitle = "Duck Feeding Service"
        const taskPayload1 = {
            projectLead: newUser1,
            membersToAdd: [newUser2, newUser3],
        };

        const newTask = await taskDAO.createTask(
            newCommittee1,
            taskTitle,
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
