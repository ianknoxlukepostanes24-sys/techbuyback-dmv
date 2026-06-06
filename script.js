/* =====================
   AI QUOTE TOOL
   ===================== */
async function getQuote() {
  const type      = document.getElementById('deviceType').value;
  const model     = document.getElementById('deviceModel').value;
  const specs     = document.getElementById('deviceSpecs').value;
  const condition = document.getElementById('deviceCondition').value;
  const notes     = document.getElementById('deviceNotes').value;

  if (!type || !model || !condition) {
    alert('Please fill in device type, model, and condition.');
    return;
  }

  const btn = document.getElementById('quoteBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading-dots"><span></span><span></span><span></span></span> Analyzing your device...';

  const prompt = `You are a tech buyback pricing expert for TechBuyBack DMV, a local electronics buyback business serving DC, Maryland, and Virginia.

A customer wants to sell:
- Device Type: ${type}
- Brand & Model: ${model}
- Specs: ${specs || 'Not specified'}
- Condition: ${condition}
- Notes: ${notes || 'None'}

Give a fair buyback offer estimate. Respond ONLY with a JSON object in this exact format (no markdown, no explanation outside the JSON):
{
  "low": 45,
  "high": 75,
  "summary": "2-3 sentence explanation of the estimate, mentioning condition and market value briefly. Sound helpful and local/personal."
}

Use realistic 2026 resale market values. For not-working devices, offer 10-25% of working value. Never include dollar signs in the number fields.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data  = await res.json();
    const raw   = data.content.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    document.getElementById('quoteAmount').textContent = `$${parsed.low} – $${parsed.high}`;
    document.getElementById('quoteText').textContent   = parsed.summary;

    const result = document.getElementById('quoteResult');
    result.classList.add('show');
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (err) {
    console.error('Quote error:', err);
    alert('Something went wrong getting your quote. Please try again.');
  }

  btn.disabled = false;
  btn.innerHTML = 'Get My Quote →';
}

/* =====================
   RESET QUOTE FORM
   ===================== */
function resetQuote() {
  document.getElementById('quoteResult').classList.remove('show');
  document.getElementById('deviceType').value      = '';
  document.getElementById('deviceModel').value     = '';
  document.getElementById('deviceSpecs').value     = '';
  document.getElementById('deviceCondition').value = '';
  document.getElementById('deviceNotes').value     = '';
}

/* =====================
   SMOOTH SCROLL
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
