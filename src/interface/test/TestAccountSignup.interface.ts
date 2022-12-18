import { TestAccountLogin } from "./TestAccountLogin.interface";

export interface TestAccountSignup extends TestAccountLogin {
    // email field from TestAccountLogin
    fakeGoogleId: string;
    displayName: string;
}
