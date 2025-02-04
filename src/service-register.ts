import { SessionStorage } from './services/session-storage.service';
import { UsersService } from './services/users.service';

export interface ApplicationService {
    init: () => Promise<void>,
}

export const serviceRegister = {
    sessionStorage: new SessionStorage(),
    usersService: new UsersService(),
}
