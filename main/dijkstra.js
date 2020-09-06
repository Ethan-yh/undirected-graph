//该文件使用迪杰斯特拉算法求单源最短路径

function getPath(id, prev) {
    var path = [];
    var index;
    for (index = id; prev[index]; index = prev[index]) {
        path.unshift(index);
    }
    path.unshift(index);
    return path;
}

function dijkstra(source, adjMatrix) {
    var prev = {}; //记录前驱
    var dist = {}; //记录距离
    var flag = {}; //记录是否以及找到路径
    var num = Object.keys(adjMatrix).length;
    for (let id in adjMatrix) {
        flag[id] = 0;
        prev[id] = source;
        dist[id] = adjMatrix[source][id].power;

    }

    flag[source] = 1;
    dist[source] = 0;
    prev[source] = null;

    var min;
    for (let i = 0; i < num; i++) {
        min = Number.MAX_VALUE;
        var t;
        for (let id in adjMatrix) {
            if (!flag[id] && dist[id] < min) {
                min = dist[id];
                t = id;
            }
        }
        flag[t] = 1;

        for (let id in adjMatrix) {
            if (dist[id] > min + adjMatrix[t][id].power) {
                dist[id] = min + adjMatrix[t][id].power;
                prev[id] = t;
            }
        }

    }

    var paths = {};

    for (let id in adjMatrix) {
        paths[id] = getPath(id, prev);
    }

    return paths;

}

module.exports = { dijkstra };