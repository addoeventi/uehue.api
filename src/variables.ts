import { HandlebarsAdapter, MailerOptions, PugAdapter } from '@nest-modules/mailer';

export const VARIABLES = {
    "FORUM_MASTER_TOKEN": "55881e5c-f052-4376-b296-42372e25dd1b",
    "FORUM_ENDPOINT": "http://localhost:4567/api/v2"
};

export const MAILCONFIG: MailerOptions = {
    transport: 'smtps://info.bazzecco%40gmail.com:bazzecola@smtp.gmail.com',

    defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
            strict: true,
        },
    },
};

export const MAILSENDER = 'info@amgas.it'

export const RECOVERY_TEMPLATE = 'recovery'