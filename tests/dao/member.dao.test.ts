import MemberDAO from "../../src/dao/member.dao";
import { memberRepository } from "../../src/db/data-source";

import { app } from "../../src/server";

const memberDAO = new MemberDAO(memberRepository);

const memberForTest1 = {
    displayName: "member1",
};
const memberForTest2 = {
    displayName: "member2",
};
const memberForTest3 = {
    displayName: "member3",
};

beforeAll(async () => {
    await app.authenticateDB();
    await app.purgeDb("Member");
    await memberDAO.createUser(memberForTest1.displayName, );
    await memberDAO.createUser( memberForTest2.displayName,);
    await memberDAO.createUser( memberForTest3.displayName,);
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
        const member = await memberDAO.createUser(memberForTest4.displayName);
        // assert
        expect(member).toBeDefined();
        expect(member.userId).toBeDefined();
        expect(member.displayName).toBe(memberForTest4.displayName);
    });
});
