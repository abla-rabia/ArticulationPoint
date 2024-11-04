let id = 1;
let links = []; // Array to store created links
let nodes= [] //array to store created nodes
let graph=[];//array that holds connections of each node of the graph present in nodes ....
let nombreDeSommets = 0;
// Add Node button
document.getElementById("addNode").addEventListener("click", function () {
    let n = document.createElement("p");
    n.classList.add("node"); // Ajoute une classe pour les nœuds

    n.style.padding = "6px";
    n.style.position = "absolute";
    n.style.textAlign = "center";
    n.style.borderRadius = "100px";
    n.style.width = "30px";
    n.style.color = "white";
    n.style.height = "30px";
    n.style.left = `${Math.random() * 80 + 10}%`; // Random position for demonstration
    n.style.top = `${Math.random() * 80 + 10}%`;
    n.setAttribute("id", `node${id}`);
    n.textContent = `${id}`;
    id++;
    document.body.appendChild(n);
    nodes.push(n);
    graph.length=0;
    nombreDeSommets++;

    let isDragging = false; // Flag to track dragging state
    let offsetX, offsetY; // Variables to store the initial click position

    // Mousedown event to start dragging
    n.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - n.getBoundingClientRect().left;
        offsetY = e.clientY - n.getBoundingClientRect().top;
        n.style.cursor = "grabbing";
    });

    // Mousemove event to handle dragging
    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            n.style.left = `${e.clientX - offsetX}px`;
            n.style.top = `${e.clientY - offsetY}px`;
            updateLinks(n); // Update links while dragging
        }
    });

    // Mouseup event to stop dragging
    document.addEventListener("mouseup", function () {
        isDragging = false;
        n.style.cursor = "grab";
    });
});

// Add Link button
document.getElementById("addLink").addEventListener("click", function () {
    let selectedNodes = []; // Array to store selected nodes for linking
    // First click to select nodes
    document.addEventListener("click", function selectNode(event) {
        let targetNode = event.target;

        // Check if the clicked element is a node
        if (targetNode.tagName === "P" && targetNode.id.includes("node")) {
            if (selectedNodes.includes(targetNode)) {
                // If the node is already selected, remove it from the selection
                selectedNodes.splice(selectedNodes.indexOf(targetNode), 1);
            } else {
                selectedNodes.push(targetNode);
            }

            if (selectedNodes.length === 2) {
                // Create link only if it doesn't already exist
                if (!linkExists(selectedNodes[0], selectedNodes[1])) {
                    createLinkBetween(selectedNodes[0], selectedNodes[1]);
                }
                selectedNodes = []; // Clear the array after creating the link

                // Remove event listener to avoid continuous triggering
                document.removeEventListener("click", selectNode);
            }
        }
    });
});

// Function to create a link (line) between two nodes
function createLinkBetween(node1, node2) {
    const link = {
        element: document.createElement("div"),
        nodes: [node1, node2]
    };
    link.element.classList.add("link"); // Ajoute une classe pour les liens
    link.element.style.position = "absolute";
    link.element.style.height = "2px"; // Line thickness

    // Append the link to the body and store it
    document.body.appendChild(link.element);
    links.push(link);
 graph.length=0;

    updateLinkPosition(link); // Position the link initially
}

// Function to check if a link already exists between two nodes
function linkExists(node1, node2) {
    return links.some(link => 
        (link.nodes.includes(node1) && link.nodes.includes(node2)) ||
        (link.nodes.includes(node2) && link.nodes.includes(node1))
    );
}

// Function to update link positions based on the nodes' positions
function updateLinkPosition(link) {
    const [node1, node2] = link.nodes;
    const rect1 = node1.getBoundingClientRect();
    const rect2 = node2.getBoundingClientRect();

    // Calculate the center points of each node
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;

    // Calculate length and angle for the line
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Set line dimensions and position
    link.element.style.width = `${length}px`;
    link.element.style.transform = `rotate(${angle}deg)`;
    link.element.style.transformOrigin = "0 0"; // Rotate from the starting point
    link.element.style.left = `${x1}px`;
    link.element.style.top = `${y1}px`;
}

// Function to update links while dragging nodes
function updateLinks(node) {
    links.forEach(link => {
        if (link.nodes.includes(node)) {
            updateLinkPosition(link);
        }
    });
}


