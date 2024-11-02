function openModal() {
    document.getElementById('newThreadModal').style.display = 'flex';
}


function closeModal() {
    document.getElementById('newThreadModal').style.display = 'none';
}


function handleSubmit(event) {
    event.preventDefault();
    const content = document.getElementById('threadContent').value.trim();

    if (content) {
        addPost(content);
        document.getElementById('threadContent').value = '';
        closeModal();
    }
}


function addPost(content) {
    const postList = document.getElementById('postList');
    const postItem = document.createElement('div');
    postItem.className = 'post-item';
    postItem.textContent = content;

    postList.insertBefore(postItem, postList.firstChild);
}
