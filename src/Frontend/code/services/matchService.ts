import { CAppConfigs } from "../match/matchSharedDependencies/SetupDependencies";

class MatchService {
    async init() {
    }

    private _configs: CAppConfigs | null = null;
}

export const matchService = new MatchService()