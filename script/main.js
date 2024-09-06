if (window.location.href.includes('user-details.html')) {
    userDetailsCode();
} else if (window.location.href.includes('post-details.html')) {
    postDetailsCode();
} else {
    indexCode();
}

function indexCode() {
    const usersBlock = document.getElementsByClassName('users')[0];

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())
        .then(users => users.forEach(user => {
            const userBlock = createAndAppendElement('div', usersBlock, 'user');

            userBlock.innerHTML = `<div><i>id: </i><span>${user.id}</span></div><div><i>name: </i><span>${user.name}</span></div>`;

            const userPageLink = createLink('Learn more', user.id, 'pages/user-details.html', userBlock, 'link user__link');

            userPageLink.onclick = function () {
                sessionStorage.setItem('userId', userPageLink.id);
            };
        }));
}

function userDetailsCode() {
    const userId = sessionStorage.getItem('userId');

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            console.log(user)
            const userBlock = document.getElementsByClassName('user-details')[0];
            const postsBlock = document.getElementsByClassName('posts')[0];
            const btn = document.getElementsByClassName('btn')[0];

            for (const detail in user) {
                console.log(typeof user[detail] === 'object')
                if (typeof user[detail] === 'object') {
                    const detailList = createAndAppendElement('div', userBlock, 'user__addition');
                    detailList.innerHTML = `<i>${detail}: </i>`;
                    decomposedList(user[detail], detailList);
                } else {
                    const detailBlock = createAndAppendElement('div', userBlock);
                    detailBlock.innerHTML = `<i>${detail}: </i><span>${user[detail]}</span>`;
                }
            }

            const userPostsBtn = createShowBtn('Posts of current user', btn, 'button');

            userPostsBtn.onclick = function () {
                postsBlock.innerText = '';
                fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
                    .then(response => response.json())
                    .then(posts => {
                        const postsList = createAndAppendElement('ul', postsBlock, 'list posts__list');

                        for (const post of posts) {
                            const postItem = createAndAppendElement('li', postsList);
                            postItem.innerText = post.title;

                            const postLink = createLink('Learn more', post.id, 'post-details.html', postItem, 'link post__link');
                            postLink.onclick = function () {
                                sessionStorage.setItem('postId', postLink.id);
                            }
                        }
                    })
            }
        })
}

function postDetailsCode() {
    const postId = sessionStorage.getItem('postId');

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postBlock = document.getElementsByClassName('post')[0];
            const commentsBlock = document.getElementsByClassName('comments')[0];
            const btn = document.getElementsByClassName('btn')[0];

            postBlock.innerHTML = `<h1>${post.title}</h1><div><i>id: </i><span>${post.id}</span></div><div><i>user Id: </i><span>${post.userId}</span></div><p>${post.body}</p>`;

            const showCommentsBtn = createShowBtn('Show comments', btn, 'button');

            showCommentsBtn.onclick = function () {
                commentsBlock.innerText = '';
                const commentsList = createAndAppendElement('ul', commentsBlock, 'list comments__list');

                fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
                    .then(response => response.json())
                    .then(comments => {
                        comments.forEach(comment => {
                            const commentItem = createAndAppendElement('li', commentsList);
                            commentItem.innerHTML = `<h4>${comment.name}</h4><div>${comment.email}</div><p>${comment.body}</p>`;
                        });
                    })
            }
        })
}

function createAndAppendElement(element, appendTo, className) {
    const elementItem = document.createElement(element);
    appendTo.appendChild(elementItem);
    if (arguments.length === 3) {
        const classNameArray = className.split(' ');
        classNameArray.forEach(className => elementItem.classList.add(className));
    }

    return elementItem;
}

const createLink = (text, id, pathToPage, appendTo, className) => {
    const link = createAndAppendElement('a', appendTo, className)
    link.innerText = text;
    link.id = id;
    link.href = pathToPage;

    return link;
}

const createShowBtn = (text, appendTo, className) => {
    const btn = createAndAppendElement('button', appendTo, className);
    btn.innerText = text;

    return btn;
}

const decomposedList = (obj, appendTo) => {
    const list = createAndAppendElement('ul', appendTo);
    for (const objItem in obj) {
        if (typeof obj[objItem] === 'object') {
            const listItem = createAndAppendElement('li', list, 'list__addition-dec');
            listItem.innerHTML = `<i>${objItem}: </i>`;
            decomposedList(obj[objItem], listItem);
        } else {
            const listItem = createAndAppendElement('li', list);
            listItem.innerHTML = `<i>${objItem}: </i><span>${obj[objItem]}</span>`;
        }
    }
    // console.log(list);
    return list;
}