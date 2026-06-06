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

  btn.innerHTML =
    '<span class="loading-dots"><span></span><span></span><span></span></span> Analyzing your device...';

  try {

    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        model,
        specs,
        condition,
        notes
      })
    });

    const data = await res.json();

    const raw = data.content
      .map(block => block.text || '')
      .join('');

    const clean = raw
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(clean);

    await fetch(
  "https://script.google.com/macros/s/AKfycbylzeIzjbZyls9jpd_UQk_-hyO1bw_0iiN1TZHFp-UgTskzpLkwW5ftYQhf4pV1d8NfOA/exec",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type,
      model,
      specs,
      condition,
      notes
    })
  }
);

    document.getElementById('quoteAmount').textContent =
      `$${parsed.low} – $${parsed.high}`;

    document.getElementById('quoteText').textContent =
      parsed.summary;

    const result =
      document.getElementById('quoteResult');

    result.classList.add('show');

    result.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });

  } catch (err) {
    console.error(err);

    alert(
      'Something went wrong getting your quote. Please try again.'
    );
  }

  btn.disabled = false;
  btn.innerHTML = 'Get My Quote →';
}
