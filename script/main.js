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

            userBlock.innerHTML = `<div><i>Ідентифікатор користувача: </i><span>${user.id}</span></div><div><i>Ім'я користувача: </i><span>${user.name}</span></div>`;

            const userPageLink = createLink('Дізнатись більше', user.id, 'pages/user-details.html', userBlock, 'link user__link');

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

            userBlock.innerHTML = `<h1>${user.name}</h1><div><i>Ідентифікатор користувача: </i><span>${user.id}</span></div><div><i>Ім'я користувача: </i><span>${user.name}</span></div><div><i>Нік користувача: </i><span>${user.username}</span></div><div><i>Електронна пошта користувача: </i><span>${user.email}</span></div><div><i>Номер телефону користувача: </i><span>${user.phone}</span></div><div><i>Сайт користувача: </i><span>${user.website}</span></div>`;

            const userAddress = createAndAppendElement('div', userBlock, 'user__addition');
            const address = user.address;
            const geo = user.address.geo;
            userAddress.innerHTML = `<i>Адреса: </i><ul><li><i>Місто: </i><span>${address.city}</span></li><li><i>Вулиця: </i><span>${address.street}</span></li><li><i>Номер: </i><span>${address.suite}</span></li><li><i>Поштовий індекс: </i><span>${address.zipcode}</span></li><li><i>Геолокація: </i><span>${geo.lat} широти, ${geo.lng} довготи</span></li></ul>`;


            const userCompany = createAndAppendElement('div', userBlock, 'user__addition');
            const company = user.company;
            userCompany.innerHTML = `<i>Компанія: </i><ul><li><i>Назва: </i><span>${company.name}</span></li><li><i>Слоган: </i><span>${company.catchPhrase}</span></li><li><i>Business Strategy: </i><span>${company.bs}</span></li></ul>`;


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

                            const postLink = createLink('Дізнатись більше', post.id, 'post-details.html', postItem, 'link post__link');
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

            postBlock.innerHTML = `<h1>${post.title}</h1><div><i>Ідентифікатор поста: </i><span>${post.id}</span></div><div><i>Ідентифікатор користувача: </i><span>${post.userId}</span></div><p>${post.body}</p>`;

            const showCommentsBtn = createShowBtn('Показати коментарі', btn, 'button');

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