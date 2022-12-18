import MemberDAO from "../../src/db/dao/member.dao";
import { memberRepository } from "../../src/db/data-source";

import { app } from "../../src/server";

const memberDAO = new MemberDAO(memberRepository);


const memberForTest1 = {
    email: "member11@gmail.com",
    displayName: "member1",
    fakeGoogleId: "member1",
};
const memberForTest2 = {
    email: "member22@gmail.com",
    displayName: "member2",
    fakeGoogleId: "member2",
};
const memberForTest3 = {
    email: "member33@gmail.com",
    displayName: "member3",
    fakeGoogleId: "member3",
};

beforeAll(async () => {
    await app.authenticateDB();
    await app.purgeDb("Member");
    await memberDAO.createUser(memberForTest1.fakeGoogleId, memberForTest1.displayName, memberForTest1.email);
    await memberDAO.createUser(memberForTest2.fakeGoogleId, memberForTest2.displayName, memberForTest2.email);
    await memberDAO.createUser(memberForTest3.fakeGoogleId, memberForTest3.displayName, memberForTest3.email);
});

describe("member DAO", () => {
    test("create member", async () => {
        // arrange
        const memberForTest4 = {
            email: "member44@gmail.com",
            displayName: "member4",
            fakeGoogleId: "member4",
        };
        // act
        const member = await memberDAO.createUser(memberForTest4.fakeGoogleId, memberForTest4.displayName, memberForTest4.email);
        // assert
        expect(member).toBeDefined();
        expect(member.userId).toBeDefined();
        expect(member.displayName).toBe(memberForTest4.displayName);
    });
});
