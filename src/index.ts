const PORT = 9222;

function launchSlack() {
    const command = new Deno.Command("open", {
        args: [
            "/Applications/Slack.app",
            "--args",
            `--remote-debugging-port=${PORT}`,
        ],
    });
    command.spawn();
}

async function getWebSocketUrl(): Promise<string> {
    const response = fetch(`http://localhost:${PORT}/json/list`);
    const json = await (await response).json();

    return json[0].webSocketDebuggerUrl;
}

function createWebSocketConnection(
    url: string,
    onOpen: (ws: WebSocket) => void,
) {
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => {
        onOpen(ws);
    });
    ws.addEventListener("message", (event) => {
        console.log(event.data);
    });

    return ws;
}

function readInjection() {
    const decoder = new TextDecoder();
    const script = Deno.readFileSync("./injection/script.js");
    const style = Deno.readFileSync("./injection/style.css");

    return {
        script: decoder.decode(script),
        style: decoder.decode(style),
    };
}

async function main() {
    const { script, style } = readInjection();

    launchSlack();

    // wait for sec
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const wsUrl = await getWebSocketUrl();
    const onOpen = (ws: WebSocket) => {
        ws.send(
            JSON.stringify({
                id: 1,
                method: "Runtime.evaluate",
                params: { expression: script },
            }),
        );
        ws.send(
            // inject style with some trick
            JSON.stringify({
                id: 2,
                method: "Runtime.evaluate",
                params: {
                    expression: (() => {
                        // avoid syntax error by base64 encoding
                        const encoded = btoa(style);
                        return `document.body.appendChild(document.createElement('style')).textContent = atob('${encoded}')`;
                    })(),
                },
            }),
        );
    };
    createWebSocketConnection(wsUrl, onOpen);
}

main();
