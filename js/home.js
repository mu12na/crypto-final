    // Fetch data from CoinGecko API
    async function fetchCryptoData() {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1');
        const data = await response.json();
        return data;
    }

    let allCryptos = [];
    let watchlist = [];

    // Display cryptocurrency data in table
    function displayCryptoData(data) {
        const tableBody = document.querySelector('#crypto-table tbody');
        tableBody.innerHTML = ''; // Clear existing rows

        data.forEach((crypto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${crypto.name}</td>
                <td>${crypto.symbol.toUpperCase()}</td>
                <td>$${crypto.current_price.toLocaleString()}</td>
                <td>$${crypto.market_cap.toLocaleString()}</td>
                <td class="${crypto.price_change_percentage_24h >= 0 ? 'green' : 'red'}">${crypto.price_change_percentage_24h.toFixed(2)}%</td>
                <td><button class="watchlist-btn ${watchlist.includes(crypto.id) ? 'remove' : 'add'}" onclick="toggleWatchlist('${crypto.id}')">${watchlist.includes(crypto.id) ? 'Remove' : 'Add'} to Watchlist</button></td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Sort table based on column
    function sortTable(columnIndex) {
        const table = document.getElementById('crypto-table');
        const rows = Array.from(table.rows).slice(1); // Skip header row

        const sortedRows = rows.sort((a, b) => {
            const cellA = a.cells[columnIndex].textContent.trim();
            const cellB = b.cells[columnIndex].textContent.trim();

            // Handle numeric and string sorting
            if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
                return parseFloat(cellA.replace(/[^0-9.-]+/g, '')) - parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
            }
            return cellA.localeCompare(cellB);
        });

        sortedRows.forEach(row => table.appendChild(row));
    }

    // Filter table by Top 5 or 10
    document.getElementById('top-filter').addEventListener('change', function() {
        const topCount = parseInt(this.value);
        displayCryptoData(allCryptos.slice(0, topCount));
    });

    // Add or Remove cryptocurrency from watchlist
    function toggleWatchlist(cryptoId) {
        if (watchlist.includes(cryptoId)) {
            watchlist = watchlist.filter(id => id !== cryptoId);
        } else {
            watchlist.push(cryptoId);
        }
        updateWatchlist();
        displayCryptoData(allCryptos.slice(0, document.getElementById('top-filter').value));
    }

    // Update the watchlist display
    function updateWatchlist() {
        const watchlistDiv = document.getElementById('watchlist');
        watchlistDiv.innerHTML = '';

        if (watchlist.length === 0) {
            watchlistDiv.innerHTML = 'Your watchlist is empty.';
            return;
        }

        const list = document.createElement('ul');
        watchlist.forEach(id => {
            const crypto = allCryptos.find(c => c.id === id);
            const listItem = document.createElement('li');
            listItem.textContent = `${crypto.name} (${crypto.symbol.toUpperCase()}) - $${crypto.current_price.toLocaleString()}`;
            list.appendChild(listItem);
        });

        watchlistDiv.appendChild(list);
    }

    // Initialize the page with crypto data
    async function init() {
        allCryptos = await fetchCryptoData();
        displayCryptoData(allCryptos.slice(0, 5)); // Initially show top 5
    }

    init();