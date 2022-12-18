import CommitteeDAO from "./dao/committee.dao";
import TaskDAO from "./dao/task.dao";
import MemberDAO from "./dao/member.dao";
// import 

import { AppDataSource } from "./data-source";
import { Committee } from "./entity/Committee";
import { Member } from "./entity/Member";
import { Task } from "./entity/Task";

const committeeRepository = AppDataSource.getRepository(Committee);
 const memberRepository = AppDataSource.getRepository(Member);
 const taskRepository = AppDataSource.getRepository(Task);

export const committeeDAO = new CommitteeDAO(committeeRepository);
export const memberDAO = new MemberDAO(memberRepository);
export const taskDAO = new TaskDAO(taskRepository, memberDAO, memberRepository);
// const passwordTokenDAO = new PasswordTokenDAO(passwordTokenRepository);