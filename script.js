document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.querySelector('.custom-cursor');
    const revealContainer = document.querySelector('.hover-reveal');
    const revealImg = document.querySelector('.hover-reveal-img');
    const revealVideo = document.querySelector('.hover-reveal-video');
    const revealFrame = document.querySelector('.hover-reveal-frame');
    const revealItems = document.querySelectorAll('.reveal-item');

    // 1. Muspekare & Interaktivitet
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });

        const interactiveElements = document.querySelectorAll('a, button, select, input, .reveal-item');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.4)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // 2. Fullskärms Hover Reveal (Bilder, Videor & HTML-sidor)
    if (revealContainer && revealItems.length > 0) {
        revealItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const htmlUrl = item.getAttribute('data-html');
                const videoUrl = item.getAttribute('data-video');
                const imgUrl = item.getAttribute('data-image');

                if (htmlUrl && revealFrame) {
                    if (revealFrame.getAttribute('src') !== htmlUrl) {
                        revealFrame.src = htmlUrl;
                    }
                    revealContainer.classList.remove('has-video');
                    revealContainer.classList.add('has-html');
                    revealContainer.classList.add('active');
                } else if (videoUrl && revealVideo) {
                    revealVideo.src = videoUrl;
                    revealVideo.play().catch(() => {});
                    revealContainer.classList.remove('has-html');
                    revealContainer.classList.add('has-video');
                    revealContainer.classList.add('active');
                } else if (imgUrl && revealImg) {
                    revealImg.src = imgUrl;
                    revealContainer.classList.remove('has-html');
                    revealContainer.classList.remove('has-video');
                    revealContainer.classList.add('active');
                }
            });

            item.addEventListener('mouseleave', () => {
                revealContainer.classList.remove('active');
                if (revealVideo) {
                    revealVideo.pause();
                }
            });
        });
    }

    // 3. Säker Klickspårning för DataLayer (VG-krav)
    const clickableElements = document.querySelectorAll("h1, h2, h3, .item-text, .track-click");

    if (clickableElements && clickableElements.length > 0) {
        clickableElements.forEach(function (element) {
            element.addEventListener("click", function (e) {
                const clickedText = this.innerText ? this.innerText.trim() : "";
                const tagType = this.tagName;

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'heading_click',
                    'heading_text': clickedText,
                    'heading_type': tagType
                });

                console.log("Custom event pushed:", clickedText);
            });
        });
    }
});

// Koordinater för tyska matchstäder
const matchCities = {
  "Düsseldorf": { lat: 51.2217, lon: 6.7762 },
  "Köln": { lat: 50.9333, lon: 6.9500 },
  "Dortmund": { lat: 51.5139, lon: 7.4653 },
  "München": { lat: 48.1371, lon: 11.5754 },
  "Gelsenkirchen": { lat: 51.5175, lon: 7.1003 }
};

const apiBtn = document.getElementById("search-api-btn");

if (apiBtn) {
  apiBtn.addEventListener("click", async function () {
    const loadingEl = document.getElementById("api-loading");
    const resultEl = document.getElementById("api-result");

    loadingEl.classList.remove("hidden");
    resultEl.innerHTML = "";

    try {
      // 1. ANROP TILL API 1: Fotbollsdata (OpenLigaDB)
      const footballRes = await fetch("https://api.openligadb.de/getmatchdata/bl1");
      if (!footballRes.ok) throw new Error("Gick inte att hämta fotbollsdata");
      
      const matches = await footballRes.json();
      const nextMatch = matches[0]; // Första matchen i listan

      const homeTeam = nextMatch.team1.teamName;
      const awayTeam = nextMatch.team2.teamName;
      const location = nextMatch.location?.locationCity || "Düsseldorf";

      // Hämta koordinater för orten
      const coords = matchCities[location] || { lat: 51.2217, lon: 6.7762 };

      // 2. ANROP TILL API 2: Väderdata (Open-Meteo API)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Gick inte att hämta väderdata");

      const weatherData = await weatherRes.json();
      const temp = weatherData.current_weather.temperature;
      const windspeed = weatherData.current_weather.windspeed;

      // 3. MASHUP: Rendera resultat i DOM:en
      loadingEl.classList.add("hidden");
      resultEl.innerHTML = `
        <div class="p-5 bg-slate-800 rounded-lg border border-slate-700">
          <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Kommande Match</span>
          <h3 class="text-xl font-extrabold text-white mt-1">${homeTeam} vs ${awayTeam}</h3>
          <p class="text-sm text-slate-300 mt-1">📍 Spelort: <strong>${location}</strong></p>
          
          <div class="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
            <div>
              <span class="text-xs text-slate-400 block">Matchväder</span>
              <span class="text-2xl font-black text-amber-400">${temp} °C</span>
            </div>
            <div class="text-right">
              <span class="text-xs text-slate-400 block">Vind</span>
              <span class="text-sm font-semibold text-slate-200">${windspeed} km/h</span>
            </div>
          </div>
        </div>
      `;

      // 4. DATALAYER TRACKING (VG-spårning i GTM)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'api_mashup_search',
        'match_teams': `${homeTeam} vs ${awayTeam}`,
        'match_location': location,
        'weather_temp': temp
      });

    } catch (err) {
      loadingEl.classList.add("hidden");
      resultEl.innerHTML = `<p class="text-red-400 text-sm">Fel: ${err.message}</p>`;
      console.error(err);
    }
  });
}