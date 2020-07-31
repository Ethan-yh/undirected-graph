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

var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 20, 20);

function createDNDImage(parent, src, title, info) {
    var img = document.createElement("img");
    img.src = src;
    img.setAttribute("draggable", "true");
    img.setAttribute("title", title);
    info = info || {};
    if (!info.image && (!info.type || info.type == "Node")) {
        info.image = "circle";
    }
    info.title = title;

    img.setAttribute(DRAGINFO_PREFIX, JSON.stringify(info));
    img.ondragstart = ondrag;
    parent.appendChild(img);
    return img;
}


var graph = new Q.Graph(canvas);
graph.callLater(function() { graph.editable = true });
var drawableInteraction = Q.DrawableInteraction(graph);

graph.removeSelectionByInteraction = function(evt) {
    graph.removeSelection();
}

var nameId = 1;


graph.onElementCreated = function(element, evt, dragInfo) {
    Q.Graph.prototype.onElementCreated.call(this, element, evt, dragInfo);
    if (element instanceof Q.Edge) {
        element.name = 10;

        element.setStyle(Q.Styles.ARROW_TO, false);

        var labelUI = new Q.LabelUI(element.name);
        var labelEditor = new Q.LabelEditor();

        var x = document.body.clientWidth / 2 + (element.from.x + element.to.x) / 2;
        var y = (document.body.clientHeight) / 2 + 100 + (element.from.y + element.to.y) / 2;
        graph.startLabelEdit(element, labelUI, labelEditor, { x: x, y: y })

        return;
    }
    if (element instanceof Q.Node) {
        if (!dragInfo.label) {
            element.name = 'Node' + nameId;
            nameId++;
        }
        element.setStyle(Q.Styles.SHAPE_FILL_COLOR, dragInfo.color);
        element.setStyle(Q.Styles.SHAPE_STROKE_STYLE, dragInfo.color);

        var labelUI = new Q.LabelUI(element.name);
        var labelEditor = new Q.LabelEditor();
        var x = document.body.clientWidth / 2 + element.x;
        var y = (document.body.clientHeight) / 2 + 118 + element.y;
        graph.startLabelEdit(element, labelUI, labelEditor, { x: x, y: y })
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
// initDatas();



function initToolbox() {
    createDNDImage(toolbox, "static/images/circle1.png", "Node", { type: "Node", color: "#515151" });
    createDNDImage(toolbox, "static/images/circle2.png", "Node", { type: "Node", color: "#d81e06" });
    createDNDImage(toolbox, "static/images/circle3.png", "Node", { type: "Node", color: "#f4ea2a" });
    createDNDImage(toolbox, "static/images/circle4.png", "Node", { type: "Node", color: "#1afa29" });
    createDNDImage(toolbox, "static/images/circle5.png", "Node", { type: "Node", color: "#1296db" });
    createDNDImage(toolbox, "static/images/node_icon.png", "Computer", { type: "Node", label: "Computer", image: "Q.Graphs.node" });
    createDNDImage(toolbox, "static/images/exchanger_icon.png", "Exchanger", { type: "Node", label: "Exchanger", image: "Q.Graphs.exchanger2" });
    createDNDImage(toolbox, "static/images/server_icon.png", "Server", { type: "Node", label: "Server", image: "Q.Graphs.server" });
    // createDNDImage(toolbox, "static/images/text_icon.png", "Text", { type: "Text", label: "Text" });
    // createDNDImage(toolbox, "static/images/group_icon.png", "Group", { type: "Group", label: "Group" });
    // createDNDImage(toolbox, "static/images/subnetwork_icon.png", "SubNetwork", { image: "Q-subnetwork", label: "SubNetwork", properties: { enableSubNetwork: true } }).style.width = '24px';
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

    var edge12 = graph.createEdge("6", node1, node2);
}

var curTab = 'tab-edit';
$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
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

//邻接链表
function getAdjList() {
    var adjListDiv;
    adjListDiv = document.getElementById('adj-list');
    var btns = document.getElementsByClassName('btn-adjList');
    if (adjListDiv) {
        adjListDiv.remove();
        for (let i = 0; i < btns.length; i++) {
            Q.removeClass(btns[i], 'active');
        }
        return;
    }

    var adjList = {};
    var adjMatrix = getDatas().adjMatrix;
    for (let i = 0; i < btns.length; i++) {
        Q.appendClass(btns[i], 'active');
    }
    for (let id1 in adjMatrix) {
        adjList[id1] = [];
        for (let id2 in adjMatrix[id1]) {
            if (id2 != id1 && adjMatrix[id1][id2].power < Number.MAX_VALUE) {
                adjList[id1].push({ nodeId: id2, power: adjMatrix[id1][id2].power });
            }

        }
    }

    adjListDiv = document.createElement('div');
    adjListDiv.id = 'adj-list'
    var adjListHead = document.createElement('h4');
    adjListHead.innerHTML = '邻接链表';
    adjListDiv.appendChild(adjListHead);

    for (let id in adjList) {
        var listItem = document.createElement('a');
        Q.appendClass(listItem, "list-group-item");
        listItem.innerHTML = '';
        listItem.innerHTML += '<strong>' + graph.getElement(id).name + ' : ' + '</strong>';
        adjList[id].forEach((e, index) => {
            if (index !== 0) {
                listItem.innerHTML += '->'
            }
            listItem.innerHTML += graph.getElement(e.nodeId).name + '(' + e.power + ')';
        });
        adjListDiv.appendChild(listItem);
    }

    var tabContentElement = document.getElementById('tab-content');
    tabContentElement.appendChild(adjListDiv);
}

function isSimpleConnectedGraph() {
    var datas = graph.graphModel.datas;
    if (datas.length == 0) {
        return 0;
    }
    for (let i = 0; i < datas.length; i++) {
        if (!datas[i].from) {
            var linkedNodes = datas[i]._linkedNodes;
            if (datas[i].edgeCount == 0) {
                return 0;
            }
            for (let id in linkedNodes) {
                if (linkedNodes[id].edges.length > 1) {
                    return 0;
                }
            }
        }
    }
    return 1;
}


//获取邻接矩阵和边集合
var adjMatrix = {};

function getDatas() {
    var datas = graph.graphModel.datas;
    adjMatrix = {};
    var edges = [];
    datas.forEach(data => {
        if (data.from) {
            edges.push({ id: data.id, from: data.from.id, to: data.to.id, power: parseFloat(data.name) });
            if (!adjMatrix[data.from.id]) {
                adjMatrix[data.from.id] = {};
            }
            if (!adjMatrix[data.to.id]) {
                adjMatrix[data.to.id] = {};
            }
            adjMatrix[data.from.id][data.to.id] = { edge: data.id, power: parseFloat(data.name) };
            adjMatrix[data.to.id][data.from.id] = { edge: data.id, power: parseFloat(data.name) };
        } else {
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

var mode;

function prim(_mode) {
    if (!isSimpleConnectedGraph()) {
        showWarning('图必须2点以上连通图，且2点之间至多只能有一条边');
        return;
    }
    mode = _mode;
    if (mst.length == 0) {
        ipcRenderer.send('getMstByPrim', getDatas().adjMatrix);

    } else {
        mstRunByMode();
    }
}

function kruskal(_mode) {
    if (!isSimpleConnectedGraph()) {
        showWarning('图必须2点以上连通图，且2点之间至多只能有一条边');
        return;
    }
    mode = _mode;
    if (mst.length == 0) {
        ipcRenderer.send('getMstByKruskal', getDatas());

    } else {
        mstRunByMode();
    }
}

//单步执行当前步骤
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



function singleSource() {
    if (!isSimpleConnectedGraph()) {
        showWarning('图必须2点以上连通图，且2点之间至多只能有一条边');
        return;
    }
    if (!source) {
        showWarning('请先点击某个点作为起点');
        return;
    }
    ipcRenderer.send('getSingleSource', { source: source.id, adjMatrix: getDatas().adjMatrix });
}

function multiSource() {
    if (!isSimpleConnectedGraph()) {
        showWarning('图必须2点以上连通图，且2点之间至多只能有一条边');
        return;
    }
    ipcRenderer.send('getMultiSource', getDatas().adjMatrix);
}

//设置透明
function setTransparent() {
    var datas = graph.graphModel.datas;
    datas.forEach((e) => {
        e.setStyle(Q.Styles.ALPHA, 0.1);
    })
}

//重置
function reset() {
    curStep = 0;
    var datas = graph.graphModel.datas;
    datas.forEach((e) => {
        e.setStyle(Q.Styles.ALPHA, 1);
    })

    if (source) {
        source.removeUI(startUI);
        source = null;
    }



    $("#singleSourcePathsList").remove();
    $("#multiSourcePathsList").remove();
}

var singlePaths;
var multiPaths;


function showPath(e) {
    var pathType = e.getAttribute('pathtype');

    var pathElements;
    var path;
    if (pathType == 'single') {
        pathElements = document.getElementsByClassName('single-source-path');
        var pathId = e.getAttribute('pathid');
        path = singlePaths[pathId];
    } else if (pathType == 'multi') {
        pathElements = document.getElementsByClassName('multi-source-path');
        var pathId1 = e.getAttribute('pathid1');
        var pathId2 = e.getAttribute('pathid2');
        path = multiPaths[pathId1][pathId2];
    }


    for (let i = 0; i < pathElements.length; i++) {
        Q.removeClass(pathElements[i], 'active');
    }
    Q.appendClass(e, 'active');

    setTransparent();
    var firstNode = graph.getElement(path[0]);
    firstNode.setStyle(Q.Styles.ALPHA, 1);
    for (let i = 1; i < path.length; i++) {
        var edgeId = adjMatrix[path[i - 1]][path[i]].edge;
        edge = graph.getElement(edgeId);
        edge.setStyle(Q.Styles.ALPHA, 1);
        edge.from.setStyle(Q.Styles.ALPHA, 1);
        edge.to.setStyle(Q.Styles.ALPHA, 1);
    }
}

var isShowingEditTooltip = false;

function showEditTooltip(btnEle) {
    var tooltipDiv = document.getElementById('edit-tooltip');
    if (isShowingEditTooltip) {
        Q.removeClass(btnEle, 'active');
        Q.appendClass(tooltipDiv, 'fade');
    } else {
        Q.appendClass(btnEle, 'active');
        Q.removeClass(tooltipDiv, 'fade');
    }

    isShowingEditTooltip = !isShowingEditTooltip;

}

ipcRenderer.on('replyMst', (event, arg) => {
    mst = arg;
    mstRunByMode();
})


function createPathListElement(path, classes, attributes) {
    var pathListItem = document.createElement("a");
    pathListItem.href = "#";
    Q.appendClass(pathListItem, "list-group-item");
    pathListItem.innerHTML = '';
    var start = graph.getElement(path[0]);
    var end = graph.getElement(path[path.length - 1]);
    pathListItem.innerHTML += '<strong>' + start.name + '-' + end.name + ' : ' + '</strong>';

    classes.forEach(className => {
        Q.appendClass(pathListItem, className);
    })

    for (let attr in attributes) {
        pathListItem.setAttribute(attr, attributes[attr]);
    }
    pathListItem.addEventListener('click', (ev) => {
        var ele = ev.target.tagName === 'A' ? ev.target : ev.target.parentElement;
        showPath(ele);
    }, true)
    path.forEach(nodeId => {
        pathListItem.innerHTML += graph.getElement(nodeId).name + ' ';
    })
    return pathListItem;
}

ipcRenderer.on('replySingleSource', (event, arg) => {
    singlePaths = arg;
    var singleSourceContent = document.getElementById('single-source-content');
    $("#singleSourcePathsList").remove();
    var singleSourcePathsList = document.createElement("div");
    singleSourcePathsList.id = "singleSourcePathsList";

    for (let id in singlePaths) {
        var pathListItem = createPathListElement(singlePaths[id], ['single-source-path'], { pathtype: 'single', pathid: id })
        singleSourcePathsList.appendChild(pathListItem);
    }

    singleSourceContent.appendChild(singleSourcePathsList);

})

ipcRenderer.on('replyMultiSource', (event, arg) => {
    multiPaths = arg;
    var multiSourceContent = document.getElementById('multi-source-content');
    $("#multiSourcePathsList").remove();
    var multiSourcePathsList = document.createElement("div");
    multiSourcePathsList.id = "multiSourcePathsList";

    for (let id1 in multiPaths) {
        for (let id2 in multiPaths[id1]) {
            var pathListItem = createPathListElement(multiPaths[id1][id2], ['multi-source-path'], { pathtype: 'multi', pathid1: id1, pathid2: id2 })
            multiSourcePathsList.appendChild(pathListItem);
        }
    }
    multiSourceContent.appendChild(multiSourcePathsList);

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
        }

    }
});

function showWarning(text) {
    $('#warning-text').alert('close');
    var infoDiv = document.createElement('div');
    infoDiv.id = 'warning-text'
    Q.appendClass(infoDiv, 'alert');
    Q.appendClass(infoDiv, 'alert-warning');
    infoDiv.innerHTML = '<a href="#" class="close" data-dismiss="alert">&times;</a>';
    infoDiv.innerHTML += text;

    var tabContentDiv = document.getElementById('tab-content');
    tabContentDiv.appendChild(infoDiv);

}





graph.onLabelEdit = function(element, label, text, elementUI) {
    if (element.from) {
        var power = parseFloat(text);
        if (power) {
            if (power < 0) {
                showWarning('请输入非负数字');
                return;
            }
            element.name = '' + power;
        } else {
            showWarning('请输入非负数字');
        }
        return;
    }
    element.name = text;
}