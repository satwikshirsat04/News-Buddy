document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.querySelector('.row');
    const countrySelect = document.getElementById('countrySelect');

    // Function to fetch and display news based on the selected country
    function fetchNews(country) {
        const apiUrl = `https://api.currentsapi.services/v1/latest-news?country=${country}&apiKey=Kj42CDH1cQ5qakxxBkgOszjvrwYD6-_U_wCu_KOmz5YKcOoO`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const articles = data.news.slice(0, 10); // Limit to top 10 articles
                let output = '';

                articles.forEach(article => {
                    output += `
                        <div class="col-md-4 my-2">
                            <div class="card">
                                <img src="${article.image || 'default-image-url.jpg'}" class="card-img-top" alt="news-image">
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description || 'No description available.'}</p>
                                    <a href="${article.url}" class="btn btn-primary" target="_blank">Read More</a>
                                    <button class="btn btn-secondary save-note" data-title="${article.title}">Save Note</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                newsContainer.innerHTML = output;

                // Add event listeners to "Save Note" buttons
                document.querySelectorAll('.save-note').forEach(button => {
                    button.addEventListener('click', saveNote);
                });
            })
            .catch(err => console.error("Error fetching the news:", err));
    }

    // Fetch news when the page loads (default country is India)
    fetchNews(countrySelect.value);

    // Fetch news when the country selection changes
    countrySelect.addEventListener('change', (event) => {
        const selectedCountry = event.target.value;
        fetchNews(selectedCountry);
    });

    // Function to save note
    function saveNote() {
        const noteTitle = this.getAttribute('data-title');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(noteTitle);
        localStorage.setItem('notes', JSON.stringify(notes));
        alert('Note saved!');
    }

    // Handle showing saved notes in the modal
    const notesModal = document.getElementById('notesModal');
    const notesList = document.getElementById('notesList');
    
    // Display notes when the modal is opened
    notesModal.addEventListener('show.bs.modal', () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesList.innerHTML = notes.map(note => `<li class="list-group-item">${note}</li>`).join('');
    });

    // Download notes as a text file
    const downloadButton = document.getElementById('downloadNotes');
    downloadButton.addEventListener('click', () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const blob = new Blob([notes.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'notes.txt';
        link.click();
    });
});

