async function updateEntryHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="entry-title"]').value.trim();
    const entry_text = document.querySelector('textarea[name="entry-content"]').value.trim();
    const entry_url = document.querySelector('input[name="entry-url"]').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    const response = await fetch(`/api/entries/${id}`, {
        method: 'put',
        body: JSON.stringify({
            title,
            entry_text,
            entry_url
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}   

document.querySelector('.update-entry').addEventListener('submit', updateEntryHandler);