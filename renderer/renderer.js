const { ipcRenderer } = window.nodeRequire('electron');

if (!window.getI18NString) { getI18NString = function(s) { return s; } }
///drag and drop
var DRAGINFO_PREFIX = "draginfo";

function ondrag(evt) {
    evt = evt || window.event;
    var dataTransfer = evt.dataTransfer;
    var img = evt.target;
    dataTransfer.setData("text", img.getAttribute(DRAGINFO_PREFIX));
}

function createDNDImage(parent, src, title, info) {
    var img = document.createElement("img");
    img.src = src;
    img.setAttribute("draggable", "true");
    img.setAttribute("title", title);
    info = info || {};
    if (!info.image && (!info.type || info.type == "Node")) {
        info.image = src;
    }
    info.label = info.label || title;
    info.title = title;
    img.setAttribute(DRAGINFO_PREFIX, JSON.stringify(info));
    img.ondragstart = ondrag;
    parent.appendChild(img);
    return img;
}


var graph = new Q.Graph(canvas);
graph.callLater(function() { graph.editable = true });

graph.onElementCreated = function(element, evt, dragInfo) {
    Q.Graph.prototype.onElementCreated.call(this, element, evt, dragInfo);
    if (element instanceof Q.Edge) {
        element.setStyle(Q.Styles.ARROW_TO, false);
        return;
    }
    if (element instanceof Q.Text) {
        // element.setStyle(Styles.LABEL_BACKGROUND_COLOR, "#2898E0");
        // element.setStyle(Styles.LABEL_COLOR, "#FFF");
        // element.setStyle(Styles.LABEL_PADDING, new Q.Insets(3, 5));
        return;
    }
}

var toolbox = document.createElement("div");
toolbox.id = "toolbox";


var editContent = document.getElementById("edit-content");
editContent.appendChild(toolbox);
// graph.html.parentNode.appendChild(toolbox);

function destroy() {
    toolbox.parentNode.removeChild(toolbox);
}

initToolbox();
initDatas();


function initToolbox() {
    createDNDImage(toolbox, "static/images/node_icon.png", "Mac", { type: "Node", label: "Mac", image: "Q.Graphs.node" });
    createDNDImage(toolbox, "static/images/exchanger_icon.png", "Exchanger", { type: "Node", label: "Exchanger", image: "Q.Graphs.exchanger2" });
    createDNDImage(toolbox, "static/images/server_icon.png", "Server", { type: "Node", label: "Server", image: "Q.Graphs.server" });
    createDNDImage(toolbox, "static/images/text_icon.png", "Text", { type: "Text", label: "Text" });
    createDNDImage(toolbox, "static/images/group_icon.png", "Group", { type: "Group", label: "Group" });
    createDNDImage(toolbox, "static/images/subnetwork_icon.png", "SubNetwork", { image: "Q-subnetwork", label: "SubNetwork", properties: { enableSubNetwork: true } }).style.width = '24px';
}

function initDatas() {
    var node1 = graph.createNode("A", -100, -50);
    var node2 = graph.createNode("B", 0, 0);
    var node3 = graph.createNode("C", 100, -50);
    var node4 = graph.createNode("D", -100, 70);
    var node5 = graph.createNode("E", 100, 60);
    var node6 = graph.createNode("F", 0, 100);
    var node7 = graph.createNode("G", 100, 130);

    var edge1 = graph.createEdge("7", node1, node2);
    var edge2 = graph.createEdge("5", node1, node4);

    var edge3 = graph.createEdge("8", node2, node3);
    var edge4 = graph.createEdge("9", node2, node4);
    var edge5 = graph.createEdge("7", node2, node5);

    var edge6 = graph.createEdge("5", node3, node5);

    var edge7 = graph.createEdge("15", node4, node5);
    var edge8 = graph.createEdge("6", node4, node6);

    var edge9 = graph.createEdge("8", node5, node6);
    var edge10 = graph.createEdge("9", node5, node7);

    var edge11 = graph.createEdge("11", node6, node7);
}

