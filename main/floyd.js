function getPaths(pathMatrix, path, start, end) {
    var middle = pathMatrix[start][end];
    if (!middle) {
        return;
    }
    getPaths(pathMatrix, path, start, middle);
    path.push(middle);
    getPaths(pathMatrix, path, middle, end);
}

function floyd(adjMatrix) {
    var pathMatrix = {};
    var dis = {};

    for (let id1 in adjMatrix) {
        for (let id2 in adjMatrix) {
            if (!dis[id1]) {
                dis[id1] = {};
            }
            dis[id1][id2] = adjMatrix[id1][id2].power;
        }
    }

    for (let id1 in dis) {
        for (let id2 in dis) {
            for (let id3 in dis) {
                if (dis[id2][id3] > dis[id2][id1] + dis[id1][id3]) {
                    dis[id2][id3] = dis[id2][id1] + dis[id1][id3];
                    if (!pathMatrix[id2]) {
                        pathMatrix[id2] = {};
                    }
                    pathMatrix[id2][id3] = id1;
                }
            }
        }
    }

    var paths = {};

    for (let id1 in adjMatrix) {
        for (let id2 in adjMatrix) {
            if (id1 != id2) {
                if (!paths[id1]) {
                    paths[id1] = {};
                }
                var path = [];
                path.push(id1);
                getPaths(pathMatrix, path, id1, id2);
                path.push(id2);
                paths[id1][id2] = path;
            }

        }
    }

    console.log(paths);
    return paths;
}

module.exports = { floyd }