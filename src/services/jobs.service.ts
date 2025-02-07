import { AbstractService } from './abstract-service';
import { serviceRegister } from '../service-register';

export class JobsService extends AbstractService {
    private interval: any;

    async init(): Promise<void> {
        serviceRegister.skinportService.getOneList(false);
        serviceRegister.skinportService.getOneList(true);
        this.interval = setInterval(async () => {
            serviceRegister.skinportService.getOneList(false);
            serviceRegister.skinportService.getOneList(true);
        }, 1000 * 60 * 4);
    }

    async destroy() {
        clearInterval(this.interval);
    }
}