var curTab = 'tab-edit';
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    console.log(e.target.id)
    if (e.target.id === 'tab-edit') {
        graph.interactionMode = Q.Consts.INTERACTION_MODE_DEFAULT;
    } else {
        graph.interactionMode = Q.Consts.INTERACTION_MODE_VIEW;
        curStep = 0;
        if (e.target.id === 'tab-prim' || e.target.id === 'tab-kruskal') {
            mst = [];
        }

    }
    curTab = e.target.id;
    updateBtns();
})

$("#btn1").click(() => {
    console.log('click')
})

const titleToMode = {
    "默认模式": Q.Consts.INTERACTION_MODE_DEFAULT,
    "框选模式": Q.Consts.INTERACTION_MODE_SELECTION,
    "浏览模式": Q.Consts.INTERACTION_MODE_VIEW,
    "创建连线": Q.Consts.INTERACTION_MODE_CREATE_EDGE
}

function updateBtns() {
    var btns = document.getElementsByClassName("interaction-mode");

    for (let i = 0; i < btns.length; i++) {
        if (titleToMode[btns[i].title] === graph.interactionMode) {
            Q.appendClass(btns[i], 'active');
        } else {
            Q.removeClass(btns[i], 'active')
        }
    }
}

//设置交互模式
function setMode(e) {
    graph.interactionMode = titleToMode[e.title];
    updateBtns();
}


//缩放
function zoom(e) {
    if (e === 'in') {
        graph.zoomIn();
    } else if (e === 'out') {
        graph.zoomOut();
    } else if (e === 'center') {
        graph.moveToCenter(1);
    } else if (e === 'overview') {
        graph.zoomToOverview();
    }
}

function mstPrim() {

}



//获取邻接矩阵和边集合
var adjMatrix = {};

function getDatas() {
    var datas = graph.graphModel.datas;
    adjMatrix = {};
    var edges = [];
    datas.forEach(data => {
        if (data.from) {
            console.log('边', data);
            edges.push({ id: data.id, from: data.from.id, to: data.to.id, power: parseInt(data.name) });
            if (!adjMatrix[data.from.id]) {
                adjMatrix[data.from.id] = {};
            }
            if (!adjMatrix[data.to.id]) {
                adjMatrix[data.to.id] = {};
            }
            adjMatrix[data.from.id][data.to.id] = { edge: data.id, power: parseInt(data.name) };
            adjMatrix[data.to.id][data.from.id] = { edge: data.id, power: parseInt(data.name) };
        } else {
            console.log('点', data);
            if (!adjMatrix[data.id]) {
                adjMatrix[data.id] = {};
            }
            adjMatrix[data.id][data.id] = { edge: null, power: 0 };
        }
    });
    for (id1 in adjMatrix) {
        for (id2 in adjMatrix) {
            if (!adjMatrix[id1][id2]) {
                adjMatrix[id1][id2] = { edge: null, power: Number.MAX_VALUE }
            }
        }
    }
    return { adjMatrix, edges };
}

//最小生成树
var mst = [];

function getMst() {
    if (mst.length == 0) {
        ipcRenderer.send('getMstByPrim', getDatas().adjMatrix);
    }
}

var mode;

function prim(_mode) {
    mode = _mode;
    if (mst.length == 0) {
        ipcRenderer.send('getMstByPrim', getDatas().adjMatrix);

    } else {
        mstRunByMode();
    }
}

function kruskal(_mode) {
    mode = _mode;
    if (mst.length == 0) {
        ipcRenderer.send('getMstByKruskal', getDatas());

    } else {
        mstRunByMode();
    }
}

var curStep;

function mstRunByMode() {
    if (mode === 'run') {
        setTransparent();
        mst.forEach((nodeId) => {
            var node = graph.getElement(nodeId);
            node.setStyle(Q.Styles.ALPHA, 1);
            node.from.setStyle(Q.Styles.ALPHA, 1);
            node.to.setStyle(Q.Styles.ALPHA, 1);
        })
    } else if (mode === 'nextStep') {
        if (curStep < mst.length) {
            if (curStep === 0) {
                setTransparent();
            }
            var node = graph.getElement(mst[curStep]);
            node.setStyle(Q.Styles.ALPHA, 1);
            node.from.setStyle(Q.Styles.ALPHA, 1);
            node.to.setStyle(Q.Styles.ALPHA, 1);
            curStep++;
        }
    }
}

