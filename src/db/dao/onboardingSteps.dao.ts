import { Repository } from "typeorm";
import { OnboardingStep } from "../entity/OnboardingStep";

class OnboardingStepDAO {
    private onboardingStepsRepository: Repository<OnboardingStep>;
    constructor(onboardingStepsRepository: Repository<OnboardingStep>) {
        this.onboardingStepsRepository = onboardingStepsRepository;
    }
}

export default OnboardingStepDAO;
