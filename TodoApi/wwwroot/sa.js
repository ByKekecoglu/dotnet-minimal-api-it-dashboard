
const serverList = document.getElementById('serverList');


async function sunuculariYukle() {
    const response = await fetch('/servers');
    const servers = await response.json();

    serverList.innerHTML = '';

    servers.forEach(s => {
        const card = document.createElement('div');
        card.className = 'server-card ' + (s.online ? 'online' : 'offline');

        const h3 = document.createElement('h3');
        h3.textContent = s.name;

        const p = document.createElement('p');
        p.textContent = 'IP: ' + s.ip;

        const span = document.createElement('span');
        span.className = 'status';
        span.textContent = s.online ? 'Online' : 'Offline';

        const btn = document.createElement('button');
        btn.textContent = 'Durumu Değiştir';
        btn.addEventListener('click', () => durumuDegistir(s.id));

        card.append(h3, p, span, btn);
        serverList.appendChild(card);
    });
}


async function durumuDegistir(id) {
    await fetch('/servers/' + id + '/durum', { method: 'PUT' });
    sunuculariYukle();
}

const ticketForm = document.getElementById('ticketForm');
const ticketList = document.getElementById('ticketList');


async function biletleriYukle() {
    const response = await fetch('/todos');
    const todos = await response.json();

    ticketList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'ticket-item';

        const div = document.createElement('div');
        const p = document.createElement('p');
        p.textContent = todo.title;
        div.appendChild(p);

        const btn = document.createElement('button');
        btn.className = 'delete-btn';
        btn.textContent = 'Çözüldü / Sil';
        btn.addEventListener('click', () => biletiSil(todo.id));

        li.appendChild(div);
        li.appendChild(btn);
        ticketList.appendChild(li);
    });
} 

ticketForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const department = document.getElementById('department').value;
    const issue = document.getElementById('issue').value;

    const title = `${username} (${department}): ${issue}`;

    await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title })
    });

    ticketForm.reset();
    biletleriYukle();
});

async function biletiSil(id) {
    await fetch('/todos/' + id, { method: 'DELETE' });
    biletleriYukle();
}


biletleriYukle();
sunuculariYukle();