function setTransparent() {
    var datas = graph.graphModel.datas;
    datas.forEach((e) => {
        e.setStyle(Q.Styles.ALPHA, 0.1);
    })
}

function reset() {
    curStep = 0;
    var datas = graph.graphModel.datas;
    datas.forEach((e) => {
        e.setStyle(Q.Styles.ALPHA, 1);
    })

    if (source) {
        source.removeUI(startUI);
    }

    $("#singleSourcePathsList").remove();
}

function singleSource() {
    console.log(source);
    if (!source) {
        return;
    }
    ipcRenderer.send('getSingleSource', { source: source.id, adjMatrix: getDatas().adjMatrix });
}

var paths;

function showPath(e) {
    if (!paths) {
        return;
    }
    console.log('e', e)

    var pathId = e.getAttribute('pathid');
    console.log('pathId', pathId)
    var pathElements = document.getElementsByClassName('single-source-path');
    for (let i = 0; i < pathElements.length; i++) {
        Q.removeClass(pathElements[i], "active");
    }
    Q.appendClass(e, "active");

    setTransparent();


    var path = paths[pathId];
    console.log('path', path)
    if (path.length == 1) {
        var node = graph.getElement(pathId);
        node.setStyle(Q.Styles.ALPHA, 1);
    }
    for (let i = 1; i < path.length; i++) {
        var edgeId = adjMatrix[path[i - 1]][path[i]].edge;
        edge = graph.getElement(edgeId);
        console.log('edge', edge)
        edge.setStyle(Q.Styles.ALPHA, 1);
        edge.from.setStyle(Q.Styles.ALPHA, 1);
        edge.to.setStyle(Q.Styles.ALPHA, 1);
    }
}

ipcRenderer.on('replyMst', (event, arg) => {
    mst = arg;
    mstRunByMode();
})


ipcRenderer.on('replySingleSource', (event, arg) => {
    paths = arg;
    var singleSourceContent = document.getElementById('single-source-content');
    $("#singleSourcePathsList").remove();
    var singleSourcePathsList = document.createElement("div");
    singleSourcePathsList.id = "singleSourcePathsList";

    for (let id in paths) {
        var path = document.createElement("a");
        path.href = "#";
        Q.appendClass(path, "list-group-item");
        Q.appendClass(path, "single-source-path");
        path.innerHTML = '';

        var end = graph.getElement(paths[id][paths[id].length - 1]);
        path.innerHTML += '<strong>' + source.name + '-' + end.name + ' : ' + '</strong>';
        path.setAttribute("pathid", id);
        path.addEventListener('click', (ev) => {
            console.log(ev.target);
            showPath(ev.target);

        });

        paths[id].forEach(nodeId => {
            path.innerHTML += graph.getElement(nodeId).name + ' ';
        })
        singleSourcePathsList.appendChild(path);
    }

    singleSourceContent.appendChild(singleSourcePathsList)

})

//起点站UI
var startUI = new Q.ImageUI('./static/images/start.png');
startUI.position = Q.Position.CENTER_TOP;
startUI.anchorPosition = Q.Position.CENTER_BOTTOM;
startUI.offsetY = 10;
startUI.size = { width: 30 };

//图像交互
var source;
graph.addCustomInteraction({
    onclick: function(evt, graph) {
        reset();
        var element = graph.getElementByMouseEvent(evt);

        if (element) {
            if (curTab === 'tab-single-source') {
                if (source) {
                    source.removeUI(startUI)
                }
                if (!element.from) {
                    element.addUI(startUI);
                    source = element;
                }
            }

        } else {

            source.removeUI(startUI);
            source = null;
        }

    }
});