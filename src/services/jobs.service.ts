import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';

export class JobsService extends AbstractService {
    private interval: any;

    async init(): Promise<void> {
        await serviceRegister.skinportService.loadList();
        this.interval = setInterval(async () => {
            await serviceRegister.skinportService.loadList();
        }, 1000 * 60 * 4);
    }

    async destroy() {
        clearInterval(this.interval);
    }
}
