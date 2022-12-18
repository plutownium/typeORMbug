import OnboardingStepsDAO from "../db/dao/onboardingSteps.dao";

class OnboardingService {
    private onboardingStepsDAO: OnboardingStepsDAO;
    constructor(onboardingStepsDAO: OnboardingStepsDAO) {
        this.onboardingStepsDAO = onboardingStepsDAO;
    }

    public async storePdfUrl(pdfUrl: string) {
        //
    }

    public async getAllSteps() {
        //
        return await this.onboardingStepsDAO.getAllSteps();
    }

    public async updateStep(stepId: number) {
        //
    }

    public async deleteStep(stepId: number) {
        //
    }
}

export default OnboardingService;
