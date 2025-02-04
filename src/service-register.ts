import { SessionStorage } from './services/session-storage.service';

export interface ApplicationService {
    init: () => Promise<void>,
}

export const serviceRegister = {
    sessionStorage: new SessionStorage(),
}
