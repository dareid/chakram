var chakram = require('./../lib/chakram.js'),
    expect = chakram.expect;

describe("Spotify API", function() {

    before(function () {
        var spotifyErrorSchema = {
            properties: {
                error: {
                    properties: {
                        status: {type: "integer"},
                        message: {type: "string"}
                    },
                    required: ["status", "message"]
                }
            },
            required: ["error"]
        };

        chakram.addProperty("spotify", function(){});
        chakram.addMethod("error", function (respObj, status, message) {
            expect(respObj).to.have.schema(spotifyErrorSchema);
            expect(respObj).to.have.status(status);
            expect(respObj).to.have.json('error.message', message);
            expect(respObj).to.have.json('error.status', status);
        });
        chakram.addMethod("limit", function (respObj, topLevelObjectName, limit) {
            expect(respObj).to.have.schema(topLevelObjectName, {
                required: ["limit", "items"],
                properties: {
                    limit: {minimum:limit, maximum:limit},
                    items: {minItems: limit, maxItems: limit}
                }
            });
        });
    });


    describe("Search Endpoint", function () {
        var randomArtistSearch;

        before(function () {
            randomArtistSearch = chakram.get("https://api.spotify.com/v1/search?q=random&type=artist");
        });


        it("should require a search query", function () {
            var missingQuery = chakram.get("https://api.spotify.com/v1/search?type=artist");
            return expect(missingQuery).to.be.spotify.error(400, "No search query");
        });

        it("should require an item type", function () {
            var missingType = chakram.get("https://api.spotify.com/v1/search?q=random");
            return expect(missingType).to.be.spotify.error(400, "Missing parameter type");
        });

        var shouldSupportItemType = function (type) {
            it("should support item type "+type, function () {
                var typeCheck = chakram.get("https://api.spotify.com/v1/search?q=random&type="+type);
                return expect(typeCheck).to.have.status(200);
            });
        };

        shouldSupportItemType('artist');
        shouldSupportItemType('track');
        shouldSupportItemType('album');
        shouldSupportItemType('playlist');

        it("should throw an error if an unknown item type is used", function () {
            var missingType = chakram.get("https://api.spotify.com/v1/search?q=random&type=invalid");
            return expect(missingType).to.be.spotify.error(400, "Bad search type field");
        });

        it("should by default return 20 search results", function () {
            return expect(randomArtistSearch).to.have.limit("artists", 20);
        });

        it("should support a limit parameter", function () {
            var one = chakram.get("https://api.spotify.com/v1/search?q=random&type=artist&limit=1");
            expect(one).to.have.limit("artists", 1);
            var fifty = chakram.get("https://api.spotify.com/v1/search?q=random&type=artist&limit=50");
            expect(fifty).to.have.limit("artists", 50);
            return chakram.wait();
        });

        it("should support an offset parameter", function () {
            var first = chakram.get("https://api.spotify.com/v1/search?q=random&type=artist&limit=1");
            var second = chakram.get("https://api.spotify.com/v1/search?q=random&type=artist&limit=1&offset=1");
            expect(first).to.have.json("artists.offset", 0);
            expect(second).to.have.json("artists.offset", 1);
            return chakram.all([first,second]).then(function(responses) {
                expect(responses[0].body.artists.items[0].id).not.to.equal(responses[1].body.artists.items[0].id);
                return chakram.wait();
            });
        });

        it("should only support GET calls", function () {
            this.timeout(4000);
            expect(chakram.post("https://api.spotify.com/v1/search")).to.have.status(405);
            expect(chakram.put("https://api.spotify.com/v1/search")).to.have.status(405);
            expect(chakram.delete("https://api.spotify.com/v1/search")).to.have.status(405);
            expect(chakram.patch("https://api.spotify.com/v1/search")).to.have.status(405);
            return chakram.wait();
        });

        it("should return href, id, name and popularity for all found artists", function () {
            return expect(randomArtistSearch).to.have.schema('artists.items', {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        href: {type: "string"},
                        id: {type: "string"},
                        name: {type: "string"},
                        popularity: {type: "integer"}
                    },
                    required: ["href", "id", "name", "popularity"]
                }
            });
        });
    });
});
