import * as MicrosoftGraph from "@microsoft/microsoft-graph-types"


export class MailApi {
    sendMail (accessToken: string, mail) {
        let url = "https://graph.microsoft.com/v1.0/me/sendMail";
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

    readMail (accessToken: string, subject: string) {
        let received = "https://graph.microsoft.com/v1.0/me/messages";
        let readMailRequest = new Request(received, {
            method: "GET",
            headers: new Headers({
                "Authorization": "Bearer " + accessToken
            })
        });

        return fetch(readMailRequest);
    }
}