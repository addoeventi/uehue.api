import { HandlebarsAdapter, MailerOptions, PugAdapter } from '@nest-modules/mailer';

export const VARIABLES = {
    "FORUM_MASTER_TOKEN": "55881e5c-f052-4376-b296-42372e25dd1b",
    "FORUM_ENDPOINT": "http://community.uehue.com/api/v2"
};

export const MAILCONFIG: MailerOptions = {
    transport: 'smtps://no-reply%40uehue.com:Uehue2020@smtps.aruba.it',

    defaults: {
        from: '"Uehue Team" <no-reply@uehue.com>',
    },
    template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
            strict: true,
        },
    },
};

export const MAILSENDER = 'info@uehue.com'

export const RECOVERY_TEMPLATE = 'recovery'