import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"
import "isomorphic-fetch";

const domain: string = "https://graph.microsoft.com/v1.0/"


export class MailApi {
    sendEmail(accessToken: string, mail) {
        let url = domain + "me/sendMail";
        let request = new Request(
            url, {
            method: "POST",
            body: JSON.stringify({
                message: mail
            }),
            headers: new Headers({
                "Authorization": "Bearer " + accessToken,
                'Content-Type': 'application/json'
            })
        }
        );

        return fetch(request);
    }

    getEmail(accessToken: string) {
        let url = domain + "me/messages";
        let readMailRequest = new Request(url, {
            method: "GET",
            headers: new Headers({
                "Authorization": "Bearer " + accessToken
            })
        });

        return fetch(readMailRequest);
    }

    getLatestEmail(accessToken: string) {
        return this.getEmail(accessToken)
            .then((response) => response.json())
            .then((res) => {
                let messages: [MicrosoftGraph.Message] = res.value;
                return messages[0];
            });
    }

    getAttachments(accessToken: string, mailId: string) {
        let url = domain + "me/messages/" + mailId + "/attachments";
        let getAttachmentsRequest = new Request(url, {
            method: "GET",
            headers: new Headers({
                "Authorization": "Bearer " + accessToken
            })
        });

        return fetch(getAttachmentsRequest)
            .then((response) => response.json())
            .then((attachments) => attachments.value);
    }
}