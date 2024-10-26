let id = 1;
let links = []; // Array to store created links
let nodes= [] //array to store created nodes
// Add Node button
document.getElementById("addNode").addEventListener("click", function () {
    let n = document.createElement("p");
    n.style.padding = "6px";
    n.style.position = "absolute";
    n.style.textAlign = "center";
    n.style.backgroundColor = "green";
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
                targetNode.style.backgroundColor = "green"; // Reset color
            } else {
                selectedNodes.push(targetNode);
                targetNode.style.backgroundColor = "red"; // Change color to indicate selection
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

    link.element.style.position = "absolute";
    link.element.style.backgroundColor = "blue";
    link.element.style.height = "2px"; // Line thickness

    // Append the link to the body and store it
    document.body.appendChild(link.element);
    links.push(link);

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


function depthFirstSearch(graph, start, visited = new Set()) {
    if (!visited.has(start)) {
        console.log(start); // Process the node
        visited.add(start);
        
        for (const neighbor in graph) {
            depthFirstSearch(graph, neighbor, visited);
        }
    }
}
document.getElementById("composantsNumber").addEventListener("click",function(){
    let visited;
    depthFirstSearch(nodes,nodes[0],visited)
    console.log(visited)
    
})
function composantsCalculator(graph){
    let noVisited=new Set();    
    let numberOfComposants=0;
    let visited;

    for (const i in noVisited){
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