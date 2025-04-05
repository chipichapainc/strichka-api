import { Injectable, Logger } from "@nestjs/common";
import { BrevoAPI } from "./brevo.api";
import * as brevo from "@getbrevo/brevo"
import * as hbs from 'handlebars';
import * as fs from 'fs/promises'
import * as path from 'path'
import { filesByExtension } from "src/common/helpers/files-by-extension";
import { EmailsService } from "./emails.service";
// import { TTicketEmailParams } from "./types/tickets-email-params.type";

@Injectable()
export class BrevoEmailsService implements EmailsService {
    private readonly logger = new Logger(BrevoEmailsService.name)
    private readonly api: BrevoAPI
    private readonly TEMPLATES_PATH = "./src/modules/emails/templates"

    public sender: brevo.GetSendersListSendersInner

    constructor(apiKey: string) {
        this.api = new BrevoAPI(apiKey)
    }

    async onModuleInit() {
        const [sender] = await this.api.getSenders()
        this.sender = sender
        
        const templates = await filesByExtension(this.TEMPLATES_PATH, '.handlebars');
        for(let template of templates) {
            const { name } = path.parse(template)
            const templateRaw = await fs.readFile(template, 'utf-8')
            hbs.partials[name] = hbs.compile<string>(templateRaw, {})
            this.logger.log(`Template ${name} precompiled`)
        }
    }
    
    // get ticketsEmailTemplate() { return hbs.partials["tickets.email"] }
    // get ticketTemplate() { return hbs.partials["ticket"] }
}