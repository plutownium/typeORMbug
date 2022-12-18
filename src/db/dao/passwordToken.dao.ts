// import { Equal, Repository } from "typeorm";
// //
// import { PasswordToken } from "../entity/PasswordToken";
// import { Member } from "../entity/Member";

// class PasswordTokenDAO {
//     private passwordTokenRepository;
//     constructor(passwordTokenRepository: Repository<PasswordToken>) {
//         this.passwordTokenRepository = passwordTokenRepository;
//     }

//     public createPasswordToken = async (user: Member, hexValue: string, expires: Date) => {
//         const passwordToken = new PasswordToken();
//         passwordToken.hexValue = hexValue;
//         passwordToken.expires = expires;
//         passwordToken.user = user;
//         await this.passwordTokenRepository.save(passwordToken);
//         return passwordToken;
//     };

//     public getPasswordTokenByUserId = async (userId: number) => {
//         return await this.passwordTokenRepository.findOne({ relations: { user: true }, where: [{ user: Equal(userId) }] });
//         // return await PasswordToken.findOne({ where: { acctId: acct[0].acctId } });
//     };

//     public getPasswordTokenByToken = async (hexValue: string) => {
//         return await this.passwordTokenRepository.findOne({
//             where: { hexValue },
//         });
//     };

//     public getAllPasswordTokensForAccount = async (userId: number) => {
//         return await this.passwordTokenRepository.find({
//             relations: { user: true },
//             where: [
//                 {
//                     user: Equal(userId),
//                 },
//             ],
//         });
//     };

//     public getAllPasswordTokens = async () => {
//         //
//     };

//     public deletePasswordTokenById = (tokenId: number) => {
//         //
//     };

//     public deletePasswordTokenByModel = (passwordToken: PasswordToken) => {
//         //
//     };
// }

// export default PasswordTokenDAO;
