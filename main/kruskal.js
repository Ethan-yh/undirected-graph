function kruskal(data) {
    var adjMatrix = data.adjMatrix;
    var edges = data.edges;
    var mst = [];
    var vnum = Object.keys(adjMatrix).length;
    var assist = {};

    var collection = 0;
    for (let id in adjMatrix) {
        assist[id] = collection;
        collection++;
    }

    edges.sort((a, b) => {
        return a.power - b.power;
    });


    for (let edgeId in edges) {
        var from = edges[edgeId].from;
        var to = edges[edgeId].to;

        if (assist[from] != assist[to]) {
            mst.push(edges[edgeId].id);
            for (let id in assist) {
                if (assist[id] == assist[to]) {
                    assist[id] = assist[from];
                }
            }
            if (mst.length == vnum - 1) {
                break;
            }
        }
    }
    return mst;
}

module.exports = { kruskal }