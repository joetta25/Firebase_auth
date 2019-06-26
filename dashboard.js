function renderArtists(artistArray){
    var artistHTML = artistArray.map((currentArtist)=> {
        return `
        <div class="card  col-3 mx-4 my-4 " style ="background-color: black;">
            <div class="card-body" style="background>
                <h5 class="card-title">${currentArtist.Name}</h5>
                <button class="btn btn-primary" type="button" onclick="favoriteArtist('${currentArtist.Name}')">add</button>
            </div>
        </div>
        `  
        
    })
    return artistHTML.join('');
}


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("search-form").addEventListener("submit", function(e) {
        e.preventDefault();
        createHTML = []
        var searchString = $(".search-bar").val().toLowerCase();

        var urlEncodedSearchString = encodeURIComponent(searchString);

        axios.get(`https://tastedive.com/api/similar?k=338887-ClassExe-02LRC1MI&type=band&q=${urlEncodedSearchString}`)
        .then(function(response){
            console.log(response.data.Search);
            debugger;

            $(".artists-container").innerHTML = renderArtists(response.data.Search);

            });

    })
})