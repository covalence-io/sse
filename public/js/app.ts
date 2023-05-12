(function () {
    const btn = <HTMLButtonElement>document.getElementById('stream');
    const messages = <HTMLElement>document.getElementById('messages');
    const retry = false;

    function showMessage(message: string) {
        if (!messages) {
            return;
        }

        messages.textContent += `\n${message}`;
        messages.scrollTop = messages.scrollHeight;
    }

    async function parse(data: string) {
        if (!data) {
            return;
        }

        try {
            const d = JSON.parse(data);

            showMessage(d.value);
        } catch (e) {
            console.log('Error parsing data:');
            console.log(e);
        }
    }

    if (!btn) {
        console.log('You messed up - no button :(');
        return;
    }

    btn.addEventListener('click', () => {
        const evs = new EventSource('/api/v1/users/stats');

        evs.addEventListener('error', (e) => {
            console.log(e);

            // determine whether or not to retry
            if (!retry) {
                evs.close();
            }
        });

        evs.addEventListener('close', () => {
            evs.close();
            showMessage('Connection Closed');
        });

        evs.addEventListener('message', (ev) => {
            parse(ev.data);
        });
    });
})();