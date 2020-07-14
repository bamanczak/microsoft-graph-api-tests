import { MailApi } from '../page-objects/mail.po';
import { MailHelper } from '../page-objects/mail.helper';


import { expect } from 'chai';
import * as chai from 'chai';
import 'mocha';
import chaiHttp = require('chai-http');
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import "isomorphic-fetch";
let user1_accessToken: string;
let user2_accessToken: string;
const user1_email: string = process.env.USER1_EMAIL;
const user2_email: string = process.env.USER2_EMAIL;
const user1_password: string = process.env.USER1_PASSWORD;
const user2_password: string = process.env.USER2_PASSWORD;
const myUtils: MailHelper = new MailHelper();
const mailApi: MailApi = new MailApi();


if (!global.Promise) {
    global.Promise = require('q');
}
chai.use(chaiHttp);

describe('Send e-mail tests: ', () => {

    before(async function () {
        // Increas
        this.timeout(5000);
        Promise.all([
            user1_accessToken = await myUtils.getAccessToken(user1_email, user1_password),
            user2_accessToken = await myUtils.getAccessToken(user2_email, user2_password)
        ]);
      });



    it('Should deliver simple e-mail as written', () => {
        let date: Date = new Date();
        let testMailSubject: string = "[POTATO] Test sent on: " + date;
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
            .sendMail(user1_accessToken, mail)
            .then((response) => {
                expect(response).to.have.status(202);
            })
            .then(() => {
                // Wait for e-mail to be delivered
                return myUtils.sleep(2000);
            })
            .then(() => {
                return mailApi.readMail(user2_accessToken, testMailSubject);
            })
            .then((response) => {
                return response.json().then((res) => {
                    let messages: [MicrosoftGraph.Message] = res.value;
                    expect(messages[0].subject).to.equal(testMailSubject);
                    expect(messages[0].body.content).to.contain(testMailContent);
                });
            });
    }).timeout(5000);

    it('Should deliver e-mail with an attachment, as written', () => {
        let date: Date = new Date();
        let testMailSubject: string = "[POTATO] Response Test sent on: " + date;
        let testMailContent: string = "In the attached file you can find a nice potato";
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
            attachments: [
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    name: "potato.txt",
                    contentType: "text/plain",
                    contentBytes: "ICAgICAgICAgICAgICAuLSInIi0uCiAgICAgICAgICAgICB8ICAgICAgIHwgIAogICAgICAgICAgIChgLS5fX19fXy4tJykKICAgICAgICAuLiAgYC0uX19fX18uLScgIC4uCiAgICAgIC4nLCA6Li8nLj09ID09LmBcLjogLGAuCiAgICAgOiAoICA6ICAgX19fIF9fXyAgIDogICkgOwogICAgICcuXy46ICAgIHwwfCB8MHwgICAgOi5fLicKICAgICAgICAvICAgICBgLSdfYC0nICAgICBcCiAgICAgIF8ufCAgICAgICAvIFwgICAgICAgfC5fCiAgICAuJy4tfCAgICAgICggICApICAgICAgfC0uYC4KICAgLy8nICB8ICAuLSJgImAtJyJgIi0uICB8ICBgXFwgCiAgfHwgICAgfCAgYH4iOi0uLi4tOiJ+YCAgfCAgICB8fAogIHx8ICAgICBcLiAgICBgLS0tJyAgICAuLyAgICAgfHwKICB8fCAgICAgICAnLS5fICAgICBfLi0nICAgICAgIHx8CiAvICBcICAgICAgIF8vIGB+On5gIFxfICAgICAgIC8gIFwKfHx8fFwpICAgLi0nICAgIC8gXCAgICBgLS4gICAoL3x8fHwKXHx8fCAgICAoYC5fX18uJyktKGAuX19fLicpICAgIHx8fC8KICciJyBqZ3MgYC0tLS0tJyAgIGAtLS0tLScgICAgICciJw=="
                },
                {
                    "@odata.type": "#microsoft.graph.fileAttachment",
                    "name": "hello.txt",
                    "contentType": "text/plain",
                    "contentBytes": "SGVsbG8gV29ybGQh"
                  }
            ]
        };
        return mailApi
            .sendMail(user2_accessToken, mail)
            .then((response) => {
                expect(response).to.have.status(202);
            })
            .then(() => {
                return myUtils.sleep(2000);
            })
            .then(() => {
                return mailApi.readMail(user1_accessToken, testMailSubject);
            })
            .then((response) => {
                return response.json().then((res) => {
                    let messages: [MicrosoftGraph.Message] = res.value;
                    expect(messages[0].subject).to.equal(testMailSubject);
                    expect(messages[0].body.content).to.contain(testMailContent);
                });
            });

    }).timeout(5000);
})