function depthFirstSearch(graph, start, visited) {
    if (!visited.has(start)) {
        console.log(start.id); // Process the node
        visited.add(start);
        
        for (const neighbor of graph) {
            depthFirstSearch(graph, neighbor, visited);
        }
    }
}
document.getElementById("reset").addEventListener("click", function() {
    // Remove all nodes from the DOM
    nodes.forEach(node => {
        document.body.removeChild(node);
    });

    // Remove all links from the DOM
    links.forEach(link => {
        document.body.removeChild(link.element);
    });
    id=1;
    // Clear arrays
    nodes.length = 0; // Reset nodes array
    links.length = 0; // Reset links array
    graph.length = 0; // Reset graph array
    nombreDeSommets = 0; // Reset the number of vertices
    document.body.removeChild(document.getElementById("textt"));
});

document.getElementById("composantsNumber").addEventListener("click",function(){
    let pointsArticulation=trouverPointsArticulation();
    
    let points = [];
    for (let artPoint of pointsArticulation){
        let nd= document.getElementById(`node${artPoint+1}`);
        nd.style.backgroundColor="#ffccbc";
        points.push(artPoint+1);
    }
    let t;
    if (document.getElementById("textt")==undefined){
     t = document.createElement("p");
    }
    else{
    t=document.getElementById("textt");
    }
    t.className="textt2"
    t.id="textt"
    t.textContent = (points.length!=0)?`Les points d'articulation sont : ${points.join(', ')}` :"Pas de points d'articulation dans le graphe.";
    document.body.appendChild(t);
    

})
function composantsCalculator(graph){
    let noVisited=new Set();    
    let numberOfComposants=0;
    let visited=new Set();
    noVisited.add(nodes[0]);

    for (const i of noVisited){
        depthFirstSearch(graph,i,visited);
        if (visited=nodes){
            numberOfComposants++;
            return numberOfComposants;
        }
        else{
            noVisited=nodes-visited;
            numberOfComposants++;
        }


    }
}


// Fonction principale pour trouver les points d'articulation dans un graphe
function trouverPointsArticulation() {
    const visited = new Array(nombreDeSommets).fill(false);
    const num = new Array(nombreDeSommets).fill(-1);
    const low = new Array(nombreDeSommets).fill(-1);
    const parent = new Array(nombreDeSommets).fill(null);
    const pointsArticulation = [];
    let temps = 0;
    if (graph.length==0){
        transformToGraph();
    }
    console.log(graph);

    // Fonction DFS pour explorer les sommets
    function DFS(u) {
        console.log(graph[u]);
        visited[u] = true;
        num[u] = low[u] = temps++;
        let enfants = 0;

        // Parcourir tous les voisins de u
        for (let v of graph[u]) {
            if (!visited[v]) { // Si v n'est pas visité, il devient un enfant de u dans le DFS
                parent[v] = u;
                enfants++;
                DFS(v);
                // Mise à jour de low[u] en fonction de low[v]
                low[u] = Math.min(low[u], low[v]);

                // Vérifier si u est un point d'articulation
                if (parent[u] === null && enfants > 1) {
                    pointsArticulation.push(u); // cas où u est la racine et a plus d'un enfant
                }
                if (parent[u] !== null && low[v] >= num[u]) {
                    pointsArticulation.push(u);
                }
            } else if (v !== parent[u]) { // Si v est déjà visité et n'est pas le parent de u
                low[u] = Math.min(low[u], num[v]);
            }
        }
    }

    // Appliquer DFS à chaque sommet non visité
    for (let u = 0; u < nombreDeSommets; u++) {
        if (!visited[u]) {
            DFS(u);
        }
    }

    // Retourner la liste des points d'articulation
    return Array.from(new Set(pointsArticulation)); // Utiliser un Set pour éviter les doublons
}

// Exemple de graphe (sous forme de liste d'adjacence)




function transformToGraph(){
    for (let i of nodes){
        let id=parseInt(i.textContent,10)-1;
        let connection=new Set();
        for (let l of links){
            let id1=parseInt(l.nodes[0].textContent,10)-1;
            let id2=parseInt(l.nodes[1].textContent,10)-1;
            if (id==id1){
                connection.add(id2);
            }
            if (id==id2){
                connection.add(id1);
            }
        }
        let con= [...connection];
        graph.push(con);
    }
}