(function () {
    const vscode = acquireVsCodeApi();

    let params = []
    let text = ''

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'reScan': {
                params = message.value;
                text = message.editor;
                updateScannerView(params, text)
                break;
            } case 'getParams': {
                params = message.value;
                break;
            }
        }
    });

    function updateScannerView(params, text) {
        const ul = document.querySelector('.scanner-list');
        ul.textContent = '';
        let keys = []
        for (const param of params) {
            keys.push(param.key)
        }
        keys = [...new Set(keys)]
        for (const key of keys) {
            const count = text.split(key).length - 1;
            if (count > 0) {
                const li = document.createElement('li');
                li.className = 'scanner-entry'

                const textK = document.createElement('div');
                textK.innerHTML = key
                li.appendChild(textK)
                const textC = document.createElement('div');
                textC.innerHTML = '<span class="bubble">' + count + '</span>'
                li.appendChild(textC)

                ul.appendChild(li)
            }
        }
    }

    function getParams() {
        vscode.postMessage({ type: 'getParams' })
    }
}());