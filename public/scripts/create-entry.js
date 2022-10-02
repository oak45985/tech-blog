async function newEntryHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="entry-title"]').value;
    const entry_text = document.querySelector('textarea[name="entry-content"]').value;
    const entry_url = document.querySelector('input[name="entry-url"]').value;

    const response = await fetch(`/api/entries`, {
        method: 'post',
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
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
}

document.querySelector('.new-entry-form').addEventListener('submit', newEntryHandler);