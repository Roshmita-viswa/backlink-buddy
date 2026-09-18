// Backlink Buddy - shared JavaScript
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn) menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));

// Demo backlink checker
const checkBtn = document.getElementById('checkBtn');
if (checkBtn) {
  checkBtn.addEventListener('click', () => {
    const input = document.getElementById('domain');
    const message = document.getElementById('checkMessage');
    const domain = input.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!domain || !domain.includes('.')) {
      message.textContent = 'Please enter a domain such as example.com.';
      document.getElementById('results').classList.add('hidden');
      return;
    }
    message.textContent = '';
    let seed = 0;
    for (let i = 0; i < domain.length; i++) seed += domain.charCodeAt(i) * (i + 1);
    const backlinks = 120 + (seed % 8800);
    const domains = 15 + (seed % 480);
    const dofollow = 55 + (seed % 36);
    const quality = 35 + (seed % 61);
    document.getElementById('backlinks').textContent = backlinks.toLocaleString();
    document.getElementById('domains').textContent = domains.toLocaleString();
    document.getElementById('dofollow').textContent = dofollow + '%';
    document.getElementById('quality').textContent = quality + '/100';
    document.getElementById('scoreLabel').textContent = quality + '%';
    document.getElementById('scoreBar').style.width = quality + '%';
    document.getElementById('resultText').textContent =
      domain + ' has a simulated profile with ' + backlinks.toLocaleString() +
      ' backlinks from ' + domains.toLocaleString() +
      ' referring domains. Use these numbers only to practice interpreting common SEO metrics.';
    document.getElementById('results').classList.remove('hidden');
  });
}

// Demo backlink audit
const addLink = document.getElementById('addLink');
if (addLink) {
  const links = [];
  const renderAudit = () => {
    const tbody = document.querySelector('#auditTable tbody');
    tbody.innerHTML = '';
    if (!links.length) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">No backlinks yet. Add one above to begin your audit.</td></tr>';
    }
    links.forEach((link, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${escapeHTML(link.source)}</td><td>${escapeHTML(link.anchor)}</td><td>${link.type}</td><td>${link.relevance}</td><td><button class="remove" data-index="${index}">Remove</button></td>`;
      tbody.appendChild(row);
    });
    document.querySelectorAll('.remove').forEach(btn => btn.addEventListener('click', () => {
      links.splice(Number(btn.dataset.index), 1); renderAudit(); updateScore();
    }));
    document.getElementById('linkCount').textContent = links.length;
  };
  const updateScore = () => {
    if (!links.length) {
      document.getElementById('auditScore').textContent = '—';
      document.getElementById('auditStatus').textContent = 'Waiting';
      return;
    }
    let score = 0;
    links.forEach(l => {
      score += l.relevance === 'high' ? 30 : l.relevance === 'medium' ? 20 : 8;
      score += l.type === 'dofollow' ? 20 : 10;
      score += l.anchor.length > 3 ? 5 : 1;
    });
    score = Math.min(100, Math.round(score / links.length));
    document.getElementById('auditScore').textContent = score + '/100';
    document.getElementById('auditStatus').textContent = score >= 70 ? 'Review looks healthy' : 'Needs review';
  };
  addLink.addEventListener('click', () => {
    const source = document.getElementById('sourceUrl').value.trim();
    const anchor = document.getElementById('anchorText').value.trim();
    if (!source || !anchor) { alert('Please enter both a source URL and anchor text.'); return; }
    links.push({
      source, anchor,
      type: document.getElementById('linkType').value,
      relevance: document.getElementById('relevance').value
    });
    document.getElementById('sourceUrl').value = '';
    document.getElementById('anchorText').value = '';
    renderAudit(); updateScore();
  });
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

// Keep checklist progress in this browser
document.querySelectorAll('.checklist input').forEach((box, i) => {
  const key = 'backlinkBuddyCheck' + i;
  box.checked = localStorage.getItem(key) === 'true';
  box.addEventListener('change', () => localStorage.setItem(key, box.checked));
});
