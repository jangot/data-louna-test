import { ApplicationService } from '../service-register';

export class AbstractService implements ApplicationService {
    async init (): Promise<void> {};
    async destroy (): Promise<void> {};
}
