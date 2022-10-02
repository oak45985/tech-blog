async function observeFormHandler(event) {
    event.preventDefault();

    const observation_text = document.querySelector('textarea[name="observe-content"]').value;
    const entry_id = window.location.toString().split('/')[
        window.location.toString().split('/').length -1
    ];

    if (observation_text) {
        const response = await fetch('/api/observations', {
            method: 'post',
            body: JSON.stringify({
                entry_id,
                observation_text
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if(response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.observe-form').addEventListener('submit', observeFormHandler);