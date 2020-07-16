import { expect } from 'chai';
import * as chai from 'chai';
import 'mocha';
import chaiHttp = require('chai-http');
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import "isomorphic-fetch";

import { MailApi } from '../page-objects/mail.po';
import { MailHelper } from '../page-objects/mail.helper';

const user1_email: string = process.env.USER1_EMAIL;
const user2_email: string = process.env.USER2_EMAIL;
const user1_password: string = process.env.USER1_PASSWORD;
const user2_password: string = process.env.USER2_PASSWORD;
const mailHelper: MailHelper = new MailHelper();
const mailApi: MailApi = new MailApi();

let user1_accessToken: string;
let user2_accessToken: string;

chai.use(chaiHttp);

describe('Send e-mail tests: ', () => {

    before(async function () {
        user1_accessToken = await mailHelper.getAccessToken(user1_email, user1_password),
        user2_accessToken = await mailHelper.getAccessToken(user2_email, user2_password)
    });

    it('Should deliver simple e-mail as written', () => {
        let date: Date = new Date();
        let testMailSubject: string = `[POTATO] Test sent on: ${date}`;
        let testMailContent: string = "<h1>This is a test potato with email</h1>It has a link to <a href=\"https://en.wikipedia.org/wiki/Potato\">the potato wiki page</a>."
        let mail: MicrosoftGraph.Message = {
            subject: testMailSubject,
            toRecipients: [{
                emailAddress: {
                    address: user2_email
                }
            }],
            body: {
                content: testMailContent,
                contentType: "html"
            }
        }

        return mailApi
            .sendEmail(user1_accessToken, mail)
            .then((response) => expect(response).to.have.status(202))
            .then(() => mailHelper.sleep(3000)) // wait for e-mail to be delivered
            .then(() => mailApi.getLatestEmail(user2_accessToken))
            .then((mail) => {
                expect(mail.subject).to.equal(testMailSubject);
                expect(mail.body.content).to.contain(testMailContent);
            });
    });

    it('Should deliver e-mail with an attachment, as written', () => {
        let date: Date = new Date();
        let testMailSubject: string = `[POTATO] Response Test sent on: ${date}`;
        let testMailContent: string = "In the attached file you can find a nice potato";
        let attachmentOne = {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: "potato.txt",
            contentType: "text/plain",
            contentBytes: "ICAgICAgICAgICAgICAuLSInIi0uCiAgICAgICAgICAgICB8ICAgICAgIHwgIAogICAgICAgICAgIChgLS5fX19fXy4tJykKICAgICAgICAuLiAgYC0uX19fX18uLScgIC4uCiAgICAgIC4nLCA6Li8nLj09ID09LmBcLjogLGAuCiAgICAgOiAoICA6ICAgX19fIF9fXyAgIDogICkgOwogICAgICcuXy46ICAgIHwwfCB8MHwgICAgOi5fLicKICAgICAgICAvICAgICBgLSdfYC0nICAgICBcCiAgICAgIF8ufCAgICAgICAvIFwgICAgICAgfC5fCiAgICAuJy4tfCAgICAgICggICApICAgICAgfC0uYC4KICAgLy8nICB8ICAuLSJgImAtJyJgIi0uICB8ICBgXFwgCiAgfHwgICAgfCAgYH4iOi0uLi4tOiJ+YCAgfCAgICB8fAogIHx8ICAgICBcLiAgICBgLS0tJyAgICAuLyAgICAgfHwKICB8fCAgICAgICAnLS5fICAgICBfLi0nICAgICAgIHx8CiAvICBcICAgICAgIF8vIGB+On5gIFxfICAgICAgIC8gIFwKfHx8fFwpICAgLi0nICAgIC8gXCAgICBgLS4gICAoL3x8fHwKXHx8fCAgICAoYC5fX18uJyktKGAuX19fLicpICAgIHx8fC8KICciJyBqZ3MgYC0tLS0tJyAgIGAtLS0tLScgICAgICciJw=="
        };
        let attachmentTwo = {
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: "hello.txt",
            contentType: "text/plain",
            contentBytes: "SGVsbG8gV29ybGQh"
        };
        let mail = {
            subject: testMailSubject,
            toRecipients: [{
                emailAddress: {
                    address: user1_email
                }
            }],
            body: {
                content: testMailContent,
                contentType: "html"
            },
            attachments: [attachmentOne, attachmentTwo]
        };

        return mailApi
            .sendEmail(user2_accessToken, mail)
            .then((response) => expect(response).to.have.status(202))
            .then(() => mailHelper.sleep(3000)) // wait for e-mail to be delivered
            .then(() => mailApi.getLatestEmail(user1_accessToken))
            .then((mail) => {
                expect(mail.subject).to.equal(testMailSubject);
                expect(mail.body.content).to.contain(testMailContent);
                return mail.id;
            })
            .then((id) => mailApi.getAttachments(user1_accessToken, id))
            .then((attachments) => {
                expect(attachments).to.not.equal(null);
                expect(attachments[0].name).to.equal(attachmentOne.name);
                expect(attachments[0].contentBytes).to.equal(attachmentOne.contentBytes);
                expect(attachments[1].name).to.equal(attachmentTwo.name);
                expect(attachments[1].contentBytes).to.equal(attachmentTwo.contentBytes);
            });
    });
})