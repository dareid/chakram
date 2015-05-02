describe("Promises", function () {
  it("should support asserting Biggie's best track", function () {
    var artist = "Notorious B.I.G.";
    return chakram.get("https://api.spotify.com/v1/search?q="+artist+"&type=artist")
    .then(function (searchResponse) {
      var bigID = searchResponse.body.artists.items[0].id;
      return chakram.get("https://api.spotify.com/v1/artists/"+bigID+"/top-tracks?country=GB");
    })
    .then(function (topTrackResponse) {
      var topTrack = topTrackResponse.body.tracks[0];
      expect(topTrack.name).to.contain("Old Thing Back");
    });
  });
});  