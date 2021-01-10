(function () {
    const vscode = acquireVsCodeApi();
    const oldState = vscode.getState() || { params: [] };

    let params = oldState.params || [];

    updateParamList(params);

    document.querySelector('.replaceByGroup').addEventListener('click', () => {
        inputG = document.querySelector('#groupValue');
        let groupReplaceParams = []
        for (const param of params) {
            if (inputG.value == param.group) {
                groupReplaceParams.push(param)
            }
        }
        vscode.postMessage({ type: 'replaceAllAction', value: groupReplaceParams });
    });

    window.addEventListener('message', event => {
        const message = event.data;
        switch (message.type) {
            case 'addParam': {
                addParam();
                break;
            } case 'replaceAll': {
                replaceAll();
                break;
            } case 'clearAll': {
                params = [];
                updateParamList(params);
                break;
            } case 'updateParams': {
                for (const param of message.value) {
                    params.push(param);
                }
                updateParamList(params);
            }
        }
    });

    function updateParamList(params) {
        const ul = document.querySelector('.param-list');
        ul.textContent = '';
        for (const param of params) {
            const li = document.createElement('li');
            li.className = 'param-entry'

            const inputG = document.createElement('input');
            inputG.className = 'inputG';
            inputG.type = 'text';
            inputG.value = param.group
            inputG.placeholder = 'unGrouped'
            inputG.addEventListener('change', (e) => {
                const value = e.target.value;
                if(!value) {
                    param.group = '';
                } else {
                    param.group = value;
                }
                updateParamList(params)
            });
            li.appendChild(inputG);

            const inputK = document.createElement('input');
            inputK.className = 'inputK';
            inputK.type = 'text';
            inputK.value = param.key;
            inputK.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) {
                    params.splice(params.indexOf(param), 1);
                } else {
                    param.key = value;
                }
                updateParamList(params);
            });
            li.appendChild(inputK);

            const inputV = document.createElement('input');
            inputV.className = 'inputV';
            inputV.type = 'text';
            inputV.value = param.value;
            inputV.addEventListener('change', (e) => {
                const value = e.target.value;
                if (!value) {
                    param.value = ''
                } else {
                    param.value = value;
                }
                updateParamList(params);
            });
            li.appendChild(inputV);

            const replaceBtn = document.createElement('button');
            replaceBtn.className = 'replaceBtn';
            replaceBtn.innerHTML = '<i class="codicon codicon-replace"></i>';
            replaceBtn.title = 'Replace';
            replaceBtn.addEventListener('click', (e) => {
                const param_s = [param];
                vscode.postMessage({ type: 'replaceAllAction', value: param_s });
            });
            li.appendChild(replaceBtn);

            const clearBtn = document.createElement('button');
            clearBtn.className = 'clearBtn';
            clearBtn.innerHTML = '<i class="codicon codicon-trash"></i>';
            clearBtn.title = 'Delete';
            clearBtn.addEventListener('click', (e) => {
                params.splice(params.indexOf(param), 1);
                updateParamList(params);
            });
            li.appendChild(clearBtn)

            ul.appendChild(li)
        }
        vscode.postMessage({ type: 'updateParams', value: params });
        vscode.setState({ params: params});
    }

    function addParam() {
        params.push({ group: '', key: 'Key', value: 'Value' });
        updateParamList(params);
    }

    function replaceAll() {
        vscode.postMessage({ type: 'replaceAllAction', value: params });
    }

}());