//该文件使用prim算法求最小生成树

function minEdge(lowCost) {
    var min = Number.MAX_VALUE;
    var index = -1;

    for (id in lowCost) {
        if (lowCost[id].power && lowCost[id].power < min) {
            min = lowCost[id].power;
            index = id;
        }
    }
    return index;
}

function prim(adjMatrix) {
    var mst = [];
    var lowCost = {};
    var vnum = Object.keys(adjMatrix).length;
    var startId = Object.keys(adjMatrix)[0];
    for (id in adjMatrix) {
        lowCost[id] = { prev: startId, power: adjMatrix[startId][id].power };
    }

    for (let i = 1; i <= vnum - 1; i++) {
        var minId = minEdge(lowCost);
        mst.push(adjMatrix[lowCost[minId].prev][minId].edge);
        lowCost[minId] = 0;
        for (nodeId in adjMatrix) {
            if (adjMatrix[minId][nodeId].power < lowCost[nodeId].power) {
                lowCost[nodeId].prev = minId;
                lowCost[nodeId].power = adjMatrix[minId][nodeId].power;
            }
        }
    }
    return mst;
}

module.exports = { prim };