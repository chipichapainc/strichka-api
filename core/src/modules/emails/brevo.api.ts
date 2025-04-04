import { Logger } from "@nestjs/common"
import * as brevo from "@getbrevo/brevo"
import { IncomingMessage } from "http"
import { response } from "express"

export class BrevoAPI {
    private readonly logger = new Logger(BrevoAPI.name)

    private readonly transactionalEmailsAPI: brevo.TransactionalEmailsApi
    private readonly sendersApi: brevo.SendersApi

    constructor(
        apiKey: string,
    ) {
        this.transactionalEmailsAPI = new brevo.TransactionalEmailsApi()
        this.transactionalEmailsAPI.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            apiKey
        )

        this.sendersApi = new brevo.SendersApi()
        this.sendersApi.setApiKey(
            brevo.SendersApiApiKeys.apiKey,
            apiKey
        )
    }

    private async handleRequest<TBody>(req: Promise<{
        response: IncomingMessage;
        body: TBody;
    }>) {
        try {
            const { response, body } = await req;
            return body
        } catch(e) {
            this.logger.error(response.json())
            throw e
        }
    }

    public async getSenders() {
        const { senders } = await this.handleRequest(this.sendersApi.getSenders())
        return senders
    }

    public async sendTransactionalEmail(params: brevo.SendSmtpEmail) {
        const sendSmtpEmail = Object.assign(new brevo.SendSmtpEmail(), params);
        const { messageId } = await this.handleRequest(
            this.transactionalEmailsAPI.sendTransacEmail(sendSmtpEmail)
        )
        return messageId
    }
}
